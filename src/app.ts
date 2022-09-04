import createRoutes, { router } from "./router";
import 'bootstrap'

createRoutes();

// @ts-ignore
window.salir = function salir(){
	localStorage.removeItem('profile');
    router.navigate('/login');
}