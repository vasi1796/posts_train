import { Injectable } from '@angular/core';
import { PostModel } from './post-model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: PostModel[] = [];
  private postsUpdate = new Subject<PostModel[]>();
  getPosts() {
    this.http.get<PostModel[]>('/api/posts')
    .pipe(map((postData) => {
      return postData.map(post => {
        return {
          title: post.title,
          content: post.content,
          _id: post._id
        };
      });
    }))
    .subscribe(
      (transformedPosts) => {
        console.log(transformedPosts);
        this.posts = transformedPosts;
        this.postsUpdate.next([...this.posts]);
      }
    );
    return [...this.posts];
  }
  addPost(title: string, content: string) {
    const post: PostModel = {
      _id: null,
      title: title,
      content: content
    };
    this.http.post<{message: string, postId: string}>('/api/posts', post).subscribe(
      (responseData) => {
        const postId = responseData.postId;
        post._id = postId;
        this.posts.push(post);
        this.postsUpdate.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }
  getPostUpdateListener() {
    return this.postsUpdate.asObservable();
  }
  deletePost(postId: string) {
    this.http.delete('/api/posts/' + postId).subscribe(
      () => {
        const updatedPosts = this.posts.filter(post => post._id != postId);
        this.posts = updatedPosts;
        this.postsUpdate.next([...this.posts]);
      }
    );
  }
  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      '/api/posts/' + id
    );
  }
  updatePost(id: string, title: string, content: string) {
    const post: PostModel = {_id: id, title: title, content: content};
    this.http.put('/api/posts/' + id, post)
    .subscribe(res =>{
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p=>p._id===post._id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdate.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }
  constructor(private http: HttpClient, private router: Router) { }
}
