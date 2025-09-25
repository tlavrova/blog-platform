export interface Comment {
  id: string; // Firestore document ID
  postId: string; // associated Post document ID
  author: string;
  content: string;
  createdAt?: Date; // optional until resolved from serverTimestamp
}
