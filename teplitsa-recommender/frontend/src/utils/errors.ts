import { toast } from 'react-toastify'

export const handleApiError = (error: any): void => {
	const message =
		error?.response?.data?.detail ||
		error?.response?.data?.message ||
		error?.message ||
		'Unexpected error'

	toast.error(`Error: ${message}`)
}
