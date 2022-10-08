import Navigo from 'navigo';
import Cart from './pages/cart';
import Categories from './pages/categories';
import Home from './pages/home';
import Login from './pages/login';
import Product from './pages/product';
import Products from './pages/products';
import Profile from './pages/profile';
import Sell from './pages/sell';
import { Page } from './types';
import { hooks } from './lib/store';

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
        { path: '/product', page: Product },
        { path: '/sell', page: Sell },
				{ path: '/cart', page: Cart },
				{ path: '/profile', page: Profile }
    ];

    router.hooks({
        before: (done, match) => {
            if (match.url === 'login') {
                if (localStorage.getItem('profile')) {
                    done(false);
                    router.navigate('/');
                } else {
                    document.getElementById('navbar')!.style.display = 'none';
                    done();
                }
            } else {
                if (!localStorage.getItem('profile')) {
                    done(false);
                    localStorage.setItem('lastUrl', match.url + (match.queryString ? '?' + match.queryString : ''));
                    router.navigate('/login');
                } else {
					document.getElementById('navbar')!.style.display = 'block';
                    done();
                }
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

                // Custom hook running after page load since Navigo's doesn't really
                // work as expected, calling the after hook before the page is loaded completely
                const { after } = hooks;
                const hook = after.find((hook) => hook.path === path);
                if (hook) hook.fn();
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
