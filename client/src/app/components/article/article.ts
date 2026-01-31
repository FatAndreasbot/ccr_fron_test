import { Component, Input } from '@angular/core';
import { INewsArticle } from '../../interfaces/inews-article';

@Component({
  selector: 'app-article',
  imports: [],
  templateUrl: './article.html',
  styleUrl: './article.css',
})
export class Article {
  @Input({required: true}) articleData!:INewsArticle

  getConetent(){
    return this.articleData.content.length >100? this.articleData.content.slice(0, 97)+"...":this.articleData.content
  }
}
