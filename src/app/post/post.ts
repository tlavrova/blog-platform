import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post as PostModel } from '../models/post.model';
import { CommentComponent } from '../comment/comment';
import { FormsModule } from '@angular/forms';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import { Observable, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterLink, CommentComponent, FormsModule],
  templateUrl: './post.html',
  styleUrl: './post.css'
})
export class Post implements OnInit, OnDestroy {
  @Input() post?: PostModel; // If provided (preview mode) we don't fetch
  @Input() showPreview = false;

  notFound = false;
  private routeSub?: Subscription;
  private postSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    if (!this.post) {
      this.loadPostFromRoute();
    }
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.postSub?.unsubscribe();
  }

  loadPostFromRoute(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.postSub?.unsubscribe();
        this.postSub = this.postService.getPostById(id).subscribe(p => {
          if (p) {
            this.post = p;
            this.notFound = false;
          } else {
            this.notFound = true;
          }
        });
      } else {
        this.router.navigate(['/posts']);
      }
    });
  }

  async deletePost(): Promise<void> {
    if (!this.post) return;
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;
    try {
      await this.commentService.deleteCommentsForPost(this.post.id);
      await this.postService.deletePost(this.post.id);
      this.router.navigate(['/posts']);
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  }

  getContentPreview(content: string): string {
    const maxLength = 150;
    return content.length <= maxLength ? content : content.substring(0, maxLength) + '...';
  }
}
