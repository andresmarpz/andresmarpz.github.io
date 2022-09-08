import { Page } from '../types';
import { fetchEndpoint, PRODUCT_INFO_COMMENTS_URL, PRODUCT_INFO_URL } from '../util/fetcher';
import { formatImagePath } from '../util/formatter';
import addAfterHook from '../util/hooks/addAfter';

import '../css/product.css';

interface RelatedProduct {
    id: number;
    name: string;
    image: string;
}

interface ProductInfo {
    id: number;
    name: string;
    description: string;
    cost: number;
    currency: 'USD';
    soldCount: number;
    category: string;
    images: string[];
    relatedProducts: RelatedProduct[];
}

interface Comment {
    product: number;
    score: number;
    description: string;
    user: string;
    dateTime: Date;
}

(window as any).handleAddComment = function handleAddComment(event: SubmitEvent){
	event.preventDefault();
}

const StarRating: (score: number) => string = (score) => {
    return Array.from(Array(5).keys())
        .map(
            (idx) => `
			<span class="fa fa-star ${idx < score ? 'checked' : ''}"></span>
		`
        )
        .join('');
};

let selected = 0;
(window as any).selectStar = function selectStar(idx: number) {
    selected = idx;

	Array.from(document.getElementsByClassName('add-comment-star')).forEach(s => s.classList.remove('checked'));
    Array.from(document.getElementsByClassName('add-comment-star')).forEach((star, _) =>
        _ <= idx ? star.classList.add('checked') : ''
    );
};

const AddComment: () => string = () => {
    return `
		<div style='margin-top: 32px;'>
			<h3>Agregar un comentario</h3>
			<div class="form-group">
				<span class='add-comment-cnt' name="score">
					${Array.from(Array(5).keys()).map(idx => `
						<span class="fa fa-star add-comment-star ${idx === 0 ? 'checked' : ''}" onclick="selectStar(${idx})"></span>
					`).join('')}
				</span>
				<form style="display: flex; flex-direction: column;" onsubmit="handleAddComment()">
					<textarea class='add-comment-txt' id='comment-content' placeholder='Escribe tu comentario aqui..'></textarea>
					<button class='add-comment-btn'>Enviar</button>
				</form>
			</div>
		</div>
	`;
};

const Product: Page = async (path) => {
    addAfterHook(path, async () => {
        const container = document.getElementById('prod-container');

        const urlSearchParams = new URLSearchParams(window.location.search);
        const id = urlSearchParams.get('id');

        const { data: product, ok } = await fetchEndpoint<ProductInfo>(PRODUCT_INFO_URL + id + '.json');
        const { data: comments } = await fetchEndpoint<Comment[]>(PRODUCT_INFO_COMMENTS_URL + id + '.json');
        if (!container) return;
        if (!product || !ok) container!.innerHTML = `<h1>Product not found</h1>`;
        else
            container!.innerHTML = `
			<div class='product-header'>
				<h1 class='product-title'>${product.name.toUpperCase()}</h1>
				<span class='product-tag'>${product.category}</span>
			</div>
			<div class='product-description'>
				${product.description}
			</div>
			<div class='product-gallery'>
				${product.images.map((image) => `<img class='product-image' src=${formatImagePath(image)}>`).join('')}
			</div>
			<div class='product-price-wp'>
				<span class='product-price'>$${product.cost} </span>
				<span><button class='product-buy'>Comprar <span>→</span></button></span>
			</div>
			<div class='product-solds'>
				${product.soldCount} vendidos
			</div>
			
			<hr>
			
			<div class='p-comments-cnt'>
				<h2 style='font-weight: 700;'>Comentarios</h2>
				${comments.length ? 
					comments.map((comment) => `
						<div class='p-comment'>
							<div class='p-comment-header'>
								<span>
									<span class='p-comment-user'>${comment.user}</span>
									<span>${StarRating(comment.score)}</span>
								</span>
								<span class='p-comment-date'>${comment.dateTime}</span>
							</div>
							<div class='p-comment-body'>
								${comment.description}
							</div>
						</div>
					`).join('')
					: `<div>No hay comentarios</div>`
				}
			</div>
			${AddComment()}
				
			<hr>
			
			<div>
				<h2 style='font-weight: 700;'>Relacionados</h2>
				<div class='p-related-cnt'>
					${product.relatedProducts.map((related) => `
						<a class='p-related' href='/product?id=${related.id}' data-navigo>
							<img class='p-related-img' src=${formatImagePath(related.image)}>
							<span class='product-related-name'>${related.name}</span>
						</a>
					`).join('')}
				</div>
			</div>
		`;
    });

    return `
		<div class="container py-4">
			<div id="prod-container" class='product-container'>
				Loading..
			</div>
		</div>
	`;
};

export default Product;
