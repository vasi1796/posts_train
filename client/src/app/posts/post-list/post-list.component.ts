import { Component, OnInit, OnDestroy } from '@angular/core';
import {PostModel} from '../post-model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

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
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [1,2,5,10];
  currentPage = 1;
  private postsSub: Subscription;
  
  constructor(public postsService:PostService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData:{posts:PostModel[],postNumber:number})=>{
      this.isLoading = false;
      this.totalPosts = postData.postNumber;
      this.posts = postData.posts;
    });
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }
  onDelete(postId){
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage,this.currentPage);
    });
  }
  onChangedPage(pageData:PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
  }

}
