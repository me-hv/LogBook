export interface Author {
  id: string;
  name: string | null;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  publishedAt: string | null;
  viewCount: number;
  readingTime: number;
  author: Author;
  category: Category | null;
  tags: { tag: Tag }[];
  createdAt: string;
  updatedAt: string;
}
