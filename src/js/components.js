const renderNavigation = () => {
    const body = document.querySelector('body');
    body.innerHTML = `<nav class="navbar navbar-expand-lg navbar-dark bg-dark p-1" id="navbar">
	<div class="container">
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarNav"
			aria-controls="navbarNav"
			aria-expanded="false"
			aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarNav">
			<ul class="navbar-nav w-100 justify-content-between">
				<li class="nav-item">
					<a class="nav-link active" href="/" data-navigo>Inicio</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/categories" data-navigo>Categorías</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/sell" data-navigo>Vender</a>
				</li>
				<li class="nav-item"></li>
			</ul>
		</div>
	</div>
</nav>${body.innerHTML}`;
};
