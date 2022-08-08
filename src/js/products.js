const fetchProducts = async (category = 101) => {
    const prods = await fetch(`https://japceibal.github.io/emercado-api/cats_products/${category}.json`);
    if (prods.ok) return await prods.json();
    else return undefined;
};

const setupProducts = async () => {
    const { products } = await fetchProducts('101');
    const container = document.getElementById('prodList');
    container.innerHTML = products
        .map(
            (prod) => `
			<div class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${prod.image}" alt="${prod.description}" class="img-thumbnail">
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
	`
        )
        .join('');
};

setupProducts();
