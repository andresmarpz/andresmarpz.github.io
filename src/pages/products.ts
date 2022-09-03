import { router } from "../router"
import { Page } from "../types"
import { fetchEndpoint, PRODUCTS_URL } from "../util/fetcher"
import { formatImagePath } from "../util/formatter"

interface Product{
	id: number,
	name: string,
	description: string,
	cost: number,
	currency: 'USD',
	soldCount: number,
	image: string
}

interface Response{
	catID: number,
	catName: string,
	products: Product[]
}

// @ts-ignore
window.handleProductClick = function handleProductClick(id: number) {
	router.navigate(`/product?id=${id}`);
}

const Products: Page = async() => {
	const categoryId = localStorage.getItem('catID');
	const { data, ok } = await fetchEndpoint<Response>(PRODUCTS_URL +categoryId +'.json');

	if(!ok || !data) return `<div>Error al cargar los productos.</div>`

	return `
		<div class="container text-center p-4">
			<h1>Productos</h1>
			<h2 class="text-muted">Verás aqui todos los productos de la categoría <strong id='prod-cat'></strong></h2>
			<div class="row">
				<div class="col text-end">
					<div class="btn-group btn-group-toggle mb-4" data-bs-toggle="buttons">
						<input type="radio" class="btn-check" name="options" id="sortAsc" />
						<label class="btn btn-light" for="sortAsc"> <i class="fas fa-sort-amount-up mr-1"></i> Price</label>
						<input type="radio" class="btn-check" name="options" id="sortDesc" />
						<label class="btn btn-light" for="sortDesc"><i class="fas fa-sort-amount-down mr-1"></i> Price</label>
						<input type="radio" class="btn-check" name="options" id="sortByCount" checked />
						<label class="btn btn-light" for="sortByCount"><i class="fas fa-sort-amount-down mr-1"></i> Rel.</label>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-6 offset-lg-6 col-md-12 mb-1 container">
					<div class="row container p-0 m-0">
						<div class="col">
							<p class="font-weight-normal text-end my-2">Cant.</p>
						</div>
						<div class="col">
							<input class="form-control" type="number" placeholder="min." id="rangeFilterCountMin" />
						</div>
						<div class="col">
							<input class="form-control" type="number" placeholder="máx." id="rangeFilterCountMax" />
						</div>
						<div class="col-3 p-0">
							<div class="btn-group" role="group">
								<button class="btn btn-light btn-block" id="rangeFilterCount">Filtrar</button>
								<button class="btn btn-link btn-sm" id="clearRangeFilter">Limpiar</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="prodList" class="container">
			${ data.products.length 
				? data.products.map(product => `
					<div class="list-group-item list-group-item-action cursor-active" onclick="handleProductClick(${product.id})">
						<div class="row">
							<div class="col-3">
								<img src="${formatImagePath(product.image)}" alt="${product.description}" class="img-thumbnail">
							</div>
							<div class="col">
								<div class="d-flex w-100 justify-content-between">
									<h4 class="mb-1">${product.name} - USD ${product.cost}</h4>
									<small class="text-muted">${product.soldCount} vendidos</small>
								</div>
								<p class="mb-1">${product.description}</p>
							</div>
						</div>
					</div>
					`).join('') 
				: `<div class="text-center">No hay productos para mostrar.</div>`}
		</div>
	`
}

export default Products