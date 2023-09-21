import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './environment';
@Injectable({
  providedIn: 'root'
})
export class AdminPostService {
  baseUrl: string = API_BASE_URL;
  constructor(private httpClient:HttpClient) { }

/**
 * Set token into header 
 * @returns 
 */
  private getHeaders(): HttpHeaders 
  {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    const headers = new HttpHeaders().set('token', `${token}`);
    return headers;
  }
  
/**
 * Fetch posts listing
 * @returns 
 */
  public getAdminPosts(sortBy: any, sortOrder: any): Observable<any> 
  {
    const headers = this.getHeaders();

    const params = {sortBy: sortBy, sortOrder: sortOrder};
    
    return this.httpClient.get(this.baseUrl + "/userpost", {headers, params});
  } 

  /**
   * Delete post
   * @returns 
   */
  public deleteAdminPost(id:number) 
  {
    const headers = this.getHeaders();
    return this.httpClient.delete(this.baseUrl + "/deletepost/" + id, {headers});
  }
  
  /**
   * Add post
   * @param data 
   * @returns 
   */
  public addPost(data:any)
  {
    const headers = this.getHeaders();
    return this.httpClient.post(this.baseUrl + "/addpost", data, {headers});
  }

  /**
   * Update post
   * @param data 
   * @returns 
   */
  public updatePost(data:any)
  {
    const post_id = data.id;
    delete data.id;
    const headers = this.getHeaders();
    return this.httpClient.put(this.baseUrl + "/updatepost/" +post_id, data, {headers});
  }

   /**
   * Add customer
   * @param data 
   * @returns 
   */
   public addCustomer(data:any)
   {
     const headers = this.getHeaders();
     return this.httpClient.post(this.baseUrl + "/addcustomer", data, {headers});
   }


   /**
 * Fetch customers listing
 * @returns 
 */
  public getCustomers(): Observable<any> 
  {
    const headers = this.getHeaders();
    return this.httpClient.get(this.baseUrl + "/customers", {headers});
  } 

  /**
   * Delete customer
   * @returns 
   */
  public deleteCustomer(id:number) 
  {
    const headers = this.getHeaders();
    return this.httpClient.delete(this.baseUrl + "/deletecustomer/" + id, {headers});
  }

  /**
   * Update customer
   * @param data 
   * @returns 
   */
  public updateCustomer(data:any, id:number)
  {
    const headers = this.getHeaders();
    return this.httpClient.post(this.baseUrl + "/updatecustomer/" +id, data, {headers});
  }
  
   /**
 * Fetch products listing
 * @returns 
 */
   public getProducts(): Observable<any> 
   {
     const headers = this.getHeaders();
     return this.httpClient.get(this.baseUrl + "/products", {headers});
   }

   /**
    * Add product
    * @param data 
    * @returns 
    */
   public addProduct(data:any)
   {
     const headers = this.getHeaders();
     return this.httpClient.post(this.baseUrl + "/addproduct", data, {headers});
   }

  /**
   * Delete Product
   * @param id 
   * @returns 
   */
  public deleteProduct(id:number) 
  {
    const headers = this.getHeaders();
    return this.httpClient.delete(this.baseUrl + "/deleteproduct/" + id, {headers});
  }

  /**
   * Update product
   * @param data 
   * @returns 
   */
  public updateProduct(data:any, id:number)
  {
    const headers = this.getHeaders();
    return this.httpClient.post(this.baseUrl + "/updateproduct/" +id, data, {headers});
  }

/**
 * Add order
 * @param data 
 * @returns 
 */
  public addOrder(data:any)
  {
    const headers = this.getHeaders();
     return this.httpClient.post(this.baseUrl + "/addorder", data, {headers});
  }


    /**
 * Fetch orders listing
 * @returns 
 */
    public getOrders(): Observable<any> 
    {
      const headers = this.getHeaders();
      return this.httpClient.get(this.baseUrl + "/orderlist", {headers});
    }

    /**
   * Delete Order
   * @param id 
   * @returns 
   */
  public deleteOrder(id:number) 
  {
    const headers = this.getHeaders();
    return this.httpClient.delete(this.baseUrl + "/deleteorder/" + id, {headers});
  }
  
}
