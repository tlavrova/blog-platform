import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, query, where, orderBy, deleteDoc, doc, serverTimestamp, getDocs } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private commentsCol: any; // initialized in constructor

  constructor(private firestore: Firestore) {
    this.commentsCol = collection(this.firestore, 'comments');
  }

  getCommentsForPost(postId: string): Observable<Comment[]> {
    const q = query(this.commentsCol, where('postId', '==', postId), orderBy('createdAt', 'asc'));
    return (collectionData(q, { idField: 'id' } as any) as Observable<any[]>).pipe(
      map((rows: any[]) => rows.map(r => this.mapComment(r)))
    );
  }

  addComment(postId: string, author: string, content: string): Promise<string> {
    return addDoc(this.commentsCol, {
      postId,
      author,
      content,
      createdAt: serverTimestamp()
    }).then(ref => ref.id);
  }

  deleteComment(id: string): Promise<void> {
    const ref = doc(this.firestore, `comments/${id}`);
    return deleteDoc(ref);
  }

  async deleteCommentsForPost(postId: string): Promise<void> {
    const q = query(this.commentsCol, where('postId', '==', postId));
    const snapshot = await getDocs(q);
    const deletions: Promise<void>[] = [];
    snapshot.forEach(d => {
      deletions.push(deleteDoc(doc(this.firestore, `comments/${d.id}`)));
    });
    await Promise.all(deletions);
  }

  private mapComment(raw: any): Comment {
    return {
      id: raw.id,
      postId: raw.postId,
      author: raw.author,
      content: raw.content,
      createdAt: raw.createdAt ? (raw.createdAt.toDate ? raw.createdAt.toDate() : raw.createdAt) : undefined
    };
  }
}
