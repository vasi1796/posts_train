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
  private postsUpdate = new Subject<{posts:PostModel[],postNumber:number}>();
  getPosts(postsPerPage:number,currentPage:number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message:string;posts:any;maxPosts:number}>('/api/posts'+queryParams)
    .pipe(map((postData) => {
      return {posts:postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          _id: post._id,
          imagePath: post.imagePath
        };
      }),
      maxPosts:postData.maxPosts};
    }))
    .subscribe(
      (transformedPostData) => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.postsUpdate.next(
          {posts:[...this.posts],
          postNumber:transformedPostData.maxPosts
          });
      }
    );
    return [...this.posts];
  }
  addPost(title: string, content: string, image:File) {
    const postData = new FormData();
    postData.append("title",title);
    postData.append("content",title);
    postData.append("image",image,title);
    this.http.post<{message: string, post: PostModel}>('/api/posts', postData).subscribe(
      (responseData) => {
        this.router.navigate(["/"]);
      });
  }
  getPostUpdateListener() {
    return this.postsUpdate.asObservable();
  }
  deletePost(postId: string) {
    return this.http.delete('/api/posts/' + postId);
  }
  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      '/api/posts/' + id
    );
  }
  updatePost(id: string, title: string, content: string) {
    const post: PostModel = {_id: id, title: title, content: content,imagePath:null};
    this.http.put('/api/posts/' + id, post)
    .subscribe(res =>{
      this.router.navigate(["/"]);
    });
  }
  constructor(private http: HttpClient, private router: Router) { }
}
