import { router } from "../router"
import { Page } from "../types"
import { fetchEndpoint, PRODUCTS_URL } from "../lib/fetcher"
import { formatImagePath } from "../lib/formatter"
import addAfterHook from "../lib/hooks/addAfter"

interface ProductEntry{
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
	products: ProductEntry[]
}

(window as any).handleProductClick = function handleProductClick(id: number) {
	router.navigate(`/product?id=${id}`);
}

type SortCriteria = 'Asc' | 'Desc' | 'Rel';
const sortProducts = (criteria: SortCriteria, array: ProductEntry[]) => {
	switch (criteria) {
		case 'Asc':
			return array.sort((a, b) => a.cost - b.cost);
		case 'Desc':
			return array.sort((a, b) => b.cost - a.cost);
		case 'Rel':
			return array.sort((a, b) => b.soldCount - a.soldCount);
	}
}

const updateProducts = (products: ProductEntry[]) => {
	const container = document.getElementById('prodList');
	if (!container) return;

	if(minPrice !== -1 || maxPrice !== -1) 
		products = products.filter(prod => {
			if(minPrice !== -1 && maxPrice !== -1) return prod.cost >= minPrice && prod.cost <= maxPrice;
			if(minPrice !== -1 && maxPrice === -1) return prod.cost >= minPrice;
			if(minPrice === -1 && maxPrice !== -1) return prod.cost <= maxPrice;
			return true;
		});

	if(!products.length) container.innerHTML = `<h1>No products found</h1>`;
	else container.innerHTML = products.map(product => `
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
}

let products: ProductEntry[] = [];
let minPrice = -1, maxPrice = -1;

const Products: Page = async(path) => {
	addAfterHook(path, async() => {
		const categoryId = localStorage.getItem('catID');
		const { data } = await fetchEndpoint<Response>(PRODUCTS_URL +categoryId +'.json');
		products = data.products;

		updateProducts(products)

		document.getElementById('sortAsc')!.addEventListener('click', function () {
			updateProducts(sortProducts('Asc', products));
		});
	
		document.getElementById('sortDesc')!.addEventListener('click', function () {
			updateProducts(sortProducts('Desc', products));
		});
	
		document.getElementById('sortByCount')!.addEventListener('click', function () {
			updateProducts(sortProducts('Rel', products));
		});

		document.getElementById('clearRangeFilter')!.addEventListener('click', function () {
			const min = document.getElementById('rangeFilterCountMin') as HTMLInputElement;
			const max = document.getElementById('rangeFilterCountMax') as HTMLInputElement;			
			min.value = ''; max.value = '';
			minPrice = -1, maxPrice = -1;
	
			updateProducts(products);
		});
	
		document.getElementById('rangeFilterCount')!.addEventListener('click', function () {
			//Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
			//de productos por categoría.
			const min = document.getElementById('rangeFilterCountMin') as HTMLInputElement;
			const max = document.getElementById('rangeFilterCountMax') as HTMLInputElement;
			
			if(min.value && parseInt(min.value) >= 0) minPrice = parseInt(min.value);
			else minPrice = -1;

			if(max.value && parseInt(max.value) >= 0) maxPrice = parseInt(max.value);
			else maxPrice = -1;
	
			updateProducts(products);
		});

		document.getElementById("productSearch")!.addEventListener('input', (event) => {
			const value = (event.target as HTMLInputElement).value;
			updateProducts(products.filter(prod => prod.name.toLowerCase().includes(value.toLowerCase()) 
			|| prod.description.toLowerCase().includes(value.toLowerCase())));
		})
	});

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
			<div class="row">
				<input class="form-control" type="search" id="productSearch">
			</div>
		</div>
		<div id="prodList" class="container">
		</div>
	`
}

export default Products