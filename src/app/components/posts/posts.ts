import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './posts.html',
  styleUrl: './posts.css'
})
export class Posts implements OnInit {
  posts: Post[] = [];

  constructor() {}

  ngOnInit(): void {
    // In a real application, this data would come from a service
    this.posts = this.getMockPosts();
  }

  getMockPosts(): Post[] {
    return [
      {
        id: 1,
        title: 'Getting Started with Angular',
        content: 'Angular is a platform for building mobile and desktop web applications...',
        author: 'Jane Doe',
        publishDate: new Date('2025-07-15'),
        tags: ['Angular', 'Web Development']
      },
      {
        id: 2,
        title: 'The Power of TypeScript',
        content: 'TypeScript is a strongly typed programming language that builds on JavaScript...',
        author: 'John Smith',
        publishDate: new Date('2025-07-28'),
        tags: ['TypeScript', 'JavaScript']
      },
      {
        id: 3,
        title: 'CSS Grid Layout',
        content: 'CSS Grid Layout is a two-dimensional layout system for the web...',
        author: 'Alex Johnson',
        publishDate: new Date('2025-08-05'),
        tags: ['CSS', 'Web Design']
      }
    ];
  }
}
