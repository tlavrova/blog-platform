import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, docData, updateDoc, deleteDoc, serverTimestamp, DocumentReference, query, orderBy } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private postsCol: any; // initialized in constructor

  constructor(private firestore: Firestore) {
    this.postsCol = collection(this.firestore, 'posts');
  }

  getPosts(): Observable<Post[]> {
    // order by publishDate descending (may require composite index when combined with other filters later)
    const q = query(this.postsCol, orderBy('publishDate', 'desc'));
    return (collectionData(q, { idField: 'id' } as any) as Observable<any[]>).pipe(
      map((docs: any[]) => docs.map(d => this.mapPost(d)))
    );
  }

  getPostById(id: string): Observable<Post | undefined> {
    const ref = doc(this.firestore, `posts/${id}`);
    return (docData(ref, { idField: 'id' } as any) as Observable<any>).pipe(
      map((d: any) => d ? this.mapPost(d) : undefined)
    );
  }

  async createPost(data: Omit<Post, 'id' | 'publishDate'>): Promise<string> {
    const docRef: DocumentReference = await addDoc(this.postsCol, {
      title: data.title,
      content: data.content,
      author: data.author,
      tags: data.tags || [],
      publishDate: serverTimestamp()
    });
    return docRef.id;
  }

  updatePost(id: string, changes: Partial<Omit<Post, 'id'>>): Promise<void> {
    const ref = doc(this.firestore, `posts/${id}`);
    return updateDoc(ref, { ...changes });
  }

  deletePost(id: string): Promise<void> {
    const ref = doc(this.firestore, `posts/${id}`);
    return deleteDoc(ref);
  }

  private mapPost(raw: any): Post {
    return {
      id: raw.id,
      title: raw.title,
      content: raw.content,
      author: raw.author,
      tags: raw.tags || [],
      publishDate: raw.publishDate ? (raw.publishDate.toDate ? raw.publishDate.toDate() : raw.publishDate) : undefined
    };
  }
}
