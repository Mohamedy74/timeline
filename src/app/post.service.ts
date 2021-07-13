import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  getPosts() {
    return this.http.get(environment.baseUrl + 'posts');
  }

  getPost(id: number) {
    return this.http.get(environment.baseUrl + 'posts/' + id);
  }

  updatePost(id: number, post: any) {
    return this.http.put(environment.baseUrl + 'posts/' + id, post);
  }

  deletePost(id: number) {
    return this.http.delete(environment.baseUrl + 'posts/' + id);
  }
}
