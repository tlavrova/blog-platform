import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post as PostModel } from '../models/post.model';
import { CommentComponent } from '../comment/comment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterLink, CommentComponent, FormsModule],
  templateUrl: './post.html',
  styleUrl: './post.css'
})
export class Post implements OnInit {
  @Input() post?: PostModel;
  @Input() showPreview = false;

  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Only fetch post from route if not provided via input
    if (!this.post) {
      this.loadPostFromRoute();
    }
  }

  loadPostFromRoute(): void {
    // Get the post id from the current route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Find the post with the given id
        this.post = this.getMockPosts().find(p => p.id === +id);

        if (!this.post) {
          this.notFound = true;
        }
      } else {
        // No id provided, redirect to posts list
        this.router.navigate(['/posts']);
      }
    });
  }

  getContentPreview(content: string): string {
    const maxLength = 150;
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }

  getMockPosts(): PostModel[] {
    return [
      {
        id: 1,
        title: 'Getting Started with Angular',
        content: 'Angular is a platform for building mobile and desktop web applications. It combines declarative templates, dependency injection, end to end tooling, and integrated best practices to solve development challenges. Angular empowers developers to build applications that live on the web, mobile, or the desktop.\n\nHere are some key features of Angular:\n\n1. **Components**: Angular applications are built from components. A component includes a TypeScript class with a @Component() decorator, an HTML template, and styles.\n\n2. **Templates**: Templates combine HTML with Angular markup that can modify HTML elements before they are displayed.\n\n3. **Directives**: Directives provide program logic and can transform the DOM according to Angular template syntax.\n\n4. **Dependency Injection**: Angular has a built-in dependency injection system that helps to increase efficiency and modularity.\n\n5. **Reactive Programming**: Angular uses RxJS to handle asynchronous operations like HTTP requests.',
        author: 'Jane Doe',
        publishDate: new Date('2025-07-15'),
        tags: ['Angular', 'Web Development']
      },
      {
        id: 2,
        title: 'The Power of TypeScript',
        content: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. It adds static type definitions to JavaScript, which can help you avoid many common programming errors and make your code more robust.\n\nHere\'s why TypeScript is so powerful:\n\n1. **Type Safety**: TypeScript allows you to add static types to your code, catching potential type-related errors during development rather than at runtime.\n\n2. **IDE Support**: The type information allows editors like VS Code to provide improved IntelliSense, code navigation, and refactoring tools.\n\n3. **Future JavaScript Features**: TypeScript incorporates features from future JavaScript versions and compiles them down to JavaScript that can run in current browsers.\n\n4. **Gradual Adoption**: You can incrementally convert JavaScript projects to TypeScript, annotating your code as you go.\n\n5. **Strong Ecosystem**: TypeScript is well-integrated with most JavaScript libraries and frameworks, including Angular, React, and Vue.',
        author: 'John Smith',
        publishDate: new Date('2025-07-28'),
        tags: ['TypeScript', 'JavaScript']
      },
      {
        id: 3,
        title: 'CSS Grid Layout',
        content: 'CSS Grid Layout is a two-dimensional layout system for the web. It lets you lay out items in rows and columns, and has many features that make building complex layouts straightforward.\n\nWith CSS Grid, you can create:\n\n1. **Grid Templates**: Define rows and columns for your layout with precise control over sizing.\n\n2. **Grid Areas**: Name regions of your layout and place items in them, making your CSS more readable and maintainable.\n\n3. **Responsive Layouts**: Easily create designs that adapt to different screen sizes without media queries.\n\n4. **Overlapping Elements**: Unlike many other layout systems, Grid allows elements to overlap when needed.\n\n5. **Alignment Control**: Precisely control how items are aligned and justified within their grid cells.\n\nCSS Grid works well with Flexbox, with Grid being ideal for overall page layout and Flexbox excelling at laying out items in a single row or column.',
        author: 'Alex Johnson',
        publishDate: new Date('2025-08-05'),
        tags: ['CSS', 'Web Design']
      }
    ];
  }
}
