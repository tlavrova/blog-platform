export interface Post {
  id: string; // Firestore document ID
  title: string;
  content: string;
  author: string;
  publishDate?: Date; // optional while waiting for serverTimestamp
  tags?: string[];
}
