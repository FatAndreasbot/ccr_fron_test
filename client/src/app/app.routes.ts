import { Routes } from '@angular/router';
import { AllNewsArticles } from './components/all-news-articles/all-news-articles';
import { Login } from './components/login/login';
import { InteractiveMap } from './components/interactive-map/interactive-map';
import { authGuard } from './guards/auth/auth-guard';

export const routes: Routes = [
    {
        path: '',
        title: "Новости",
        component: AllNewsArticles
    },
    {
        path: 'login',
        title: 'Login',
        component: Login
    },
    {
        path: "map",
        title: "Карта",
        canActivate: [authGuard],
        component: InteractiveMap
    }
];
