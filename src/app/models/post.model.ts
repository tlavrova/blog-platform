export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  publishDate: Date;
  tags?: string[];
}

