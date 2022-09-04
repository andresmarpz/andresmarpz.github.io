import { Page } from "../types";
import { fetchEndpoint, PRODUCT_INFO_URL } from "../util/fetcher";
import { formatImagePath } from "../util/formatter";
import addAfterHook from "../util/hooks/addAfter";

interface RelatedProduct{
	id: number,
	name: string,
	image: string
}

interface ProductInfo{
	id: number,
	name: string,
	description: string,
	cost: number,
	currency: 'USD',
	soldCount: number,
	category: string,
	images: string[],
	relatedProducts: RelatedProduct[]
}

const Product: Page = async(path) => {
	addAfterHook(path, async() => {
		const container = document.getElementById('prod-container');
		
		const urlSearchParams = new URLSearchParams(window.location.search);
		const id = urlSearchParams.get('id');

		const {data: product, ok} = await fetchEndpoint<ProductInfo>(PRODUCT_INFO_URL +id +'.json');
		if(!container) return;
		if(!product || !ok)  container!.innerHTML = `<h1>Product not found</h1>`;
		else container!.innerHTML = `
			<div class="row">
				<div class="col-12 col-sm-6">
					<img src="${formatImagePath(product.images[0])}" class="img-fluid" alt="${product.name}">
				</div>
				<div class="col-12 col-sm-6">
					<h1>${product.name}</h1>
					<p>${product.description}</p>
					<p class="text-muted">$${product.cost}</p>
					<button class="btn btn-primary">Add to cart</button>
				</div>
			</div>
		`;
	})

	return `
		<div class="container">
			<h1>Product</h1>
			<!-- Product container displaying its properties -->
			<div>
				<div class="flex justify-content-center">
					<div id="prod-container">
						Loading..
					</div>
				</div>
			</div>
		</div>
	`;
}

export default Product