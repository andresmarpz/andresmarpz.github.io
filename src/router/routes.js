const routes = [
    {
        path: '/',
        template: 'views/home.html',
		scripts: ['../js/index.js']
    },
    {
        path: '/test',
        template: 'views/test.html'
    },
    {
        path: '/login',
        template: 'views/login.html'
    },
    {
        path: '/categories',
        template: 'views/categories.html',
		scripts: ['../js/categories.js']
    },
	{
		path: '/products',
		template: 'views/products.html',
		scripts: ['../js/products.js']
	},
	{
		path: '/sell',
		template: 'views/sell.html',
		scripts: ['../js/dropzone.js','../js/sell.js']
	}
];
