import Navigo from 'navigo';
import Categories from './pages/categories';
import Home from './pages/home';

const router = new Navigo('/');

export default function createRoutes(){
	const routes = [
		{ path: '/', page: Home },
		{ path: '/categories', page: Categories }
	];
	
	routes.forEach(({ path, page }) => {
		router.on(path, async () => {
			const container = document.querySelector('[navigo-container]');
			if(container) container.innerHTML = await page(path);
		}).resolve();
	});
}