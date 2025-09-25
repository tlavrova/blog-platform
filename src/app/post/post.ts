import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post as PostModel } from '../models/post.model';
import { CommentComponent } from '../comment/comment';
import { FormsModule } from '@angular/forms';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterLink, CommentComponent, FormsModule],
  templateUrl: './post.html',
  styleUrl: './post.css'
})
export class Post implements OnInit, OnDestroy {
  @Input() post?: PostModel;
  @Input() showPreview = false;

  notFound = false;
  private routeSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    // Only fetch post from route if not provided via input
    if (!this.post) {
      this.loadPostFromRoute();
    }
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  loadPostFromRoute(): void {
    // Get the post id from the current route
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const found = this.postService.getPostById(+id);
        if (found) {
          this.post = found;
          this.notFound = false;
        } else {
          this.notFound = true;
        }
      } else {
        // No id provided, redirect to posts list
        this.router.navigate(['/posts']);
      }
    });
  }

  deletePost(): void {
    if (!this.post) return;
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      // delete related comments first
      this.commentService.deleteCommentsForPost(this.post.id);
      this.postService.deletePost(this.post.id);
      this.router.navigate(['/posts']);
    }
  }

  getContentPreview(content: string): string {
    const maxLength = 150;
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }
}
