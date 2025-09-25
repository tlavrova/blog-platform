import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { Comment } from '../models/comment.model';
import { CommentService } from '../services/comment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [FormsModule, DatePipe, NgIf],
  templateUrl: './comment.html',
  styleUrl: './comment.css'
})
export class CommentComponent implements OnInit, OnDestroy {
  @Input() postId!: string; // Firestore document ID
  comments: Comment[] = [];
  newComment: Partial<Comment> = { author: '', content: '' };
  private sub?: Subscription;

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    if (this.postId == null) {
      console.warn('CommentComponent initialized without a postId');
      return;
    }
    this.sub = this.commentService.getCommentsForPost(this.postId).subscribe(list => this.comments = list);
  }

  addComment() {
    if (!this.postId || !this.newComment.author || !this.newComment.content) return;
    this.commentService.addComment(this.postId, this.newComment.author, this.newComment.content)
      .then(() => {
        this.newComment = { author: '', content: '' };
      })
      .catch(err => console.error('Failed to add comment', err));
  }

  deleteComment(id: string) {
    this.commentService.deleteComment(id).catch(err => console.error('Failed to delete comment', err));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
