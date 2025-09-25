import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PostList } from './post-list';
import { PostService } from '../services/post.service';

class MockPostService {
  getPosts() { return of([]); }
}

describe('PostList', () => {
  let component: PostList;
  let fixture: ComponentFixture<PostList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostList],
      providers: [
        { provide: PostService, useClass: MockPostService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
