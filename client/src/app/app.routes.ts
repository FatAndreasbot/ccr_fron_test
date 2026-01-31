import { Routes } from '@angular/router';
import { AllNewsArticles } from './components/all-news-articles/all-news-articles';
import { Login } from './components/login/login';

export const routes: Routes = [
    {
        path:'',
        title:"Новости",
        component: AllNewsArticles
    },
    {
        path:'login',
        title:'Login',
        component:Login
    }
];
