import Stripe from "stripe";

// Initialize Stripe Client with a fallback mock key to prevent runtime crashes
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_stripe_secret_key_for_logbook_platform", {
  apiVersion: "2024-12-18.acast" as any,
});

export const STRIPE_PRICES: Record<string, string> = {
  FREE: "price_free",
  STARTER: "price_starter_29",
  PRO: "price_pro_99",
  BUSINESS: "price_business_299",
  ENTERPRISE: "price_enterprise_custom",
};

/**
 * Generate Stripe checkout session.
 */
export async function createCheckoutSession(params: {
  tenantId: string;
  email: string;
  planName: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  // If no Stripe secret key is present in environment, fallback to simulated checkout URL!
  if (!process.env.STRIPE_SECRET_KEY) {
    const mockSessionUrl = `${params.successUrl}?session_id=mock_session_${Date.now()}&plan=${params.planName}`;
    return { id: "mock_session_id", url: mockSessionUrl };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: params.email,
      client_reference_id: params.tenantId,
      metadata: {
        tenantId: params.tenantId,
        plan: params.planName,
      },
      success_url: params.successUrl + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: params.cancelUrl,
    });

    return { id: session.id, url: session.url };
  } catch (error: any) {
    console.error("Stripe Session Creation failed:", error);
    throw error;
  }
}

/**
 * Generate Stripe billing customer portal session.
 */
export async function createPortalSession(customerId: string, returnUrl: string) {
  if (!process.env.STRIPE_SECRET_KEY || customerId.startsWith("mock_")) {
    // Return a mock portal URL that redirect back with success indicators
    return { url: returnUrl + "?portal_action=mock_portal_success" };
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return { url: session.url };
  } catch (error: any) {
    console.error("Stripe Portal Session Creation failed:", error);
    throw error;
  }
}
