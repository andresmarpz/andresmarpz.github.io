const CATEGORIES_URL = 'https://japceibal.github.io/emercado-api/cats/cat.json';
const PUBLISH_PRODUCT_URL = 'https://japceibal.github.io/emercado-api/sell/publish.json';
const PRODUCTS_URL = 'https://japceibal.github.io/emercado-api/cats_products/';
const PRODUCT_INFO_URL = 'https://japceibal.github.io/emercado-api/products/';
const PRODUCT_INFO_COMMENTS_URL = 'https://japceibal.github.io/emercado-api/products_comments/';
const CART_INFO_URL = 'https://japceibal.github.io/emercado-api/user_cart/';
const CART_BUY_URL = 'https://japceibal.github.io/emercado-api/cart/buy.json';
const EXT_TYPE = '.json';

let showSpinner = function () {
    document.getElementById('spinner-wrapper').style.display = 'block';
};

let hideSpinner = function () {
    document.getElementById('spinner-wrapper').style.display = 'none';
};

/**
 * 
 * @param {string} url 
 * @returns
 */
const fetchEndpoint = async (url) => {
    showSpinner();
	
    return await fetch(url)
        .then((response) => {
            if (response.ok) return response.json();
            else throw Error(response.statusText);
        })
        .then((response) => {
            return {
                ok: true,
                data: response
            };
        })
        .catch((error) => {
            return {
                ok: false,
                data: error
            };
        })
        .finally(hideSpinner);
};
