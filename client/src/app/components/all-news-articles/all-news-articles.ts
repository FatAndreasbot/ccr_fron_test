import { Component, signal, WritableSignal } from '@angular/core';
import { Article } from '../article/article';
import { INewsArticle } from '../../interfaces/inews-article';
import { NewsService } from '../../services/news-service/news-service';

@Component({
  selector: 'app-all-news-articles',
  imports: [Article],
  templateUrl: './all-news-articles.html',
  styleUrl: './all-news-articles.css',
})
export class AllNewsArticles {
  articles: WritableSignal<INewsArticle[]> = signal([])

  constructor(
    private newsService:NewsService
  ) { }

  ngOnInit(){
    this.newsService.getAllNews().subscribe((resp) => {
      this.articles.set(resp)
    })
  }
}
