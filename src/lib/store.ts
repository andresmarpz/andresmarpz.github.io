/**
 * Hooks
 */

import { CartProduct } from '../types';
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

class Store {
    public cart: ReadonlyArray<CartProduct>;

    constructor() {
        this.cart = [
            {
                id: 50924,
                name: 'Peugeot 208',
                count: 1,
                unitCost: 15200,
                currency: 'USD',
                image: formatImagePath('img/prod50924_1.jpg')
            },
            {
                id: 50921,
                name: 'Chevrolet Onix Joy',
                count: 4,
                currency: 'USD',
                unitCost: 13500,
                image: formatImagePath('img/prod50921_1.jpg')
            },
						{
							id: 50925,
							name: 'Chevrolet Onix Joy',
							count: 4,
							currency: 'USD',
							unitCost: 13500,
							image: formatImagePath('img/prod50921_1.jpg')
					}
        ];
    }

    private setCart(prods: CartProduct[]) {
        this.cart = prods;
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
        this.setCart([...this.cart, prod]);
    }

    public removeProduct(id: number) {
        this.setCart(this.cart.filter((prod) => prod.id !== id));
    }
}

const store = new Store();
export default function useStore() {
    return store;
}
