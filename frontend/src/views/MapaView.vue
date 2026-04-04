<template>
  <div class="fade-in">
    <div class="page-header">
      <h2>🗺️ Mapa de Colombia</h2>
      <p>Selecciona un departamento del mapa o del listado para ver sus municipios</p>
    </div>

    <div class="map-container">
      <!-- LEAFLET MAP + SELECTOR -->
      <div style="display:flex;flex-direction:column;gap:16px">

        <!-- Selector de departamento -->
        <div class="card" style="padding:16px">
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <span style="font-size:14px;font-weight:600;color:var(--navy);white-space:nowrap">📍 Seleccionar Departamento:</span>
            <select
              class="filter-select"
              style="flex:1;min-width:200px;font-size:14px;padding:10px 14px"
              v-model="selectedId"
              @change="onSelectChange"
            >
              <option value="">-- Selecciona un departamento --</option>
              <option
                v-for="d in deptsStore.departments"
                :key="d.id"
                :value="d.id"
              >{{ d.name }}</option>
            </select>
            <button v-if="selectedId" class="btn btn-outline" @click="clearSelection" style="white-space:nowrap">
              ✕ Limpiar
            </button>
          </div>
        </div>

        <!-- MAPA LEAFLET -->
        <div style="background:white;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);border:1px solid var(--border)">
          <div id="colombia-map" style="width:100%;height:460px"></div>
        </div>

        <!-- Leyenda -->
        <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:var(--text-muted)">
          <div style="display:flex;align-items:center;gap:6px"><span style="background:#10b981;width:12px;height:12px;border-radius:50%;display:inline-block"></span> Con cobertura</div>
          <div style="display:flex;align-items:center;gap:6px"><span style="background:#f59e0b;width:12px;height:12px;border-radius:50%;display:inline-block"></span> Cobertura parcial</div>
          <div style="display:flex;align-items:center;gap:6px"><span style="background:#3b82f6;width:12px;height:12px;border-radius:50%;display:inline-block"></span> Sin cobertura</div>
          <div style="display:flex;align-items:center;gap:6px"><span style="background:#f5890a;width:12px;height:12px;border-radius:50%;display:inline-block"></span> Seleccionado</div>
        </div>
      </div>

      <!-- SIDE PANEL -->
      <div class="map-panel">
        <div class="map-panel-header">
          <h3>{{ deptsStore.selectedDept ? deptsStore.selectedDept.name : 'Selecciona un departamento' }}</h3>
          <p>{{ deptsStore.selectedDept ? 'Municipios disponibles' : 'Usa el selector o el mapa' }}</p>
        </div>
        <div class="map-panel-body">
          <template v-if="!deptsStore.selectedDept">
            <div class="empty-state">
              <span>🗺️</span>
              <p>Ningún departamento seleccionado</p>
            </div>
          </template>
          <template v-else-if="deptsStore.loading">
            <div style="text-align:center;padding:32px"><div class="spinner"></div></div>
          </template>
          <template v-else>
            <div style="margin-bottom:14px;display:flex;gap:8px;flex-wrap:wrap">
              <span class="badge badge-navy">{{ deptsStore.municipalities.length }} municipios</span>
              <span class="badge" :class="coverageBadge(deptsStore.selectedDept)">
                {{ deptCoverage(deptsStore.selectedDept) }}
              </span>
            </div>
            <p style="font-size:11px;color:var(--text-muted);margin-bottom:8px">Haz clic en un municipio para iniciar el censo:</p>
            <div
              class="muni-item"
              v-for="m in deptsStore.municipalities"
              :key="m.id"
              style="cursor:pointer"
              title="Ir al Censo con este municipio"
              @click="goToCenso(m)"
            >
              <span class="muni-dot"></span>
              {{ m.name }}
              <span style="margin-left:auto;font-size:11px;color:var(--orange)">📋 Censar</span>
            </div>
          </template>
        </div>
        <div v-if="deptsStore.selectedDept" style="padding:16px;border-top:1px solid var(--border)">
          <button class="btn btn-outline" style="width:100%;justify-content:center" @click="clearSelection">
            ✕ Limpiar selección
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useDepartmentsStore } from '../stores/departments'

const deptsStore = useDepartmentsStore()
const router = useRouter()
const selectedId = ref('')

let map = null
const markers = {}

const coveredIds = [2, 4, 5, 14, 27, 30]
const partialIds  = [6, 7, 9, 11, 17, 20, 22, 25]

