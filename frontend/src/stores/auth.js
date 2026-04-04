import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Interceptor: agrega token a todas las peticiones
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('dygas_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('dygas_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('dygas_user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password })
    token.value = res.data.access_token
    user.value = res.data.user
    localStorage.setItem('dygas_token', token.value)
    localStorage.setItem('dygas_user', JSON.stringify(user.value))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('dygas_token')
    localStorage.removeItem('dygas_user')
  }

  function initAuth() {
    const storedToken = localStorage.getItem('dygas_token')
    const storedUser = localStorage.getItem('dygas_user')
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  return { token, user, isAuthenticated, login, logout, initAuth }
})
