import createRoutes, { router } from './router';
import 'bootstrap';

function setup() {
  createRoutes();

  document.getElementById('href-cart')?.addEventListener('click', () => router.navigate('/cart'));
  document.getElementById('href-profile')?.addEventListener('click', () => router.navigate('/profile'));
}

setup();

// @ts-ignore
window.salir = function salir() {
  localStorage.removeItem('profile');
  router.navigate('/login');
};
