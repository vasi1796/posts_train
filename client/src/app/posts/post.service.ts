import { Injectable } from '@angular/core';
import { PostModel } from './post-model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: PostModel[] = [];
  private postsUpdate = new Subject<PostModel[]>();
  getPosts(){
    this.http.get<PostModel[]>('/api/posts')
    .pipe(map((postData)=>{
      return postData.map(post=>{
        return {
          title: post.title,
          content: post.content,
          id: post._id
        }
      })
    }))
    .subscribe(
      (transformedPosts)=>{
        console.log(transformedPosts);
        this.posts = transformedPosts;
        this.postsUpdate.next([...this.posts]);
      }
    );
    return [...this.posts];
  }
  addPost(title:string,content:string){
    const post:PostModel={
      id:null,
      title:title,
      content:content
    }
    this.http.post<{message:string,postId:string}>('/api/posts',post).subscribe(
      (responseData)=>{
        const postId = responseData.postId;
        post.id = postId;
        this.posts.push(post);
        this.postsUpdate.next([...this.posts]);
      });
  }
  getPostUpdateListener(){
    return this.postsUpdate.asObservable();
  }
  deletePost(postId:string){
    this.http.delete("/api/posts/"+postId).subscribe(
      ()=>{
        const updatedPosts = this.posts.filter(post=>post.id!=postId);
        this.posts = updatedPosts;
        this.postsUpdate.next([...this.posts]);
      }
    );
  }
  constructor(private http:HttpClient) { }
}
