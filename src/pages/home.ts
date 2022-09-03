import { Page } from '../types';

const Home: Page = async () => {
	

    return `
		<div class="jumbotron text-center"></div>
		<div class="album py-5 bg-light">
			<div class="container">
				<div class="row">
					<div class="col-md-4">
						<div class="card mb-4 shadow-sm custom-card cursor-active" id="autos" onclick="localStorage.setItem('catID', 101); router.navigate('/products');">
							<img
								class="bd-placeholder-img card-img-top"
								src="img/cars_index.webp"
								alt="Imgagen representativa de la categoría 'Autos'" />
							<h3 class="m-3">Autos</h3>
							<div class="card-body">
								<p class="card-text">Los mejores precios en autos 0 kilómetro, de alta y media gama.</p>
							</div>
						</div>
					</div>
					<div class="col-md-4">
						<div class="card mb-4 shadow-sm custom-card cursor-active" id="juguetes" onclick="localStorage.setItem('catID', 102); router.navigate('/products');">
							<img
								class="bd-placeholder-img card-img-top"
								src="img/toys_index.webp"
								alt="Imgagen representativa de la categoría 'Juguetes'" />
							<h3 class="m-3">Juguetes</h3>
							<div class="card-body">
								<p class="card-text">Encuentra aquí los mejores precios para niños/as de cualquier edad.</p>
							</div>
						</div>
					</div>
					<div class="col-md-4">
						<div class="card mb-4 shadow-sm custom-card cursor-active" id="muebles" onclick="localStorage.setItem('catID', 103); router.navigate('/products');">
							<img
								class="bd-placeholder-img card-img-top"
								src="img/furniture_index.webp"
								alt="Imgagen representativa de la categoría 'Muebles'" />
							<h3 class="m-3">Muebles</h3>
							<div class="card-body">
								<p class="card-text">Muebles antiguos, nuevos y para ser armados por uno mismo.</p>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<a class="btn btn-light btn-lg btn-block" href="categories.html">Y mucho más!</a>
				</div>
			</div>
		</div>
	`;
};

export default Home;
