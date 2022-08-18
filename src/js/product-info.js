async function fetchProduct(id) {
	return await fetchEndpoint(`${PRODUCT_INFO_URL}${id}.json`);
}

async function setupProduct(){
	const container = document.getElementById('prod-container');

	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	const id = params.id;

	if (!id) return container.innerHTML = `<div>No se encontró el producto.</div>`;

	const { data } = await fetchProduct(id);
	container.innerHTML = `
		<div>
			<h1>${data.name}</h1>
			<p>${data.description}</p>
			<p>USD ${data.cost}</p>
			<img src="${getImagePath(data.images[0])}" alt="${data.description}" class="img-thumbnail">
		</div>
	`
}

setupProduct();