import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://newsdata.io/api/1',
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message = (error.response?.data as { message?: string })?.message ?? error.message
      return Promise.reject(new Error(message))
    }
    return Promise.reject(error)
  },
)

export default apiClient
