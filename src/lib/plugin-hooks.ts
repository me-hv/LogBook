import { prisma } from "@/lib/prisma";

export async function triggerPluginHook(event: string, payload: any) {
  try {
    const activePlugins = await prisma.plugin.findMany({
      where: { enabled: true },
      include: { settings: true },
    });

    for (const plugin of activePlugins) {
      const settings = plugin.settings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);

      // Run sandboxed simulated hook execution
      console.log(`[Plugin System] Triggering hook "${event}" for plugin "${plugin.id}"`);

      if (plugin.id === "seo-toolkit" && event === "post.published") {
        const titleLength = payload.title?.length || 0;
        console.log(`[SEO Toolkit] Auditing post: "${payload.title}". Title length: ${titleLength} chars. Target score config: ${settings.targetScore || "85"}`);
      }

      if (plugin.id === "social-share-booster" && event === "post.published") {
        const template = settings.shareTemplate || "Check out {title} at {url}";
        const formatted = template
          .replace("{title}", payload.title || "")
          .replace("{url}", `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/blog/${payload.slug}`);
        console.log(`[Social Booster] Broadcaster announcement triggered: "${formatted}"`);
      }

      if (plugin.id === "reading-stats-widget" && event === "post.published") {
        const words = payload.content?.split(/\s+/).length || 0;
        const wpm = parseInt(settings.readingSpeed || "225", 10);
        const mins = Math.ceil(words / wpm);
        console.log(`[Reading Stats] Post word count: ${words}. Estimated reading time: ${mins} minutes.`);
      }

      if (plugin.id === "newsletter-enhancer" && event === "subscriber.created") {
        console.log(`[Newsletter Enhancer] Welcome greetings triggered for subscriber: ${payload.email}. Banner bannerText: "${settings.bannerText}"`);
      }
    }
  } catch (error) {
    console.error("[Plugin System] Hook execution failed", error);
  }
}
