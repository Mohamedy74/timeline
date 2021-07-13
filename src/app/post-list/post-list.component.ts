import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PostService } from '../post.service';
import { debounceTime, delay, map, startWith } from 'rxjs/operators';
import { asyncScheduler, Observable } from 'rxjs';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  searchControl = new FormControl();
  filteredPosts: Observable<Post[]> | undefined;
  loading = false;

  constructor(
    private postService: PostService
  ) {

  }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.loading = true;
    this.postService.getPosts().subscribe(
      (res: any) => {
        this.posts = res;
        this.loading = false;
        this.filterPosts();
      },
      err => {

      }
    )
  }

  filterPosts() {
    this.filteredPosts = this.searchControl.valueChanges
      .pipe(
        map((value: any) => {
          return value ? this.posts
            .filter(post => post.title.toLowerCase().includes(value.toLowerCase()))
            : this.posts;
        }),
        debounceTime(2500),
        startWith(this.posts, asyncScheduler),
        delay(0)
      )
  }

}

