// the blog interface
export default interface BlogInterface {
  title: string;
  content: string;
  image: string;
  author: string;
  categories: {
    name: string;
    id: string;
  }[];
  tags: {
    name: string;
    id: string;
  }[];
  readTime: number; // min 1
  seo: {
    title: string;
    description: string; // 160 characters is good for seo
    keywords: string[];
    slug: string;
  };
  createdAt: string | Date;
  updateAt: string | Date; // IOS Date
  id: string;
}
// the create blog interface
export interface CreateBlogInterface {
  title: string;
  content: string;
  image: string;
  author: string;
  readTime: number;
  categories: string[];
  tags: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
  };
}
