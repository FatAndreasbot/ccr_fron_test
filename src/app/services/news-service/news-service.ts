import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { INewsArticle } from '../../interfaces/inews-article';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private endpointURL = "http://localhost:8000/api/news"

  constructor(
    private http:HttpClient
  ) { }

  getAllNews():Observable<INewsArticle[]>{
    return this.http.get<INewsArticle[]>(this.endpointURL)
  }
  
  getById(id:number):Observable<INewsArticle[]>{
    return this.http.get<INewsArticle[]>(this.endpointURL).pipe(
      map(arr => arr.filter(article => article.id == id))
    )
  }
}
