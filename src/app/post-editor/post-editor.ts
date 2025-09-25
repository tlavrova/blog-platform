import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../models/post.model';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './post-editor.html',
  styleUrl: './post-editor.css'
})
export class PostEditor implements OnInit {
  postForm: FormGroup;
  isEditMode = false;
  postId: number | null = null;
  submitButtonText = 'Create Post';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      author: ['', Validators.required],
      tags: this.fb.array([])
    });

    // Initialize with at least one empty tag field
    this.addTag();
  }

  ngOnInit(): void {
    // Check if we're in edit mode (URL contains a post ID)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.postId = +id;
        this.submitButtonText = 'Update Post';
        this.loadPostData(this.postId);
      }
    });
  }

  // Get the tags FormArray
  get tagsArray(): FormArray {
    return this.postForm.get('tags') as FormArray;
  }

  // Add a new tag field
  addTag(): void {
    this.tagsArray.push(this.fb.group({
      tag: ['', Validators.required]
    }));
  }

  // Remove tag at specified index
  removeTag(index: number): void {
    if (this.tagsArray.length > 1) {
      this.tagsArray.removeAt(index);
    } else {
      // If it's the last tag, just clear it instead of removing
      (this.tagsArray.at(0) as FormGroup).get('tag')?.setValue('');
    }
  }

  // Load post data when in edit mode
  loadPostData(id: number): void {
    const post = this.postService.getPostById(id);

    if (post) {
      // Clear existing tags
      while (this.tagsArray.length) {
        this.tagsArray.removeAt(0);
      }

      // Add each tag from the post
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach(tag => {
          this.tagsArray.push(this.fb.group({
            tag: [tag, Validators.required]
          }));
        });
      } else {
        // If no tags, add an empty one
        this.addTag();
      }

      // Update form values
      this.postForm.patchValue({
        title: post.title,
        content: post.content,
        author: post.author
      });
    } else {
      // Post not found, redirect to post list
      this.router.navigate(['/posts']);
    }
  }

  onSubmit(): void {
    if (this.postForm.invalid) return;

    const formValues = this.postForm.value;
    const tags = formValues.tags
      .map((tagGroup: { tag: string }) => tagGroup.tag)
      .filter((tag: string) => tag && tag.trim() !== '');

    if (this.isEditMode && this.postId != null) {
      this.postService.updatePost(this.postId, {
        title: formValues.title,
        content: formValues.content,
        author: formValues.author,
        tags
      });
      console.log('Updated post', this.postId);
    } else {
      const created = this.postService.createPost({
        title: formValues.title,
        content: formValues.content,
        author: formValues.author,
        tags
      });
      this.postId = created.id;
      console.log('Created post', created.id);
    }

    this.router.navigate(['/posts']);
  }
}
