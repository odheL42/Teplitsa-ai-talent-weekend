import { toast } from 'react-toastify'

export const handleApiError = (error: Error): void => {
	const message = error?.message || 'Unexpected error'

	toast.error(`API error: ${message}`)
}

export const handleStorageError = (error: Error): void => {
	const message = error?.message || 'Unexpected error'

	toast.error(`Storage error: ${message}`)
}

export const handleGenerationError = (error: Error): void => {
	const message = error?.message || 'Unexpected error'

	toast.error(`Generation Error: ${message}`)
}
