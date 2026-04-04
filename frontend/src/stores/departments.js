import { defineStore } from 'pinia'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const useDepartmentsStore = defineStore('departments', {
  state: () => ({
    departments: [],
    municipalities: [],
    selectedDept: null,
    loading: false,
  }),
  actions: {
    async fetchDepartments() {
      if (this.departments.length) return
      this.loading = true
      try {
        const { data } = await axios.get(`${API}/departments`)
        this.departments = data
      } finally {
        this.loading = false
      }
    },
    async selectDepartment(dept) {
      this.selectedDept = dept
      this.loading = true
      try {
        const { data } = await axios.get(`${API}/departments/${dept.id}/municipalities`)
        this.municipalities = data.municipalities
      } finally {
        this.loading = false
      }
    },
    clearSelection() {
      this.selectedDept = null
      this.municipalities = []
    },
  },
})
