export interface Comment {
  id: number;
  postId: number; // new field to associate with a Post
  author: string;
  content: string;
  createdAt: Date;
}
