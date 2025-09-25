import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  comments$ = this.commentsSubject.asObservable();

  addComment(comment: Omit<Comment, 'id' | 'createdAt'>): Comment {
    const newComment: Comment = {
      ...comment,
      id: Date.now(),
      createdAt: new Date()
    };
    this.commentsSubject.next([...this.commentsSubject.value, newComment]);
    return newComment;
  }

  getCommentsForPost(postId: number): Observable<Comment[]> {
    return new Observable(observer => {
      const subscription = this.comments$.subscribe(all => {
        observer.next(all.filter(c => c.postId === postId));
      });
      return () => subscription.unsubscribe();
    });
  }

  deleteComment(id: number): void {
    this.commentsSubject.next(this.commentsSubject.value.filter(c => c.id !== id));
  }

  deleteCommentsForPost(postId: number): void {
    this.commentsSubject.next(this.commentsSubject.value.filter(c => c.postId !== postId));
  }
}

