export interface PluginInfo {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  permissions: string[];
  entrypoint: string;
  compatibleVersions: string;
  defaultSettings: Record<string, string>;
}

export const PLUGINS_REGISTRY: PluginInfo[] = [
  {
    id: "seo-toolkit",
    name: "SEO Toolkit",
    version: "1.0.0",
    author: "LogBook Team",
    description: "Exposes real-time post title length audits, keyword occurrences checks, and dynamic meta tags generation tools.",
    permissions: ["posts.read", "posts.write"],
    entrypoint: "seo-toolkit-plugin",
    compatibleVersions: "^1.0.0",
    defaultSettings: {
      focusKeywords: "javascript, nextjs",
      targetScore: "85",
    },
  },
  {
    id: "syntax-theme-pack",
    name: "Syntax Theme Pack",
    version: "1.1.2",
    author: "CodeCraft Studios",
    description: "Adds syntax highlighter code formatting themes Dracula, Monokai, and One Dark for markdown previews.",
    permissions: ["settings.write"],
    entrypoint: "syntax-highlighter",
    compatibleVersions: "^1.0.0",
    defaultSettings: {
      theme: "dracula",
      lineNumbers: "true",
    },
  },
  {
    id: "social-share-booster",
    name: "Social Share Booster",
    version: "1.0.4",
    author: "SocialFlow",
    description: "Automatically prepares post details to broadcast links to X/Twitter, Slack, and Discord web channels.",
    permissions: ["posts.read"],
    entrypoint: "social-booster",
    compatibleVersions: "^1.0.0",
    defaultSettings: {
      shareTemplate: "📣 Read my latest post: {title} at {url}!",
    },
  },
  {
    id: "reading-stats-widget",
    name: "Reading Stats Widget",
    version: "2.0.1",
    author: "MetricLog",
    description: "Tracks reading speed metrics, bounce scores, and paragraph complexity indicators.",
    permissions: ["posts.read", "analytics.read"],
    entrypoint: "reading-stats",
    compatibleVersions: "^1.0.0",
    defaultSettings: {
      readingSpeed: "225", // words per min
    },
  },
  {
    id: "newsletter-enhancer",
    name: "Newsletter Enhancer",
    version: "1.0.0",
    author: "MailEngine",
    description: "Integrates elegant newsletter signup triggers, banners, and personalized welcome greeting configurations.",
    permissions: ["users.read", "settings.write"],
    entrypoint: "newsletter-booster",
    compatibleVersions: "^1.0.0",
    defaultSettings: {
      bannerText: "Subscribe to LogBook and never miss an update!",
      buttonLabel: "Sign me up",
    },
  },
];
