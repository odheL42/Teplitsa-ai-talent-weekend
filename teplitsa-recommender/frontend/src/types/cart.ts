import { DBDish } from './menu'

export interface CartItem {
	dish: DBDish
	amount: number
}

export type CartItemsMap = Record<string, number> // dishId -> amount
