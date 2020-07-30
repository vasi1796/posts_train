import { Component, OnInit, OnDestroy } from '@angular/core';
import {PostModel} from '../post-model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {
  // posts = [
  //   {title:'First post',content:'Something here'},
  //   {title:'Second post',content:'Something here'},
  //   {title:'Third post',content:'Something here'},
  //   {title:'Fourth post',content:'Something here'}
  // ]
  posts: PostModel[] = [];
  isLoading = false;
  private postsSub: Subscription;
  
  constructor(public postsService:PostService) { }

  ngOnInit() {
    this.isLoading = true;
    this.posts = this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts:PostModel[])=>{
      this.isLoading = false;
      this.posts = posts;
    });
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }
  onDelete(postId){
    this.postsService.deletePost(postId);
  }

}
