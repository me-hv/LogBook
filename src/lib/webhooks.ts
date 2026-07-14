import { prisma } from "@/lib/prisma";

export async function dispatchWebhookEvent(event: string, payload: any) {
  try {
    const webhooks = await prisma.webhook.findMany({
      where: { active: true },
    });

    const activeHooks = webhooks.filter((w) =>
      w.events.split(",").map((e) => e.trim()).includes(event)
    );

    for (const hook of activeHooks) {
      // Async POST dispatch
      fetch(hook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-LogBook-Signature": hook.secret,
          "X-LogBook-Event": event,
        },
        body: JSON.stringify({
          event,
          createdAt: new Date().toISOString(),
          data: payload,
        }),
      }).catch((err) => console.error(`Webhook send failed for URL: ${hook.url}`, err));
    }
  } catch (error) {
    console.error("Failed to query webhooks for dispatch", error);
  }
}

/**
 * Headless integration helper: post message announcements to Discord / Slack channels.
 */
export async function dispatchThirdPartyAnnouncements(post: { title: string; slug: string; excerpt: string | null }) {
  try {
    // Read webhooks configured in settings.json
    const fs = require("fs");
    const path = require("path");
    const settingsPath = path.join(process.cwd(), "src/lib/settings.json");

    if (!fs.existsSync(settingsPath)) return;
    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));

    const postUrl = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/blog/${post.slug}`;
    const announcementText = `📣 **New Article Published!** \n\n**${post.title}**\n${post.excerpt || "Read the latest update on LogBook."}\n\n👉 Read here: ${postUrl}`;

    // Discord Webhook integration
    if (settings.discordWebhookUrl) {
      fetch(settings.discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: announcementText }),
      }).catch((err) => console.error("Discord announcement failed", err));
    }

    // Slack Webhook integration
    if (settings.slackWebhookUrl) {
      fetch(settings.slackWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: announcementText }),
      }).catch((err) => console.error("Slack announcement failed", err));
    }
  } catch (error) {
    console.error("Failed to post third party integration updates", error);
  }
}
