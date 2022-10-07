import addAfterHook from '../lib/hooks/addAfter';
import { CartProduct, Page } from '../types';

import '../css/cart.css';
import useStore from '../lib/store';

function convertPriceToCurrency(price: number, from: currencyType, to: currencyType) {
  switch (from) {
    case 'USD':
      return to === 'USD' ? price : Math.round(price * 40 * 10) / 10;
    case 'UYU':
      return to === 'UYU' ? price : Math.round((price / 40) * 10) / 10;
  }
}

(window as any).increaseCount = function increaseCount(id: number) {
  const store = useStore();
  const prod = store.cart.find((prod) => prod.id === id);
  if (prod) store.modifyCount(id, prod.count + 1);
  renderProducts(store.cart);
  updateSummary();
};

(window as any).decreaseCount = function decreaseCount(id: number) {
  const store = useStore();
  const prod = store.cart.find((prod) => prod.id === id);
  if (!prod || prod.count === 1) return;
  store.modifyCount(id, prod.count - 1);
  renderProducts(store.cart);
  updateSummary();
};

(window as any).removeProduct = function removeProduct(id: number) {
  const store = useStore();
  store.removeProduct(id);
  renderProducts(store.cart);
  updateSummary();
};

type currencyType = 'USD' | 'UYU';
type deliveryType = 'free' | 'express' | 'turbo';

// State
let delivery: deliveryType = 'free';
function setDelivery(deliveryType: deliveryType) {
  delivery = deliveryType;
  document.querySelectorAll('.dy-btn').forEach((el) => el.classList.remove('dy-selected'));
  document.getElementById('dy-' + deliveryType)?.classList.add('dy-selected');
  updateDate();
  updateSummary();
}

let currency: currencyType = 'UYU';
function setCurrency(currencyType: currencyType) {
  currency = currencyType;
  document.querySelectorAll('.mon-btn').forEach((el) => el.classList.remove('dy-selected'));
  document.getElementById('mon-' + currencyType.toLocaleLowerCase())?.classList.add('dy-selected');
  renderProducts(useStore().cart);
  updateSummary();
}

const getFee = (delivery: deliveryType) => {
  switch (delivery) {
    case 'free':
      return { fee: '$', rate: 0, days: 12 };
    case 'express':
      return { fee: '(3%) ' + '$', rate: 0.03, days: 7 };
    case 'turbo':
      return { fee: '(7%) ' + '$', rate: 0.07, days: 3 };
  }
};

