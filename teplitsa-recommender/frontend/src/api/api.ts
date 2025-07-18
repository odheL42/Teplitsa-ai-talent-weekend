import { DBChatMessage } from '../types/chat'
import {
	ChunkResponse,
	ChunkType,
	CompletionsRequest,
} from '../types/completions'
import { DBDish } from '../types/menu'
import apiClient from '../utils/axios'
import { handleApiError } from '../utils/errors'

export const apiCompletions = async (
	request: CompletionsRequest,
	onData: (chunk: ChunkResponse) => void,
	onDone?: () => void,
	onError?: () => void
) => {
	const url = `/api/completions`

	try {
		const response = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(request),
		})

		if (!response.ok || !response.body) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const reader = response.body.getReader()
		const decoder = new TextDecoder('utf-8')

		while (true) {
			const { value, done } = await reader.read()
			if (done) break

			const raw = decoder.decode(value, { stream: true })

			// try parse as JSON
			try {
				const parsed: ChunkResponse = JSON.parse(raw)
				onData(parsed)
			} catch (err) {
				onData({ type: ChunkType.Default, text: raw })
			}
		}

		onDone?.()
	} catch (e) {
		handleApiError(e)
		onError?.()
	}
}

export const apiGetHistory = async (): Promise<DBChatMessage[]> => {
	try {
		const response = await apiClient.get(`/api/history`)
		return response.data
	} catch (error) {
		handleApiError(error)
		throw error
	}
}

export const apiGetMenu = async (): Promise<DBDish[]> => {
	try {
		const response = await apiClient.get(`/api/menu`)
		return response.data
	} catch (error) {
		handleApiError(error)
		throw error
	}
}

export const apiClearHistory = async (): Promise<DBDish[]> => {
	try {
		const response = await apiClient.post(`/api/erase_history`)
		return response.data
	} catch (error) {
		handleApiError(error)
		throw error
	}
}
