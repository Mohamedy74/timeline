import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PostService } from '../post.service';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  searchControl = new FormControl("");
  filteredPosts: Observable<Post[]>;

  constructor(
    private postService: PostService
  ) {

  }

  ngOnInit(): void {
    this.getPosts();
    this.filterPosts();
  }

  getPosts() {
    this.postService.getPosts().subscribe(
      (res: any) => {
        this.posts = res;
      },
      err => {

      }
    )
  }

  filterPosts() {
    this.filteredPosts = this.searchControl.valueChanges
      .pipe(
        debounceTime(200),
        startWith(''),
        map(value => typeof value === 'string' ? value : value.title),
        map(title => title ? this._filter(title) : this.posts.slice())
      );
  }

  private _filter(title: string): Post[] {
    const filterValue = title.toLowerCase();
    return this.posts.filter(post => post.title.toLowerCase().includes(filterValue));
  }


}

