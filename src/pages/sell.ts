import '../js/dropzone.js'

const Sell = () => {
	return `		
		<div class="container">
			<div class="text-center p-4">
				<h2>Vender</h2>
				<p class="lead">Ingresa los datos del artículo a vender.</p>
			</div>
			<div class="row justify-content-md-center">
				<div class="col-md-8 order-md-1">
					<h4 class="mb-3">Información del producto</h4>
					<form class="needs-validation" id="sell-info">
						<div class="row">
							<div class="col-md-6 mb-3">
								<label for="productName">Nombre</label>
								<input type="text" class="form-control" id="productName" value="" name="productName" />
								<div class="invalid-feedback">Ingresa un nombre</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-8 order-md-1">
								<label>Imágenes</label>
								<div class="needsclick dz-clickable" id="file-upload">
									<div class="dz-message needsclick">Arrastra tus fotos aquí<br /></div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12 mb-3">
								<label for="productDescription">Descripción</label>
								<textarea name="productDescription" class="form-control" id="productDescription"></textarea>
							</div>
						</div>
						<div class="row">
							<div class="col-md-3 mb-3">
								<label for="productCostInput">Costo</label>
								<input
									type="number"
									name="productCostInput"
									class="form-control"
									id="productCostInput"
									placeholder=""
									required=""
									value="0"
									min="0" />
								<div class="invalid-feedback">El costo debe ser mayor que 0.</div>
							</div>
							<div class="col-md-4 mb-3">
								<label for="productCurrency">Moneda</label>
								<select
									name="productCurrency"
									class="form-select custom-select d-block w-100"
									id="productCurrency"
									required>
									<option value="" hidden selected>Seleccionar moneda</option>
									<option>Pesos Uruguayos (UYU)</option>
									<option>Dólares (USD)</option>
								</select>
								<div class="invalid-feedback">Ingresa una categoría válida.</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-7 mb-3">
								<label for="productCategory">Categoría</label>
								<select
									name="productCategory"
									class="custom-select form-select d-block w-100"
									id="productCategory">
									<option value="">Elija la categoría...</option>
									<option>Autos</option>
									<option>Juguetes</option>
									<option>Muebles</option>
									<option>Herramientas</option>
									<option>Computadoras</option>
									<option>Vestimenta</option>
								</select>
								<div class="invalid-feedback">Por favor ingresa una categoría válida.</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-3 mb-3">
								<label for="productCountInput">Cantidad en stock</label>
								<input
									type="number"
									name="productCountInput"
									class="form-control"
									id="productCountInput"
									required
									value="1"
									min="0" />
								<div class="invalid-feedback">La cantidad es requerida.</div>
							</div>
						</div>
						<hr class="mb-4" />
						<h5 class="mb-3">Tipo de publicación</h5>
						<div class="d-block my-3">
							<div class="custom-control custom-radio">
								<input
									id="goldradio"
									name="publicationType"
									type="radio"
									class="custom-control-input"
									checked=""
									required="" />
								<label class="custom-control-label" for="goldradio">Gold (13%)</label>
							</div>
							<div class="custom-control custom-radio">
								<input
									id="premiumradio"
									name="publicationType"
									type="radio"
									class="custom-control-input"
									required="" />
								<label class="custom-control-label" for="premiumradio">Premium (7%)</label>
							</div>
							<div class="custom-control custom-radio">
								<input
									id="standardradio"
									name="publicationType"
									type="radio"
									class="custom-control-input"
									required="" />
								<label class="custom-control-label" for="standardradio">Estándar (3%)</label>
							</div>
							<div class="row">
								<button
									type="button"
									class="m-1 btn btn-link"
									data-bs-toggle="modal"
									data-bs-target="#contidionsModal">
									Ver condiciones
								</button>
							</div>
						</div>
						<hr class="mb-4" />
						<h4 class="mb-3">Costos</h4>
						<ul class="list-group mb-3">
							<li class="list-group-item d-flex justify-content-between lh-condensed">
								<div>
									<h6 class="my-0">Precio</h6>
									<small class="text-muted">Unitario del producto</small>
								</div>
								<span class="text-muted" id="productCostText">-</span>
							</li>
							<li class="list-group-item d-flex justify-content-between lh-condensed">
								<div>
									<h6 class="my-0">Porcentaje</h6>
									<small class="text-muted">Según el tipo de publicación</small>
								</div>
								<span class="text-muted" id="comissionText">-</span>
							</li>
							<li class="list-group-item d-flex justify-content-between">
								<span>Total ($)</span>
								<strong id="totalCostText">-</strong>
							</li>
						</ul>
						<hr class="mb-4" />
						<button class="btn btn-primary btn-lg" type="submit">Vender</button>
					</form>
				</div>
			</div>
		</div>
		<div class="alert alert-primary-dismissible fade" id="alertResult" role="alert">
			<span id="resultSpan"></span>
		</div>
		
		<div class="modal fade" tabindex="-1" role="dialog" id="contidionsModal">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Condiciones de publicación</h5>
					</div>
					<div class="modal-body">
						<div class="container">
							<div class="row">
								<h5 class="text-warning">Gold (13%)</h5>
								<p class="muted text-justify">
									Tu producto se verá de forma promocionada en portada, además de las condiciones de Premium y
									Estándar.
								</p>
							</div>
							<hr />
							<div class="row">
								<h5 class="text-primary">Premium (7%)</h5>
								<p class="muted text-justify">
									Se mostrará el producto en los primeros lugares de resultados de búsqueda, así cómo cuando
									se ingrese a la categoría que pertenezca.
								</p>
							</div>
							<hr />
							<div class="row">
								<h5 class="text-secondary">Estándar (3%)</h5>
								<p class="muted text-justify">
									El producto se listará en la categoría correspondiente, así como en los resultados de
									búsquedas que coincidan con las palabras claves en el nombre.
								</p>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
					</div>
				</div>
			</div>
		</div>	
	`;
}

export default Sell