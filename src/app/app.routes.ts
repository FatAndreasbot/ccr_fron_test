import { Routes } from '@angular/router';
import { AllNewsArticles } from './components/all-news-articles/all-news-articles';

export const routes: Routes = [
    {
        path:'',
        title:"Новости",
        component: AllNewsArticles
    }
];
