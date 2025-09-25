import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post as PostModel } from '../models/post.model';
import { Post } from '../post/post';
import { FormsModule } from '@angular/forms';
import { PostService } from '../services/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink, Post, FormsModule],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css'
})
export class PostList implements OnInit, OnDestroy {
  posts: PostModel[] = [];
  private sub?: Subscription;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.sub = this.postService.getPosts().subscribe(posts => this.posts = posts);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
