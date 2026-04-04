import { defineStore } from 'pinia'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const useCensusStore = defineStore('census', {
  state: () => ({
    records: [],
    stats: null,
    verifyResult: null,
    verifyLoading: false,
    recordsLoading: false,
    statsLoading: false,
  }),
  actions: {
    async verify(documentNumber) {
      this.verifyLoading = true
      this.verifyResult = null
      try {
        const { data } = await axios.get(`${API}/census/verify/${documentNumber}`)
        this.verifyResult = data
      } finally {
        this.verifyLoading = false
      }
    },
    async fetchRecords() {
      this.recordsLoading = true
      try {
        const { data } = await axios.get(`${API}/census`)
        this.records = data
      } finally {
        this.recordsLoading = false
      }
    },
    async fetchStats() {
      this.statsLoading = true
      try {
        const { data } = await axios.get(`${API}/census/stats`)
        this.stats = data
      } finally {
        this.statsLoading = false
      }
    },
    async createRecord(payload) {
      const { data } = await axios.post(`${API}/census`, payload)
      this.records.unshift(data)
      return data
    },
    clearVerify() {
      this.verifyResult = null
    },
  },
})
