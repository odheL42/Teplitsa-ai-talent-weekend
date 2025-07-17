import type { DBCart } from './cart'
import type { Preferences } from './preferences'

export interface CompletionsRequest {
	query: string
	cart: DBCart
	preferences: Preferences
}
