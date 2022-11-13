export type Page = (path: string) => string | Promise<string>

export type CartProduct = {
	id: number,
	name: string,
	count: number,
	unitCost: number,
	currency: "USD" | "UYU",
	image: string
}

export interface Profile{
	firstName: string,
	secondName: string,
	firstLastName: string,
	secondLastName: string,
	email: string,
	password: string,
	contactNumber: string,
}
