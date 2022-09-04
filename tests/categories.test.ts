import { describe, expect, it } from 'vitest';
import { sortCategories, Category } from '../src/pages/categories';

const categories: Category[] = [
    {
        id: 101,
        name: 'Autos',
        description: 'Los mejores precios en autos 0 kilómetro, de alta y media gama.',
        productCount: '5',
        imgSrc: 'img/cat101_1.jpg'
    },
    {
        id: 105,
        name: 'Computadoras',
        description: 'Todo en cuanto a computadoras, para uso de oficina y/o juegos.',
        productCount: '0',
        imgSrc: 'img/cat105_1.jpg'
    },
    {
        id: 109,
        name: 'Celulares',
        description: 'Celulares de todo tipo para cubrir todas las necesidades.',
        productCount: '2',
        imgSrc: 'img/cat109_1.jpg'
    },
    {
        id: 107,
        name: 'Electrodomésticos',
        description: 'Todos los electrodomésticos modernos y de bajo consumo.',
        productCount: '0',
        imgSrc: 'img/cat107_1.jpg'
    }
];

describe('Categories sorting', () => {
    it('sorts ascending by name', () => {
        expect(sortCategories('Asc', categories)).toEqual([
			{
				id: 101,
				name: 'Autos',
				description: 'Los mejores precios en autos 0 kilómetro, de alta y media gama.',
				productCount: '5',
				imgSrc: 'img/cat101_1.jpg'
			},
			{
				id: 109,
				name: 'Celulares',
				description: 'Celulares de todo tipo para cubrir todas las necesidades.',
				productCount: '2',
				imgSrc: 'img/cat109_1.jpg'
			},
			{
				id: 105,
				name: 'Computadoras',
				description: 'Todo en cuanto a computadoras, para uso de oficina y/o juegos.',
				productCount: '0',
				imgSrc: 'img/cat105_1.jpg'
			},
			{
				id: 107,
				name: 'Electrodomésticos',
				description: 'Todos los electrodomésticos modernos y de bajo consumo.',
				productCount: '0',
				imgSrc: 'img/cat107_1.jpg'
			}
		]);
    });

	it('sorts descending by name', () => {
		expect(sortCategories('Desc', categories)).toEqual([
			{
				id: 107,
				name: 'Electrodomésticos',
				description: 'Todos los electrodomésticos modernos y de bajo consumo.',
				productCount: '0',
				imgSrc: 'img/cat107_1.jpg'
			},
			{
				id: 105,
				name: 'Computadoras',
				description: 'Todo en cuanto a computadoras, para uso de oficina y/o juegos.',
				productCount: '0',
				imgSrc: 'img/cat105_1.jpg'
			},
			{
				id: 109,
				name: 'Celulares',
				description: 'Celulares de todo tipo para cubrir todas las necesidades.',
				productCount: '2',
				imgSrc: 'img/cat109_1.jpg'
			},
			{
				id: 101,
				name: 'Autos',
				description: 'Los mejores precios en autos 0 kilómetro, de alta y media gama.',
				productCount: '5',
				imgSrc: 'img/cat101_1.jpg'
			},
		]);
	});

	it('sorts descending by product count', () => {
		expect(sortCategories('PCount', categories)).toEqual([
			{
				id: 101,
				name: 'Autos',
				description: 'Los mejores precios en autos 0 kilómetro, de alta y media gama.',
				productCount: '5',
				imgSrc: 'img/cat101_1.jpg'
			},
			{
				id: 109,
				name: 'Celulares',
				description: 'Celulares de todo tipo para cubrir todas las necesidades.',
				productCount: '2',
				imgSrc: 'img/cat109_1.jpg'
			},
			{
				id: 107,
				name: 'Electrodomésticos',
				description: 'Todos los electrodomésticos modernos y de bajo consumo.',
				productCount: '0',
				imgSrc: 'img/cat107_1.jpg'
			},
			{
				id: 105,
				name: 'Computadoras',
				description: 'Todo en cuanto a computadoras, para uso de oficina y/o juegos.',
				productCount: '0',
				imgSrc: 'img/cat105_1.jpg'
			},
		]);
	});
});
