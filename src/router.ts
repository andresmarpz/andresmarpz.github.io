import Navigo from 'navigo';
import Categories from './pages/categories';
import Home from './pages/home';
import Login from './pages/login';
import Products from './pages/products';
import Sell from './pages/sell';
import { Page } from './types';

export const router = new Navigo('/');

export interface Route {
    path: string;
    page: Page;
}

export default function createRoutes() {
    const routes: Route[] = [
        { path: '/', page: Home },
        { path: '/login', page: Login },
        { path: '/categories', page: Categories },
        { path: '/products', page: Products },
        { path: '/sell', page: Sell }
    ];

	router.hooks({
		before: (done, match) => {
			if (match.url === 'login') {
				if (localStorage.getItem('profile')) {
					done(false);
					router.navigate('/');
				} else done();
			} else {
				if (!localStorage.getItem('profile')) {
					done(false);
					localStorage.setItem('lastUrl', match.url + (match.queryString ? '?' + match.queryString : ''));
					router.navigate('/login');
				} else done();
			}
		},
		after: () => {
			const user = document.getElementById('dropdownMenuButton');
			if (user && localStorage.getItem('profile')) {
				const profile = JSON.parse(localStorage.getItem('profile')!);
				user.innerHTML = profile.email;
			}
		}
	});
    routes.forEach(({ path, page }) => {
        router
            .on(path, async () => {
                const container = document.querySelector('[navigo-container]');
                if (container) container.innerHTML = await page(path);
            })
            .resolve();
	});
	router.addLeaveHook('/login', (done: (bool?: boolean) => void) => {
		if (!localStorage.getItem('profile')) done(false);
		else {
			const navbar = document.getElementById('navbar');
			if (navbar) navbar.style.display = 'block';
			done();
		}
	});
}
