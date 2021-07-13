import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  private subscription: Subscription[] = [];
  id: any | undefined;
  post: any;
  postForm: FormGroup = new FormGroup({});
  editMode = false;
  loading = false;
  loadingSenddata = false;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription.push(
      this.route.paramMap.subscribe(
        (params: Params) => {
          this.id = +params.get('id');
          this.getPost(this.id);
          this.editMode = params.get('id') != null;
        }
      )
    );
    this.initForm();
  }

  getPost(id: number) {
    this.loading = true;
    this.postService.getPost(id).subscribe(
      res => {
        this.post = res;
        console.log(this.post);
        this.initForm();
        this.loading = false;
      },
      err => {
        this.router.navigate(['/posts']);
        this.loading = false;
      }
    )
  }

  updatePost() {
    this.loadingSenddata = true;
    const post = {
      title: this.postForm.get('title')?.value,
      body: this.postForm.get('body')?.value,
    };
    const id = this.id;
    this.postService.updatePost(id, post).subscribe(
      res => {
        this.post = res;
        this.loadingSenddata = false;
      },
      err => {
        this.loadingSenddata = false;
      }
    )
  }

  deletePost() {
    const id = this.id;
    this.postService.deletePost(id).subscribe(
      res => {
        this.router.navigate(['/posts']);
      },
      err => {

      }
    )
  }

  initForm() {
    this.postForm = new FormGroup({
      title: new FormControl(''),
      body: new FormControl('')
    });
    if (this.editMode && this.post) {
      this.postForm.patchValue({
        title: this.post.title,
        body: this.post.body
      });
    }
  }

}
