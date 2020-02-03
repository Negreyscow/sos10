import axios from 'axios'

const api = axios.create({
    baseURL: 'http://192.168.88.144:8080'
})

export default api