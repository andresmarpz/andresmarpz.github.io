export const CATEGORIES_URL = 'https://japceibal.github.io/emercado-api/cats/cat.json';
export const PUBLISH_PRODUCT_URL = 'https://japceibal.github.io/emercado-api/sell/publish.json';
export const PRODUCTS_URL = 'https://japceibal.github.io/emercado-api/cats_products/';
export const PRODUCT_INFO_URL = 'https://japceibal.github.io/emercado-api/products/';
export const PRODUCT_INFO_COMMENTS_URL = 'https://japceibal.github.io/emercado-api/products_comments/';
export const CART_INFO_URL = 'https://japceibal.github.io/emercado-api/user_cart/';
export const CART_BUY_URL = 'https://japceibal.github.io/emercado-api/cart/buy.json';

export async function fetchEndpoint<JSON = any>(
	input: RequestInfo,
	init?: RequestInit
): Promise<{
	ok: boolean,
	data: JSON
}> {
	return await fetch(input, init)
		.then(res => {
			if(res.ok) return res.json()
			else throw Error(res.statusText);
		}).then(data => {
			return { ok: true, data }
		})
		.catch(err => { 
			return { ok: false, data: err }
		});
}