function updateDate() {
  const date = document.getElementById('dy-date');
  if (date) {
    const d = new Date();
    const { days } = getFee(delivery);
    d.setDate(d.getDate() + days);
    date.innerHTML =
      'Fecha estimada: ' + d.toLocaleDateString('es-UY', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

function updateSummary() {
  const store = useStore();
  const subtotal = document.getElementById('dy-subtotal');
  const envio = document.getElementById('dy-envio');
  const total = document.getElementById('dy-total');
  if (subtotal && envio && total) {
    const sub =
      Math.round(
        store.cart.reduce(
          (acc, prod) => acc + convertPriceToCurrency(prod.unitCost, prod.currency, currency) * prod.count,
          0
        ) * 100
      ) / 100;
    const { fee, rate } = getFee(delivery);
    const del = Math.round(sub * rate * 10) / 10;
    subtotal.innerHTML = '$' + sub;
    envio.innerHTML = fee + del;
    total.innerHTML = '$' + Math.round((sub + del) * 10) / 10;
  }
}

const borrarIcono = `
<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
`;

// Render cart items
const renderProducts = (products: ReadonlyArray<CartProduct>) => {
  const cart = document.getElementById('cart');
  if (cart) {
    if (!products.length) {
      cart.innerHTML = `<p>No hay productos en el carrito.</p>`;
      return;
    }
    cart.innerHTML = products
      .map(
        (prod) => `
						<hr class="cart-separator" />
						<div class="d-flex flex-nowrap gap-3 py-3 align-items-center">
								<div class="ci-img">
									<img src="${prod.image}" alt="${prod.name}" class="img-fluid rounded shadow-sm" />
								</div>
								<div class="d-flex flex-column justify-content-center w-100 mh-75 gap-2">
									<div>
										<div class="d-flex justify-content-between">
											<span class="ci-name">${prod.name}</span>
											<span class="ci-price">$${convertPriceToCurrency(prod.unitCost, prod.currency, currency) * prod.count}</span>
										</div>
										<div class="ci-sub">
											<span>
												$${convertPriceToCurrency(prod.unitCost, prod.currency, currency)}
											</span>
										</div>
									</div>
									<div class='d-flex justify-content-between align-items-center'>
										<div class="ci-count-cnt">
											<button class="ci-control" id="cart-decrease" onclick="decreaseCount(${prod.id})">-</button>
											<label class="ci-count">${prod.count}</label>
											<button class="ci-control" id="cart-increase" onclick="increaseCount(${prod.id})">+</button>
										</div>
										<div>
											<button class='ci-borrar' onclick="removeProduct(${prod.id})">
												${borrarIcono}
												Borrar
											</button>
										</div>
									</div>
								</div>
						</div>
				`
      )
      .join('');
  }
};

const Cart: Page = async (path) => {
  addAfterHook(path, () => {
    const store = useStore();
    renderProducts(store.cart);
    updateDate();
    updateSummary();

    document.getElementById('mon-uyu')?.addEventListener('click', () => setCurrency('UYU'));
    document.getElementById('mon-usd')?.addEventListener('click', () => setCurrency('USD'));

    document.getElementById('dy-free')?.addEventListener('click', () => setDelivery('free'));
    document.getElementById('dy-express')?.addEventListener('click', () => setDelivery('express'));
    document.getElementById('dy-turbo')?.addEventListener('click', () => setDelivery('turbo'));
  });

  return /*html*/ `
			<div class="container mt-4 px-4">
				<div class="row gap-3">
					<div class="cart-cnt px-3 col-lg-7 col-xl-8 h-fit-content">
						<div class="my-2">
							<strong class="cart-title">Cart</strong>
						</div>
						<div id="cart"></div>
					</div>
					<div class="cart-cnt col h-fit-content">
						<div class="mt-2">
							<strong>Moneda</strong>

							<div class="dy-cnt d-flex mt-2" id="moneda">
								<button class="mon-btn dy-selected" id='mon-uyu'>Pesos Uruguayos</button>
								<button class="mon-btn" id='mon-usd'>Dólares</button>
							</div>
						</div>
						<div class="py-4">
							<strong>Envío</strong>
							
							<div class='dy-cnt d-flex my-2' id='delivery'>
								<button class="dy-btn dy-selected" id='dy-free'>Gratis</button>
								<button class="dy-btn" id='dy-express'>Express (3%)</button>
								<button class="dy-btn" id='dy-turbo'>Turbo (7%)</button>
							</div>
							
							<div class='dy-date' id='dy-date'>
								Fecha estimada: --/--/----
							</div>
							
							<hr class="cart-separator my-2" />

							<div>
								<div class="d-flex justify-content-between dy-subtotal">
									<label name="subtotal" for="subtotal">Subtotal: </label>
									<span id="dy-subtotal">$ --</span>
								</div>
								<div class="d-flex justify-content-between dy-envio">
									<label name="envio" for="envio">Envío: </label>
									<span id="dy-envio">$ --</span>
								</div>

								<hr class="cart-separator my-2" />

								<div class="d-flex justify-content-between dy-total">
									<label name="total" for="total">Total: </label>
									<span id="dy-total">$ --</span>
								</div>

								<div class="mt-4 d-flex flex-column gap-2 m-auto">
									<button class="ch-btn-fin">Finalizar compra</button>
									<button class="ch-btn-back">Continuar navegando</button>
								</div>
							</div>
						</div>
				</div>
			</div>
		`;
};
export default Cart;
