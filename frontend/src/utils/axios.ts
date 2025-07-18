import axios from 'axios'
import { handleApiError } from './errors'

const apiClient = axios.create({
	baseURL: ``,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
})

apiClient.interceptors.response.use(
	response => response,
	error => {
		handleApiError(error)

		return Promise.reject(error)
	},
)

export default apiClient
