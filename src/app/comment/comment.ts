import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Comment } from '../models/comment.model';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './comment.html',
  styleUrl: './comment.css'
})
export class CommentComponent {
  comments: Comment[] = [];
  newComment: Partial<Comment> = { author: '', content: '' };

  addComment() {
    if (this.newComment.author && this.newComment.content) {
      const comment: Comment = {
        id: Date.now(),
        author: this.newComment.author!,
        content: this.newComment.content!,
        createdAt: new Date()
      };
      this.comments.push(comment);
      this.newComment = { author: '', content: '' };
    }
  }
}
