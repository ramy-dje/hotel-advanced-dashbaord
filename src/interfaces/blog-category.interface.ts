// the blog category interface
export default interface BlogCategoryInterface {
  name: string;
  createdAt: string | Date;
  id: string;
}
// the create blog category interface
export interface CreateBlogCategoryInterface {
  name: string;
}
