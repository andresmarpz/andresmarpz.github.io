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
		router.on(path, () => {
				page(path);
		}).resolve();
	});
}