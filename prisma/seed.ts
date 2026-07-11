import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding database...");

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@logbook.com" },
    update: {},
    create: {
      name: "LogBook Admin",
      email: "admin@logbook.com",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=admin",
      role: "ADMIN",
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 2. Create 3 Categories
  const categoriesData = [
    {
      name: "Development",
      slug: "development",
      description: "Articles about modern software engineering, web development, and coding best practices.",
    },
    {
      name: "Design",
      slug: "design",
      description: "Insights into UI/UX, user experience design, typography, and creative workflows.",
    },
    {
      name: "Product",
      slug: "product",
      description: "Posts related to product management, project roadmaps, and growth strategies.",
    },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { description: cat.description, name: cat.name },
      create: cat,
    });
    categories[cat.slug] = createdCat;
  }
  console.log(`Seeded ${Object.keys(categories).length} categories.`);

  // 3. Create 5 Tags
  const tagsData = [
    { name: "NextJS", slug: "nextjs" },
    { name: "React", slug: "react" },
    { name: "Tailwind", slug: "tailwind" },
    { name: "Markdown", slug: "markdown" },
    { name: "TypeScript", slug: "typescript" },
  ];

  const tags: Record<string, any> = {};
  for (const tag of tagsData) {
    const createdTag = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: tag,
    });
    tags[tag.slug] = createdTag;
  }
  console.log(`Seeded ${Object.keys(tags).length} tags.`);

  // Clear existing posts to ensure seed data is clean
  // (In production, use standard upsert, but for clean sample data we can drop and create or upsert)
  await prisma.post.deleteMany({
    where: {
      slug: {
        in: [
          "getting-started-with-nextjs-15",
          "mastering-tailwind-css-v4",
          "why-markdown-is-the-best",
        ],
      },
    },
  });

  // 4. Create 3 Sample Posts
  const postsData = [
    {
      title: "Getting Started with Next.js 15 & React 19",
      slug: "getting-started-with-nextjs-15",
      excerpt: "An introductory guide to Next.js 15 and React 19.",
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
      coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      status: "published",
      readingTime: 4,
      views: 120,
      publishedAt: new Date("2026-07-10T12:00:00Z"),
      authorId: admin.id,
      categoryId: categories["development"].id,
      tagSlugs: ["nextjs", "react", "typescript"],
    },
    {
      title: "Mastering Tailwind CSS v4 in Next.js",
      slug: "mastering-tailwind-css-v4",
      excerpt: "Learn how to use Tailwind CSS v4 in your Next.js project.",
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
      coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8",
      status: "published",
      readingTime: 3,
      views: 85,
      publishedAt: new Date("2026-07-08T09:30:00Z"),
      authorId: admin.id,
      categoryId: categories["development"].id,
      tagSlugs: ["tailwind", "nextjs"],
    },
    {
      title: "Why Markdown is the Best Content Authoring Format",
      slug: "why-markdown-is-the-best",
      excerpt: "A deep dive into why Markdown is the ultimate content format for writers.",
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
      coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
      status: "draft",
      readingTime: 5,
      views: 0,
      publishedAt: null,
      authorId: admin.id,
      categoryId: categories["design"].id,
      tagSlugs: ["markdown"],
    },
  ];

  for (const post of postsData) {
    const { tagSlugs, ...postDetails } = post;
    const createdPost = await prisma.post.create({
      data: postDetails,
    });

    // Seed post-tag relations
    for (const tagSlug of tagSlugs) {
      await prisma.postTag.create({
        data: {
          postId: createdPost.id,
          tagId: tags[tagSlug].id,
        },
      });
    }
  }

  console.log("Seeding sample posts completed.");
  console.log("Seeding successfully completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
