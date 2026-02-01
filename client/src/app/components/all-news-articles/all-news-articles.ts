import { Component, computed, signal, WritableSignal } from '@angular/core';
import { Article } from '../article/article';
import { INewsArticle } from '../../interfaces/inews-article';
import { NewsService } from '../../services/news-service/news-service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from "../../../../node_modules/@angular/common/types/_common_module-chunk";

@Component({
  selector: 'app-all-news-articles',
  imports: [Article],
  templateUrl: './all-news-articles.html',
  styleUrl: './all-news-articles.css',
})
export class AllNewsArticles {
  articles: WritableSignal<INewsArticle[]> = signal([])
  hasErrors: WritableSignal<boolean> = signal(false)
  errorMessage:string = ""
  gridClasses = computed(() => 
    // !this.hasErrors() ? 'grid md:grid-cols-3 sm:grid-cols-2 gap-4 mb-4':'grid'
    this.hasErrors() ? 'grid':'grid md:grid-cols-3 sm:grid-cols-2 gap-4 mb-4'
  )

  constructor(
    private newsService:NewsService
  ) { }

  ngOnInit(){
    this.newsService.getAllNews().subscribe({
    next: (resp) => {
      this.articles.set(resp)
    },
    error:(resp: HttpErrorResponse) => {
      this.errorMessage = resp.message
      this.hasErrors.set(true)
    }
  })}
}