// Centroides aproximados de cada departamento [lat, lng]
const CENTROIDS = {
  1:  [-1.5, -72.0],   // Amazonas
  2:  [7.0, -75.5],    // Antioquia
  3:  [7.1, -71.6],    // Arauca
  4:  [10.7, -74.9],   // Atlántico
  5:  [9.0, -74.8],    // Bolívar
  6:  [6.0, -72.3],    // Boyacá
  7:  [5.3, -75.3],    // Caldas
  8:  [1.0, -74.0],    // Caquetá
  9:  [5.5, -72.0],    // Casanare
  10: [2.5, -76.5],    // Cauca
  11: [9.3, -73.5],    // Cesar
  12: [5.5, -77.0],    // Chocó
  13: [8.3, -75.7],    // Córdoba
  14: [4.5, -74.2],    // Cundinamarca
  15: [2.5, -68.5],    // Guainía
  16: [2.0, -72.5],    // Guaviare
  17: [2.5, -75.5],    // Huila
  18: [11.5, -72.5],   // La Guajira
  19: [10.4, -74.0],   // Magdalena
  20: [3.5, -73.5],    // Meta
  21: [1.3, -77.5],    // Nariño
  22: [8.0, -72.8],    // Norte de Santander
  23: [0.5, -76.0],    // Putumayo
  24: [4.5, -75.7],    // Quindío
  25: [5.3, -75.8],    // Risaralda
  26: [12.5, -81.7],   // San Andrés
  27: [7.0, -73.2],    // Santander
  28: [9.0, -75.1],    // Sucre
  29: [4.0, -75.3],    // Tolima
  30: [3.8, -76.5],    // Valle del Cauca
  31: [0.5, -70.5],    // Vaupés
  32: [5.0, -69.5],    // Vichada
}

function getColor(id) {
  if (coveredIds.includes(id)) return '#10b981'
  if (partialIds.includes(id))  return '#f59e0b'
  return '#3b82f6'
}

function deptCoverage(dept) {
  if (!dept) return ''
  if (coveredIds.includes(dept.id)) return '✅ Cobertura total'
  if (partialIds.includes(dept.id)) return '⚠️ Cobertura parcial'
  return '❌ Sin cobertura'
}

function coverageBadge(dept) {
  if (!dept) return ''
  if (coveredIds.includes(dept.id)) return 'badge-success'
  if (partialIds.includes(dept.id)) return 'badge-warning'
  return 'badge-danger'
}

function updateMarkerStyle(id, selected) {
  const marker = markers[id]
  if (!marker) return
  const color = selected ? '#f5890a' : getColor(id)
  marker.setStyle({
    fillColor: color,
    color: selected ? '#071a3e' : 'white',
    weight: selected ? 3 : 1.5,
    fillOpacity: selected ? 1 : 0.88,
    radius: selected ? 14 : 10,
  })
}

async function selectDept(dept) {
  // Reset all markers
  deptsStore.departments.forEach(d => updateMarkerStyle(d.id, false))
  // Highlight selected
  updateMarkerStyle(dept.id, true)
  selectedId.value = dept.id
  // Pan map to dept
  const center = CENTROIDS[dept.id]
  if (center && map) map.panTo(center)
  await deptsStore.selectDepartment(dept)
}

async function onSelectChange() {
  if (!selectedId.value) {
    clearSelection()
    return
  }
  const dept = deptsStore.departments.find(d => d.id === Number(selectedId.value))
  if (dept) await selectDept(dept)
}

function goToCenso(municipio) {
  const dept = deptsStore.selectedDept
  router.push({
    path: '/censo',
    query: {
      dept: dept ? dept.name : '',
      muni: municipio.name,
    },
  })
}

function clearSelection() {
  selectedId.value = ''
  deptsStore.departments.forEach(d => updateMarkerStyle(d.id, false))
  deptsStore.clearSelection()
}

onMounted(async () => {
  await deptsStore.fetchDepartments()

  map = L.map('colombia-map', {
    center: [4.5, -73.5],
    zoom: 5,
    scrollWheelZoom: false,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(map)

  // Create a circle marker for each department at its centroid
  deptsStore.departments.forEach(dept => {
    const center = CENTROIDS[dept.id]
    if (!center) return

    const marker = L.circleMarker(center, {
      radius: 10,
      fillColor: getColor(dept.id),
      color: 'white',
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.88,
    })

    marker.bindTooltip(`<b>${dept.name}</b><br><small>${dept.municipalityCount} municipios</small>`, {
      permanent: false,
      direction: 'top',
      className: 'dept-tooltip',
    })

    marker.on('click', () => selectDept(dept))
    marker.on('mouseover', function() {
      if (selectedId.value !== dept.id) {
        this.setStyle({ radius: 12, fillOpacity: 1 })
      }
    })
    marker.on('mouseout', function() {
      if (selectedId.value !== dept.id) {
        this.setStyle({ radius: 10, fillOpacity: 0.88 })
      }
    })

    marker.addTo(map)
    markers[dept.id] = marker
  })
})

onBeforeUnmount(() => {
  if (map) { map.remove(); map = null }
})
</script>

<style>
.dept-tooltip {
  background: #0d2b5e !important;
  color: white !important;
  border: none !important;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}
.dept-tooltip::before { border-top-color: #0d2b5e !important; }
.leaflet-container { font-family: 'Inter', sans-serif; }
</style>
