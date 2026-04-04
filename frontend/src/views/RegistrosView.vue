<template>
  <div class="fade-in">
    <div class="page-header">
      <h2>📁 Registros del Censo</h2>
      <p>Listado completo de todas las visitas de censo registradas</p>
    </div>

    <!-- FILTERS -->
    <div class="filter-bar">
      <input
        class="search-input"
        v-model="search"
        placeholder="🔍 Buscar por nombre o cédula..."
      />
      <select class="filter-select" v-model="filterDept">
        <option value="">Todos los departamentos</option>
        <option v-for="d in uniqueDepts" :key="d" :value="d">{{ d }}</option>
      </select>
      <select class="filter-select" v-model="filterService">
        <option value="">Todos los servicios</option>
        <option value="Gas Natural">Gas Natural</option>
        <option value="Gas Licuado">Gas Licuado</option>
      </select>
      <button class="btn btn-outline" @click="clearFilters" v-if="search || filterDept || filterService">
        ✕ Limpiar
      </button>
    </div>

    <!-- TABLE -->
    <div class="card">
      <div v-if="censusStore.recordsLoading" style="text-align:center;padding:40px">
        <div class="spinner"></div>
        <p style="margin-top:12px;color:var(--text-muted);font-size:14px">Cargando registros...</p>
      </div>
      <template v-else>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px">
          <span style="font-size:13px;color:var(--text-muted)">
            Mostrando <strong>{{ paginated.length }}</strong> de <strong>{{ filtered.length }}</strong> registros
          </span>
          <span class="badge badge-navy">Total: {{ censusStore.records.length }}</span>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Persona</th>
                <th>Correo</th>
                <th>Departamento</th>
                <th>Municipio</th>
                <th>Servicio</th>
                <th>Agente</th>
                <th>Observaciones</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in paginated" :key="r.id">
                <td style="font-weight:700;color:var(--text-muted);font-size:13px">#{{ r.id }}</td>
                <td>
                  <div style="font-weight:600;font-size:13px">{{ r.personName }}</div>
                  <div style="font-size:11px;color:var(--text-muted)">{{ r.documentNumber }}</div>
                </td>
                <td style="font-size:12px;color:var(--text-muted)">
                  <a v-if="r.email" :href="'mailto:' + r.email" style="color:var(--navy)">{{ r.email }}</a>
                  <span v-else style="color:var(--text-light)">—</span>
                </td>
                <td style="font-size:13px">{{ r.departmentName }}</td>
                <td style="font-size:13px;color:var(--text-muted)">{{ r.municipalityName }}</td>
                <td>
                  <span class="badge" :class="r.serviceType === 'Gas Natural' ? 'badge-navy' : 'badge-warning'">
                    {{ r.serviceType }}
                  </span>
                </td>
                <td style="font-size:12px">{{ r.agentName }}</td>
                <td style="font-size:12px;max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" :title="r.observations">
                  {{ r.observations || '—' }}
                </td>
                <td style="font-size:12px;color:var(--text-muted);white-space:nowrap">{{ formatDate(r.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" v-if="!filtered.length">
          <span>📭</span>
          <p>No se encontraron registros</p>
        </div>

        <!-- PAGINATION -->
        <div class="pagination" v-if="totalPages > 1">
          <button class="page-btn" :disabled="page === 1" @click="page--">‹</button>
          <button
            v-for="p in totalPages" :key="p"
            class="page-btn" :class="{ active: p === page }" @click="page = p"
          >{{ p }}</button>
          <button class="page-btn" :disabled="page === totalPages" @click="page++">›</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCensusStore } from '../stores/census'

const censusStore = useCensusStore()
onMounted(() => censusStore.fetchRecords())

const search = ref('')
const filterDept = ref('')
const filterService = ref('')
const page = ref(1)
const perPage = 8

const uniqueDepts = computed(() =>
  [...new Set(censusStore.records.map(r => r.departmentName))].sort()
)

const filtered = computed(() =>
  censusStore.records.filter(r => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || r.personName.toLowerCase().includes(q) || r.documentNumber.includes(q)
    const matchDept = !filterDept.value || r.departmentName === filterDept.value
    const matchSvc = !filterService.value || r.serviceType === filterService.value
    return matchSearch && matchDept && matchSvc
  })
)

const totalPages = computed(() => Math.ceil(filtered.value.length / perPage))

const paginated = computed(() => {
  const start = (page.value - 1) * perPage
  return filtered.value.slice(start, start + perPage)
})

function clearFilters() {
  search.value = ''
  filterDept.value = ''
  filterService.value = ''
  page.value = 1
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
</script>
