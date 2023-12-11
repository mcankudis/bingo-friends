import { Component } from 'solid-js';

import { LoginPage, RegisterPage } from '~login/pages';
import { Paths } from './Paths';

interface Route {
    name: string;
    path: string;
    component: Component;
    type: 'public' | 'private';
}

// todo translate names
export const routes: Route[] = [
    // {
    //     name: 'Home',
    //     path: Paths.HOME,
    //     component: HomeView,
    //     type: 'private'
    // },
    {
        name: 'Login',
        path: Paths.LOGIN,
        component: LoginPage,
        type: 'public'
    },
    {
        name: 'Register',
        path: Paths.REGISTER,
        component: RegisterPage,
        type: 'public'
    }
];
