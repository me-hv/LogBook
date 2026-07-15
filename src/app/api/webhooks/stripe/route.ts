import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event;
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // In development/test mode without keys, parse JSON body directly
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error("Webhook Signature Verification Failed:", err.message);
    return NextResponse.json({ error: "Webhook Error: " + err.message }, { status: 400 });
  }

  const data = event.data.object;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const tenantId = data.client_reference_id || data.metadata?.tenantId;
        const plan = data.metadata?.plan?.toUpperCase() || "FREE";
        
        if (tenantId) {
          await prisma.tenant.update({
            where: { id: tenantId },
            data: {
              plan: plan as any,
              stripeCustomerId: data.customer as string,
              stripeSubscriptionId: data.subscription as string,
              subscriptionStatus: "active",
            },
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = data;
        const tenant = await prisma.tenant.findUnique({
          where: { stripeCustomerId: subscription.customer as string },
        });

        if (tenant) {
          // Resolve plan enum from stripe price mapping
          let resolvedPlan = "FREE";
          if (subscription.items.data[0].price.id === process.env.STRIPE_STARTER_PRICE_ID) resolvedPlan = "STARTER";
          else if (subscription.items.data[0].price.id === process.env.STRIPE_PRO_PRICE_ID) resolvedPlan = "PRO";
          else if (subscription.items.data[0].price.id === process.env.STRIPE_BUSINESS_PRICE_ID) resolvedPlan = "BUSINESS";

          await prisma.tenant.update({
            where: { id: tenant.id },
            data: {
              plan: resolvedPlan as any,
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0].price.id,
              subscriptionStatus: subscription.status,
              subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = data;
        const tenant = await prisma.tenant.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (tenant) {
          await prisma.tenant.update({
            where: { id: tenant.id },
            data: {
              plan: "FREE",
              stripeSubscriptionId: null,
              stripePriceId: null,
              subscriptionStatus: "canceled",
            },
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = data;
        const tenant = await prisma.tenant.findUnique({
          where: { stripeCustomerId: invoice.customer as string },
        });

        if (tenant) {
          await prisma.invoice.create({
            data: {
              tenantId: tenant.id,
              amount: invoice.amount_paid,
              currency: invoice.currency,
              status: "PAID",
              stripeInvoiceId: invoice.id,
              paidAt: new Date(),
            },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = data;
        const tenant = await prisma.tenant.findUnique({
          where: { stripeCustomerId: invoice.customer as string },
        });

        if (tenant) {
          await prisma.invoice.create({
            data: {
              tenantId: tenant.id,
              amount: invoice.amount_due,
              currency: invoice.currency,
              status: "FAILED",
              stripeInvoiceId: invoice.id,
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe Webhook Event: ${event.type}`);
    }
  } catch (err: any) {
    console.error(`Error processing Stripe event ${event.type}:`, err.message);
    return NextResponse.json({ error: "Database Sync Error: " + err.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
export const dynamic = "force-dynamic";
