async function fetchProducts(category = 101){
	return await fetchEndpoint(`${PRODUCTS_URL}${category}.json`);
};

async function setupProducts(){
    const categoryId = localStorage.getItem('catID');
    const { data: { catName, products } } = await fetchProducts(categoryId);
	
    const container = document.getElementById('prodList');
    if (!products.length) return (container.innerHTML = `<div>No hay productos para esta categoría.</div>`);

	container.innerHTML = products.map((prod) => `
			<div class="list-group-item list-group-item-action cursor-active" onclick="router.navigate('/product?id=${prod.id}')">
                <div class="row">
                    <div class="col-3">
                        <img src="${getImagePath(prod.image)}" alt="${prod.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${prod.name} - USD ${prod.cost}</h4>
                            <small class="text-muted">${prod.soldCount} vendidos</small>
                        </div>
                        <p class="mb-1">${prod.description}</p>
                    </div>
                </div>
            </div>
	`).join('');
	document.getElementById('prod-cat').innerHTML = catName;
};

setupProducts()
