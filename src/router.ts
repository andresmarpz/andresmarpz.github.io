import Navigo from 'navigo';
import Categories from './pages/categories';
import Home from './pages/home';
import Sell from './pages/sell';
import { Page } from './types';

export const router = new Navigo('/');

export interface Route {
    path: string;
    page: Page;
}

export default function createRoutes(){
	const routes: Route[] = [
		{ path: '/', page: Home },
		{ path: '/categories', page: Categories },
		{ path: '/sell', page: Sell }
	];
	
	routes.forEach(({ path, page }) => {
		router.on(path, async () => {
			const container = document.querySelector('[navigo-container]');
			if(container) container.innerHTML = await page(path);
		}).resolve();
	});
}