import { DBChatMessage } from '../types/chat'
import { DBDish } from '../types/menu'
import apiClient from '../utils/axios'
import { handleApiError } from '../utils/errors'

const buildApiUrl = (path: string): string => {
	const rawBase = import.meta.env.VITE_API_BASE

	const base = rawBase ? rawBase : `${window.location.origin}`

	const url = new URL(path, base)

	return url.toString()
}

export const apiCompletions = async (
	query: string,
	onData: (data: string) => void,
	onDone?: () => void,
	onError?: () => void
) => {
	const url = buildApiUrl(`/api/completions`)

	try {
		console.log('QUERY', query)
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: query,
			}),
		})

		if (!response.ok || !response.body) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const reader = response.body.getReader()
		const decoder = new TextDecoder('utf-8')

		while (true) {
			const { value, done } = await reader.read()
			if (done) break

			onData(decoder.decode(value, { stream: true }))
		}

		onDone?.()
	} catch (e) {
		handleApiError(e)
		onError?.()
	}
}

export const apiGetHistory = async (): Promise<DBChatMessage[]> => {
	try {
		const response = await apiClient.get(`/api/history/`)
		return response.data
	} catch (error) {
		handleApiError(error)
		throw error
	}
}

export const apiGetMenu = async (): Promise<DBDish[]> => {
	try {
		const response = await apiClient.get(`/api/menu/`)
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
