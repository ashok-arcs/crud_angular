import { Component, OnInit, ViewChild, Optional } from '@angular/core';
import { AdminPostService } from '../admin-post.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';




@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  addPostForm: FormGroup;
  updatePostForm: FormGroup;
  searchQuery: string = '';
  filteredCamps: any;

  @ViewChild('addpostbutton') addpostbutton: any;
  @ViewChild('updatepostbutton') updatepostbutton: any;

  private recordAddedSubscription: Subscription = new Subscription;
  recordAdded = new Subject<void>();

  constructor(
    private adminPost:AdminPostService, 
    private toast: NgToastService, 
    private formBuilder: FormBuilder,
    private router:Router
    ){

    /**
     * Add post form validator start
     */
        this.addPostForm = this.formBuilder.group({
          title: ['', Validators.required],
            content: ['', Validators.required]
        });
      /**
       * Add post form validator end
       */

      /**
       * Update post form validator end
       */
        this.updatePostForm = this.formBuilder.group({
          id: [''],
          title: ['', Validators.required],
          content: ['', Validators.required]
        });
      /**
       * Update post form validator end
       */
    };

  // Pagination variables
  currentPage = 1;
  itemsPerPage = 5; // Number of items to display per page
  titleError : string = "";
  pcontentError : string = "";

  sortBy: string = 'id';
  sortOrder: string = 'desc';

  ngOnInit(): void {
    this.getPostsLists(this.sortBy, this.sortOrder);
    // Subscribe to the event when a new record is added
    this.recordAddedSubscription = this.recordAdded.subscribe(() => {
      this.getPostsLists(this.sortBy, this.sortOrder);
    });
  }



  onSortChange(field:string) {

    if(field !="")
    {
      this.sortBy = field;
    }

    if(this.sortOrder =='desc')
    {
      this.sortOrder = 'asc';
    }

    if(this.sortOrder =='asc')
    {
      this.sortOrder = 'desc';
    }

    this.getPostsLists(this.sortBy,this.sortOrder);
  }


  filterCamps(text:string): void {
    this.posts = this.posts.filter((camp: any) =>
      camp.title.toLowerCase().includes(text.toLowerCase()) ||
      camp.content.toLowerCase().includes(text.toLowerCase())
    );
    return this.posts;
  }

  /**
   * Add Post
   */
  addPost()
  {
    if (this.addPostForm.valid) {
      this.adminPost.addPost(this.addPostForm.value).subscribe(
        (data) => {
          this.titleError = this.pcontentError = '';
          this.addPostForm.reset();
          this.toast.success({detail:'Post added successfully.'});
          // Emit event to notify the component
          this.recordAdded.next();
          this.addpostbutton.nativeElement.click();
        },
        error => {
          let errorRes : any = error.error
          this.titleError = errorRes.title;
          this.pcontentError = errorRes.content;
        },
      );
    } else {
      this.markAllFormControlsAsTouched(this.addPostForm);
    }
  }

  /**
   * Mark all form fields touched 
   * @param formName 
   */
  markAllFormControlsAsTouched(formName:any) {
    Object.keys(formName.controls).forEach(field => {
      const control = formName.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  markAllFormControlsAsUnTouched(form:any) {
    form.markAsUntouched(); // Mark all controls as untouched
  }
  

search()
{
  //filterCamps()
}


performSearch() {
  this.filterCamps("ashok");
}

  /**
   * Get posts data
   */
  posts : any;
  getPostsLists(sortBy: any, sortOrder: any)
  {

    
    // data1['sortBy'] = sortBy;
    // data1['sortOrder'] = sortOrder;

    this.adminPost.getAdminPosts(sortBy, sortOrder).subscribe(
      (data) => {
        this.posts = data;
      },
      error => {
        let errorRes : any = error.error
        this.toast.error({detail:errorRes.error})
      }
    );
  }

  /**
   * Update Post data
   */
  updatePost()
  {
    if (this.updatePostForm.valid) 
    {
      this.adminPost.updatePost(this.updatePostForm.value).subscribe(
        (data) => {
          this.titleError = this.pcontentError = '';
          this.updatePostForm.reset();
          this.toast.success({detail:'Post Updated successfully.'});
          // Emit event to notify the component
          this.recordAdded.next();
          this.updatepostbutton.nativeElement.click();
        },
        error => {
          let errorRes : any = error.error
          this.titleError = errorRes.title;
          this.pcontentError = errorRes.content;
        },
      );
    }
    else
    {
      this.markAllFormControlsAsTouched(this.updatePostForm);
    }
  }

/**
 * Delete Post using post_id
 * @param id
 */
  deletePost(id:number)
  {
    const result = window.confirm('Are you sure you want to delete this item?');
    if(id>0 && result)
    {
      this.adminPost.deleteAdminPost(id).subscribe(
        (data) => {
          const index = this.findIndexUsingPostId(id);
          if (index !== -1) 
          {
            this.posts.splice(index, 1);
          }
          this.toast.success({detail:"Post successfully delete."});
        },
        error => {
          let errorRes : any = error.error
          this.toast.error({detail:"Error"})
        },
      );
    }
  }

/**
 * Show selected post data
 * @param itemId 
 *
 */
  editPost(itemId:number) 
  {
    const index = this.findIndexUsingPostId(itemId);
    if (index !== -1) 
    {
      // Patch the form values
      this.updatePostForm.patchValue({
        id: this.posts[index].id,
        title: this.posts[index].title,
        content: this.posts[index].content,
      });
    }
  }

  /**
   * find index using post_id
   * @param itemId 
   * @returns post index number
   */
  findIndexUsingPostId(itemId: number) 
  {
    const index = this.posts.findIndex((item: { id: number; }) => item.id === itemId);
    return index;
  }

  logoutUser()
  {
    localStorage.removeItem("token");
    this.router.navigate(['login']);
  }
}
