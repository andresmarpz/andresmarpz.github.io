/**
 * Hooks
 */

import { CartProduct } from '../types';
import { fetchEndpoint } from './fetcher';
import { formatImagePath } from './formatter';

interface AfterEntry {
  path: string;
  fn: () => void;
}

interface HookStore {
  after: AfterEntry[];
  before: string[];
}

export const hooks: HookStore = {
  after: [],
  before: []
};

/**
 * Data
 */

async function fetchCart() {
  return await fetchEndpoint<{
    user: number;
    articles: CartProduct[];
  }>('https://japceibal.github.io/emercado-api/user_cart/25801.json');
}
class Store {
  public cart: ReadonlyArray<CartProduct>;

  constructor() {
    this.cart = [];

    const persisted = localStorage.getItem('cart');
    if (persisted) this.cart = JSON.parse(persisted);
    else {
      fetchCart().then(({ data }) => {
        this.setCart(data.articles.map(art => ({
					...art,
					image: formatImagePath(art.image),
				})));
      });
    }
  }

  private setCart(prods: CartProduct[]) {
    this.cart = prods;
		localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  public modifyCount(id: number, count: number) {
    const newState = this.cart.map((prod) =>
      prod.id === id
        ? {
            ...prod,
            count: count
          }
        : prod
    );
    this.setCart(newState);
  }

  public addProduct(prod: CartProduct) {
		const entry = this.cart.find((p) => p.id === prod.id);
		if(entry) this.modifyCount(prod.id, entry.count + 1);
		else this.setCart([...this.cart, prod]);
  }

  public removeProduct(id: number) {
    this.setCart(this.cart.filter((prod) => prod.id !== id));
  }
}

const store = new Store();
export default function useStore() {
  return store;
}
