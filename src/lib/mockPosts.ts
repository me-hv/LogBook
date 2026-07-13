import { Post } from "@/types";

export const MOCK_POSTS: Post[] = [
  {
    id: "post-1",
    title: "Getting Started with Next.js 15 & React 19",
    slug: "getting-started-with-nextjs-15",
    content: `
# Getting Started with Next.js 15 & React 19

Next.js 15 introduces exciting updates for building fast, developer-friendly applications. Coupled with React 19's new capabilities like Server Actions, async transitions, and native resource loading, the web ecosystem has never been stronger.

## Key Features

1. **Turbopack by default**: Extremely fast compilation and hot module reloading.
2. **Server Components**: Keep bundle sizes small by processing components on the server.
3. **Enhanced Caching**: Simple controls for setting route caching behaviors dynamically.

### Sample Code

Here is how you can render a simple component in React 19:

\`\`\`tsx
export default function Greet() {
  return <h1>Hello, World!</h1>;
}
\`\`\`

We hope you find this template useful. Happy coding!
    `,
    published: true,
    publishedAt: "2026-07-10T12:00:00Z",
    views: 342,
    readingTime: 4,
    author: {
      id: "author-1",
      name: "John Doe",
      email: "john@example.com",
    },
    category: {
      id: "cat-1",
      name: "Development",
      slug: "development",
    },
    tags: [
      {
        tag: {
          id: "tag-1",
          name: "nextjs",
          slug: "nextjs",
        },
      },
      {
        tag: {
          id: "tag-2",
          name: "react",
          slug: "react",
        },
      },
    ],
    createdAt: "2026-07-10T12:00:00Z",
    updatedAt: "2026-07-10T12:00:00Z",
  },
  {
    id: "post-2",
    title: "Mastering Tailwind CSS v4 in Next.js",
    slug: "mastering-tailwind-css-v4",
    content: `
# Mastering Tailwind CSS v4 in Next.js

Tailwind CSS v4 introduces a fully refactored engine. It replaces config files with native CSS directives, making setup simpler and compilation faster than ever.

## What is new?

- **CSS-first Configuration**: No more \`tailwind.config.js\`. Configure themes using \`@theme\` in CSS.
- **Improved Performance**: A highly optimized compiler written from the ground up.
- **Modern Color Functions**: Native support for modern color formats like OKLCH out of the box.

### Example Theme Configuration

\`\`\`css
@theme {
  --color-brand: #3b82f6;
}
\`\`\`

Try configuring your project today!
    `,
    published: true,
    publishedAt: "2026-07-08T09:30:00Z",
    views: 215,
    readingTime: 3,
    author: {
      id: "author-1",
      name: "John Doe",
      email: "john@example.com",
    },
    category: {
      id: "cat-1",
      name: "Development",
      slug: "development",
    },
    tags: [
      {
        tag: {
          id: "tag-3",
          name: "tailwind",
          slug: "tailwind",
        },
      },
      {
        tag: {
          id: "tag-1",
          name: "nextjs",
          slug: "nextjs",
        },
      },
    ],
    createdAt: "2026-07-08T09:30:00Z",
    updatedAt: "2026-07-08T09:30:00Z",
  },
  {
    id: "post-3",
    title: "Why Markdown is the Best Content Authoring Format",
    slug: "why-markdown-is-the-best",
    content: `
# Why Markdown is the Best Content Authoring Format

Markdown is a simple, lightweight markup language that allows writers to structure their articles with plain text. It is clean, portable, and extremely readable.

## Why developers love it:

1. **Version Control**: Markdown documents are plain text, making them simple to track via Git.
2. **Portability**: Write once, convert to HTML, PDF, or eBook formats anywhere.
3. **No Lock-in**: Your data is always raw text, independent of any proprietary editor.

> Markdown-first architectures make content authoring a breeze.

Write your next post in Markdown!
    `,
    published: true,
    publishedAt: "2026-07-05T14:15:00Z",
    views: 189,
    readingTime: 5,
    author: {
      id: "author-2",
      name: "Jane Smith",
      email: "jane@example.com",
    },
    category: {
      id: "cat-2",
      name: "Design",
      slug: "design",
    },
    tags: [
      {
        tag: {
          id: "tag-4",
          name: "markdown",
          slug: "markdown",
        },
      },
      {
        tag: {
          id: "tag-5",
          name: "writing",
          slug: "writing",
        },
      },
    ],
    createdAt: "2026-07-05T14:15:00Z",
    updatedAt: "2026-07-05T14:15:00Z",
  },
];
