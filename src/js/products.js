async function fetchProducts(category = 101) {
    return await fetchEndpoint(`${PRODUCTS_URL}${category}.json`);
}
function sortProducts(criteria, array) {
    switch (criteria) {
        case 'costUp':
            return array.sort((a, b) => a.cost - b.cost);
        case 'costDown':
            return array.sort((a, b) => b.cost - a.cost);
        case 'soldCount':
            return array.sort((a, b) => b.soldCount - a.soldCount);
        default:
            return array;
    }
}

function sortAndUpdateProducts(criteria) {
    productsArray = sortProducts(criteria, productsArray);
    updateProducts();
}

async function setupProducts() {
    document.getElementById('sortAsc').addEventListener('click', function () {
        sortAndUpdateProducts('costUp');
    });

    document.getElementById('sortDesc').addEventListener('click', function () {
        sortAndUpdateProducts('costDown');
    });

    document.getElementById('sortByCount').addEventListener('click', function () {
        sortAndUpdateProducts('soldCount');
    });

    document.getElementById('clearRangeFilter').addEventListener('click', function () {
        document.getElementById('rangeFilterCountMin').value = '';
        document.getElementById('rangeFilterCountMax').value = '';

        minCountProds = undefined;
        maxCountProds = undefined;

        updateProducts();
    });

    document.getElementById('rangeFilterCount').addEventListener('click', function () {
        const min = document.getElementById('rangeFilterCountMin').value;
        const max = document.getElementById('rangeFilterCountMax').value;

        if (min && parseInt(min) >= 0) minCountProds = parseInt(min);
		if(max && parseInt(max) >= 0) maxCountProds = parseInt(max);

        updateProducts();
    });

    const categoryId = localStorage.getItem('catID');
    const {
        data: { catName, products }
    } = await fetchProducts(categoryId);
    productsArray = products;

    document.getElementById('prod-cat').innerHTML = catName;
    if (!products.length)
        return (document.getElementById('prodList').innerHTML = `<div>No hay productos para esta categoría.</div>`);
    updateProducts();
}

function updateProducts() {
    const container = document.getElementById('prodList');
    const prods =
        minCountProds && maxCountProds
            ? productsArray.filter((p) => p.cost >= minCountProds && p.cost <= maxCountProds)
            : productsArray;
    container.innerHTML = prods
        .map(
            (prod) => `
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
	`
        )
        .join('');
}

setupProducts();
