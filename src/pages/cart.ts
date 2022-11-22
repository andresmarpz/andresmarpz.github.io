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
type paymentType = 'card' | 'bank' | undefined;

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

let payment: paymentType = undefined;
function setPaymentMethod(paymentMethod: paymentType){
	payment = paymentMethod;
	document.getElementById('payment-method')!.innerHTML = (payment === 'bank' ? 'Transferencia bancaria' : 'Tarjeta de crédito')
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
        (prod) => /*html*/`
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

function disableInputs(){
	document.getElementById(payment === 'bank' ? 'card-set' : 'bank-set')?.setAttribute('disabled', '');
	document.getElementById(payment === 'bank' ? 'bank-set' : 'card-set')?.removeAttribute('disabled');
}

function isFieldsetValid(){
	const inputs = document.querySelectorAll('fieldset:not([disabled]) input');
	return Array.from(inputs).every(el => (el as HTMLInputElement).checkValidity())
}

function updatePaymentValidity(){
	const btn = document.getElementById('payment-btn');
	isFieldsetValid() ? btn?.classList.remove('is-invalid') : btn?.classList.add('is-invalid')
}

function processPurchase(){
	document.getElementById('alert-container')!.innerHTML = `
		<div id='alert-add' class="alert alert-success alert-dismissible fade show" style="z-index: 99;" role="alert">
			<span>¡La compra ha sido realizada con éxito!</span>
		</div>
	`

	setTimeout(() => {
		localStorage.removeItem('cart');
		window.location.href = '/cart';
	}, 2000)
}

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

		const form = document.getElementById('cart-form') as HTMLFormElement;
		form?.addEventListener('submit', (event) => {
			if(form.checkValidity() && isFieldsetValid()) processPurchase();

			event.preventDefault();
			event.stopPropagation();

			updatePaymentValidity();

			form.classList.add('was-validated');
		})

		document.getElementById('card-radio')?.addEventListener('change', () => {
			setPaymentMethod('card')
			disableInputs()
		})

		document.getElementById('bank-radio')?.addEventListener('change', () => {
			setPaymentMethod('bank')
			disableInputs()
		})

		document.querySelectorAll('fieldset input').forEach(el => el.addEventListener('input', updatePaymentValidity))
  });

  return /*html*/ `
			<div class="container mt-4 px-4">
				<div id="alert-container"></div>
				<div class="row gap-3">
					<div class="cart-cnt px-3 col-lg-7 col-xl-8 h-fit-content">
						<div class="my-2">
							<strong class="cart-title">Cart</strong>
						</div>
						<div id="cart"></div>
					</div>
					<div class="cart-cnt col h-fit-content">
						<form class="needs-validation" id="cart-form" novalidate>
							<div class="mt-2">
								<strong>Moneda</strong>

								<div class="dy-cnt d-flex mt-2" id="moneda">
									<button type="button" class="mon-btn dy-selected" id='mon-uyu'>Pesos Uruguayos</button>
									<button type="button" class="mon-btn" id='mon-usd'>Dólares</button>
								</div>
							</div>
							<div class="py-4">
								<strong>Envío</strong>
								
								<div class='dy-cnt d-flex my-2' id='delivery'>
									<button type="button" class="dy-btn dy-selected" id='dy-free'>Gratis</button>
									<button type="button" class="dy-btn" id='dy-express'>Express (3%)</button>
									<button type="button" class="dy-btn" id='dy-turbo'>Turbo (7%)</button>
								</div>
								
								<div class='dy-date' id='dy-date'>
									Fecha estimada: --/--/----
								</div>

								<div class="mt-4">
									<label for="input-calle" class="form-label">Calle</label>
									<input type="text" class="form-control" id="input-calle" required>
									<div class="invalid-feedback">
										Debe especificar calle
									</div>
								</div>
								<div>
									<label for="input-numero" class="form-label">Número</label>
									<input type="text" class="form-control" id="input-numero" required>
									<div class="invalid-feedback">
										Debe especificar número
									</div>
								</div>
								<div>
									<label for="input-esquina" class="form-label">Esquina</label>
									<input type="text" class="form-control" id="input-esquina" required>
									<div class="invalid-feedback">
										Debe especificar esquina
									</div>
								</div>
								
								<hr class="cart-separator my-2" />
								
								<div class="py-4">
									<strong>Forma de pago</strong>

									<div>
										<div>
											<span id="payment-method">Tarjeta de crédito</span>
											<!-- Button trigger modal -->
											<button id="payment-btn" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
												Seleccionar
											</button>
											<span class="invalid-feedback">Debe seleccionar una forma de pago.</span>
										</div>

										<!-- Modal -->
										<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
											<div class="modal-dialog">
												<div class="modal-content">
													<div class="modal-header">
														<h5 class="modal-title" id="exampleModalLabel">Forma de pago</h5>
														<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div class="modal-body">
														<div class="form-check payment-method-radio">
															<input type="radio" class="form-check-input" name="methodRadio" id="card-radio" checked>
															<label for="card-radio">Tarjeta de credito</label>
														</div>
														<fieldset form="cartForm" id="card-set">
															<div class="row mb-3">
																<label for="cardNumber" class="form-label">Número de tarjeta</label>
																<input type="text" class="form-control" id="cardNumber"
																	minlength="16"
																	maxlength="16"
																	pattern="^[0-9]*$"
																	placeholder="XXXX XXXX XXXX XXXX"
																	required>
															</div>
															<div class="row mb-3">
																<label for="cvvNumber" class="form-label">Código de seguridad</label>
																<input type="text" class="form-control" id="cvvNumber"
																	minlength="3"
																	maxlength="3"
																	pattern="^[0-9]*$"
																	required>
															</div>
															<div class="row mb-3">
																<label for="expiringDate" class="form-label">Vencimiento</label>
																<input type="text" class="form-control" id="expiringDate"
																	minlength="5"
																	maxlength="5"
																	pattern="[0-9]{2}\/[0-9]{2}"
																	placeholder="MM/AA"
																	required>
															</div>
														</fieldset>
														<hr>
														<div class="form-check payment-method-radio">
															<input type="radio" class="form-check-input" name="methodRadio" id="bank-radio">
															<label for="bank-radio">Transferencia bancaria</label>
														</div>
														<fieldset form="cartForm" id="bank-set" disabled>
															<div class="row mb-3">
																<label for="accountNumber" class="form-label">Número de cuenta</label>
																<input type="text" class="form-control" id="accountNumber"
																	pattern="[0-9]*"
																	required>
															</div>
														</fieldset>
													</div>
													<div class="modal-footer">
														<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
													</div>
												</div>
											</div>
										</div>
									</div>
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
										<button class="ch-btn-fin" type="submit" form="cart-form">Finalizar compra</button>
										<button class="ch-btn-back">Continuar navegando</button>
									</div>
								</div>
							</div>
						</form>
				</div>
			</div>
		`;
};
export default Cart;
