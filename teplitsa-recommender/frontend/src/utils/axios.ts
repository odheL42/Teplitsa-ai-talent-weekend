import axios from 'axios'
import { handleApiError } from './errors'

const apiClient = axios.create({
	baseURL: process.env.REACT_APP_API_BASE,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: false,
})

apiClient.defaults.withCredentials = false

apiClient.interceptors.response.use(
	response => response,
	error => {
		handleApiError(error)

		return Promise.reject(error)
	}
)

export default apiClient
