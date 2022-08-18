const CATEGORIES_URL = 'https://japceibal.github.io/emercado-api/cats/cat.json';
const PUBLISH_PRODUCT_URL = 'https://japceibal.github.io/emercado-api/sell/publish.json';
const PRODUCTS_URL = 'https://japceibal.github.io/emercado-api/cats_products/';
const PRODUCT_INFO_URL = 'https://japceibal.github.io/emercado-api/products/';
const PRODUCT_INFO_COMMENTS_URL = 'https://japceibal.github.io/emercado-api/products_comments/';
const CART_INFO_URL = 'https://japceibal.github.io/emercado-api/user_cart/';
const CART_BUY_URL = 'https://japceibal.github.io/emercado-api/cart/buy.json';
const EXT_TYPE = '.json';

// categories.js
const ORDER_ASC_BY_NAME = 'AZ';
const ORDER_DESC_BY_NAME = 'ZA';
const ORDER_BY_PROD_COUNT = 'Cant.';
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

// sell.js
let productCost = 0;
let productCount = 0;
let comissionPercentage = 0.13;
let MONEY_SYMBOL = '$';
let DOLLAR_CURRENCY = 'Dólares (USD)';
let PESO_CURRENCY = 'Pesos Uruguayos (UYU)';
let DOLLAR_SYMBOL = 'USD ';
let PESO_SYMBOL = 'UYU ';
let PERCENTAGE_SYMBOL = '%';
let MSG = 'FUNCIONALIDAD NO IMPLEMENTADA';

const fetchEndpoint = async (url) => {
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
        });
};

const getImagePath = (url = '') => {
    return url.replace('.jpg', '.webp').replace('.png', '.webp');
};

/**
 * Create a Navigo router and configure it
 */

const routes = {
    '/': {
        view: '../views/home.html'
    },
    '/categories': {
        view: '../views/categories.html',
        scripts: ['../js/categories.js']
    },
    '/products': {
        view: '../views/products.html',
        scripts: ['../js/products.js']
    },
    '/sell': {
        view: '../views/sell.html',
        scripts: ['../js/dropzone.js', '../js/sell.js']
    }
};

const render = async (path) => {
    const container = document.querySelector('[navigo-container]');
    const route = routes[path];
    if (!route.rendered) {
        const content = await fetch(route.view).then((response) => response.text());
		routes[path].rendered = true;
		routes[path].view = content;
        container.innerHTML = content;
    }else container.innerHTML = route.view;

    if (route.scripts) {
        for (let script of route.scripts) {
            const scriptElement = document.createElement('script');
            const content = await fetch(script).then((response) => response.text());
            if (!content) return;
            scriptElement.innerHTML = content;
            container.appendChild(scriptElement);
        }
    }
};

const router = new Navigo('/');
router.on({
        '': () => {
            render('/');
        },
        '/categories': () => {
            render('/categories');
        },
        '/products': () => {
			render('/products');
		},
        '/product/:id': (params) => {},
        '/cart': () => {},
        '/sell': () => {
            render('/sell');
        },
        '/login': () => {
            render('/login');
        },
        '/index.html': () => {
            router.navigate('');
        },
        '/categories.html': () => {},
        '/products.html': () => {}
}).resolve();
