import { router } from '../router';
import { Page } from '../types';
import { CATEGORIES_URL, fetchEndpoint, PRODUCTS_URL } from '../lib/fetcher';
import { formatImagePath } from '../lib/formatter';
import addAfterHook from '../lib/hooks/addAfter';

export interface Category {
    id: number;
    name: string;
    description: string;
    productCount: string;
    imgSrc: string;
}

(window as any).handleCategoryClick = function handleCategoryClick(id: number) {
	localStorage.setItem('catID', id.toString());
	router.navigate(`/products?id=${id}`);
}

type SortCriteria = 'Asc' | 'Desc' | 'PCount';
export const sortCategories = (criteria: SortCriteria, array: Category[]) => {
	switch (criteria) {
		case 'Asc':
			return array.sort((a, b) => a.name.localeCompare(b.name));
		case 'Desc':
			return array.sort((a, b) => b.name.localeCompare(a.name));
		case 'PCount':
			return array.sort((a, b) => parseInt(b.productCount) - parseInt(a.productCount));
	}
}

const updateCategories = (categories: Category[]) => {
	const container = document.getElementById('cat-list-container');
	if (!container) return;

	if(minCount !== -1 || maxCount !== -1) 
		categories = categories.filter(cat => {
			if(minCount !== -1 && maxCount !== -1) return parseInt(cat.productCount) >= minCount && parseInt(cat.productCount) <= maxCount;
			if(minCount !== -1 && maxCount === -1) return parseInt(cat.productCount) >= minCount;
			if(minCount === -1 && maxCount !== -1) return parseInt(cat.productCount) <= maxCount;
			return true;
		});

	if(!categories.length) container.innerHTML = `<h1>No categories found</h1>`;
	else container.innerHTML = categories.map(category => `
		<div onclick="handleCategoryClick(${category.id})" onmouseenter="fetch('${PRODUCTS_URL}${category.id}.json')" class="list-group-item list-group-item-action cursor-active">
			<div class="row">
				<div class="col-3">
					<img src="${formatImagePath(category.imgSrc)}" alt="${category.description}" class="img-thumbnail" style="padding: 0 !important;">
				</div>
				<div class="col">
					<div class="d-flex w-100 justify-content-between">
						<h4 class="mb-1">${category.name}</h4>
						<small class="text-muted">${category.productCount} artículos</small>
					</div>
					<p class="mb-1">${category.description}</p>
				</div>
			</div>
		</div>
	`).join('')
}

let categories: Category[] = [];
let minCount = -1, maxCount = -1;

const Categories: Page = async (path) => {
	addAfterHook(path, async() => {
		const { data } = await fetchEndpoint<Category[]>(CATEGORIES_URL);
		categories = data;

		updateCategories(categories);

		document.getElementById('sortAsc')!.addEventListener('click', function () {
			updateCategories(sortCategories('Asc', categories));
		});
	
		document.getElementById('sortDesc')!.addEventListener('click', function () {
			updateCategories(sortCategories('Desc', categories));
		});
	
		document.getElementById('sortByCount')!.addEventListener('click', function () {
			updateCategories(sortCategories('PCount', categories));
		});

		document.getElementById('clearRangeFilter')!.addEventListener('click', function () {
			const min = document.getElementById('rangeFilterCountMin') as HTMLInputElement;
			const max = document.getElementById('rangeFilterCountMax') as HTMLInputElement;			
			min.value = ''; max.value = '';
			minCount = -1, maxCount = -1;
	
			updateCategories(categories);
		});
	
		document.getElementById('rangeFilterCount')!.addEventListener('click', function () {
			//Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
			//de productos por categoría.
			const min = document.getElementById('rangeFilterCountMin') as HTMLInputElement;
			const max = document.getElementById('rangeFilterCountMax') as HTMLInputElement;
			
			if(min.value && parseInt(min.value) >= 0) minCount = parseInt(min.value);
			else minCount = -1;

			if(max.value && parseInt(max.value) >= 0) maxCount = parseInt(max.value);
			else maxCount = -1;
	
			updateCategories(categories);
		});
	});

    return `
		<div class="text-center p-4">
			<h2>Categorías</h2>
			<p class="lead">Verás aquí todas las categorías del sitio.</p>
		</div>
		<div class="container">
			<div class="row">
				<div class="col text-end">
					<div class="btn-group btn-group-toggle mb-4" data-bs-toggle="buttons">
						<input type="radio" class="btn-check" name="options" id="sortAsc" />
						<label class="btn btn-light" for="sortAsc">A-Z</label>
						<input type="radio" class="btn-check" name="options" id="sortDesc" />
						<label class="btn btn-light" for="sortDesc">Z-A</label>
						<input type="radio" class="btn-check" name="options" id="sortByCount" checked />
						<label class="btn btn-light" for="sortByCount"><i class="fas fa-sort-amount-down mr-1"></i></label>
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
				<div class="list-group" id="cat-list-container">
				</div>
			</div>
		</div>
	`;
};

export default Categories;
