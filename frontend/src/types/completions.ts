import type { DBCart } from './cart'
import type { Preferences } from './preferences'

export interface CompletionsRequest {
	query: string
	cart: DBCart
	preferences: Preferences
}

export enum ChunkType {
	Default = 'default',
	Error = 'error',
}

export interface ChunkResponse {
	type: ChunkType
	text: string
}
