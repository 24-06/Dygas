<template>
  <div class="fade-in">
    <div class="page-header">
      <h2>📋 Módulo de Censo</h2>
      <p>Selecciona un departamento → elige el municipio → completa el censo</p>
    </div>

    <!-- MAP CARD (full width) -->
    <div class="card" style="padding:0;overflow:hidden">
      <!-- Header bar -->
      <div class="map-header">
        <div>
          <div class="map-header-title">🗺️ Mapa de Colombia</div>
          <div class="map-header-sub">Haz clic en un marcador para seleccionar el departamento</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <select v-model="mapSelectedId" @change="onMapSelectChange" class="map-select">
            <option value="">-- Seleccionar departamento --</option>
            <option v-for="d in deptsStore.departments" :key="d.id" :value="d.id">{{ d.name }}</option>
          </select>
          <button v-if="mapSelectedId" @click="clearMapSelection" class="map-clear-btn">✕</button>
        </div>
      </div>

      <!-- Map + municipality panel -->
      <div class="map-body">
        <div id="censo-mapa" class="mapa-container"></div>

        <!-- Municipio side panel -->
        <div class="muni-panel">
          <div v-if="!deptsStore.selectedDept" class="muni-empty">
            <span style="font-size:40px">📍</span>
            <p style="font-weight:600;margin:10px 0 4px">Selecciona un departamento</p>
            <small>en el mapa o en el selector</small>
          </div>
          <template v-else>
            <div class="muni-dept-header">
              <div style="font-weight:700;font-size:14px;color:var(--text)">{{ deptsStore.selectedDept.name }}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px">Clic en un municipio para censar</div>
            </div>
            <div class="muni-list">
              <div v-if="deptsStore.loading" style="text-align:center;padding:20px">
                <div class="spinner" style="width:22px;height:22px;border-width:3px;margin:0 auto"></div>
              </div>
              <button
                v-else
                v-for="m in deptsStore.municipalities"
                :key="m.id"
                @click="openModal(m)"
                class="muni-btn"
              >
                <span class="muni-dot"></span>
                <span>{{ m.name }}</span>
                <span class="muni-census-label">📋 Censar</span>
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════ MODAL ═══════════════════════ -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
          <div class="modal-box">
            <!-- Modal header -->
            <div class="modal-header">
              <div>
                <div class="modal-title">📋 Registrar Censo</div>
                <div class="modal-subtitle">
                  <span class="modal-badge">{{ modalDept }}</span>
                  <span class="modal-badge">{{ modalMuni }}</span>
                </div>
              </div>
              <button class="modal-close" @click="closeModal">✕</button>
            </div>

            <div class="modal-body">
              <!-- ── VERIFICAR DOCUMENTO ── -->
              <div class="modal-section">
                <div class="section-title" style="margin-bottom:14px">🔍 Verificar Documento</div>
                <div class="input-group">
                  <label for="docInputModal">Número de Documento (Cédula)</label>
                  <input
                    id="docInputModal" type="text" class="input-field"
                    v-model="docNumber" placeholder="Ej: 1098765432" maxlength="12"
                    @keyup.enter="runVerify"
                  />
                </div>
                <div style="display:flex;gap:10px">
                  <button class="btn btn-primary" style="flex:1;justify-content:center" :disabled="!docNumber || loadingVerify" @click="runVerify">
                    <span v-if="loadingVerify" style="display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.4);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:6px"></span>
                    {{ loadingVerify ? 'Verificando…' : '🔍 Verificar' }}
                  </button>
                  <button v-if="verifyResult !== null" class="btn btn-outline" @click="clearVerify">✕</button>
                </div>

                <!-- NOT FOUND -->
                <div class="result-not-found slide-in" v-if="verifyResult && !verifyResult.found" style="margin-top:14px">
                  <span>❌</span>
                  <p>No Encontrado</p>
                  <small>La cédula <strong>{{ docNumber }}</strong> no está en DYGAS</small>
                </div>

                <!-- FOUND -->
                <div class="person-card slide-in" v-if="verifyResult && verifyResult.found" style="margin-top:14px">
                  <div class="person-card-header">
                    <div class="person-avatar">{{ initials(verifyResult.person) }}</div>
                    <div>
                      <div class="person-name">{{ verifyResult.person.firstName }} {{ verifyResult.person.lastName }}</div>
                      <div class="person-doc">{{ verifyResult.person.documentType }} {{ verifyResult.person.documentNumber }}</div>
                      <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
                        <span class="badge" :class="statusBadge(verifyResult.person.status)">
                          {{ {'Activo':'✅','Inactivo':'❌','Registrado':'📋'}[verifyResult.person.status] || '⏳' }}
                          {{ verifyResult.person.status }}
                        </span>
                        <span class="badge" :class="verifyResult.source === 'dygas' ? 'badge-navy' : 'badge-info'">
                          {{ verifyResult.source === 'dygas' ? '✔ CLIENTE DYGAS' : '📋 AGENTE' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="person-card-body">
                    <div class="person-info-grid">
                      <div class="info-item" v-if="verifyResult.person.departmentName">
                        <label>📍 Departamento</label><p>{{ verifyResult.person.departmentName }}</p>
                      </div>
                      <div class="info-item" v-if="verifyResult.person.municipalityName">
                        <label>🏘️ Municipio</label><p>{{ verifyResult.person.municipalityName }}</p>
                      </div>
                      <div class="info-item" v-if="verifyResult.person.email">
                        <label>📧 Email</label><p>{{ verifyResult.person.email }}</p>
                      </div>
                      <div class="info-item" v-if="verifyResult.person.serviceType">
                        <label>🔥 Servicio</label><p>{{ verifyResult.person.serviceType }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ── FORMULARIO ── -->
              <div class="modal-section">
                <div class="section-title" style="margin-bottom:14px">➕ Datos del Registro</div>
                <div class="modal-form-grid">
                  <div class="input-group">
                    <label>Número de Documento *</label>
                    <input type="text" class="input-field" v-model="form.documentNumber" placeholder="Cédula" />
                  </div>
                  <div class="input-group">
                    <label>Nombre de la Persona *</label>
                    <input type="text" class="input-field" v-model="form.personName" placeholder="Nombre completo" />
                  </div>
                  <div class="input-group">
                    <label>Correo Electrónico</label>
                    <input type="email" class="input-field" v-model="form.email" placeholder="correo@ejemplo.com" />
                  </div>
                  <div class="input-group">
                    <label>Tipo de Servicio</label>
                    <select class="input-field" v-model="form.serviceType">
                      <option value="Gas Natural">Gas Natural</option>
                      <option value="Gas Licuado">Gas Licuado</option>
                    </select>
                  </div>
                  <div class="input-group">
                    <label>Nombre del Agente</label>
                    <input type="text" class="input-field" v-model="form.agentName" placeholder="Tu nombre" />
                  </div>
                  <div class="input-group" style="grid-column:1/-1">
                    <label>Observaciones</label>
                    <textarea class="input-field" v-model="form.observations" rows="3" placeholder="Observaciones de la visita..." style="resize:vertical"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
              <div v-if="saved" class="fade-in" style="color:var(--success);font-size:14px;font-weight:600">
                ✅ Registro guardado
              </div>
              <button class="btn btn-outline" @click="closeModal" style="margin-left:auto">Cancelar</button>
              <button class="btn btn-navy" :disabled="!isFormValid || saving" @click="saveRecord" style="min-width:160px;justify-content:center">
                {{ saving ? 'Guardando...' : '💾 Guardar Registro' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useCensusStore } from '../stores/census'
import { useDepartmentsStore } from '../stores/departments'

const censusStore = useCensusStore()
const deptsStore  = useDepartmentsStore()

// ── MAP ──────────────────────────────────────────
let map = null
const mapMarkers   = {}
const mapSelectedId = ref('')

const CENTROIDS = {
  1:[-1.5,-72.0], 2:[7.0,-75.5], 3:[7.1,-71.6], 4:[10.7,-74.9],
  5:[9.0,-74.8],  6:[6.0,-72.3], 7:[5.3,-75.3],  8:[1.0,-74.0],
  9:[5.5,-72.0], 10:[2.5,-76.5],11:[9.3,-73.5], 12:[5.5,-77.0],
 13:[8.3,-75.7], 14:[4.5,-74.2],15:[2.5,-68.5], 16:[2.0,-72.5],
 17:[2.5,-75.5], 18:[11.5,-72.5],19:[10.4,-74.0],20:[3.5,-73.5],
 21:[1.3,-77.5], 22:[8.0,-72.8],23:[0.5,-76.0], 24:[4.5,-75.7],
 25:[5.3,-75.8], 26:[12.5,-81.7],27:[7.0,-73.2],28:[9.0,-75.1],
 29:[4.0,-75.3], 30:[3.8,-76.5],31:[0.5,-70.5], 32:[5.0,-69.5],
}

const coveredIds = [2,4,5,14,27,30]
const partialIds  = [6,7,9,11,17,20,22,25]
const getColor = (id) => coveredIds.includes(id) ? '#10b981' : partialIds.includes(id) ? '#f59e0b' : '#3b82f6'

function setMarkerStyle(id, selected) {
  const m = mapMarkers[id]; if (!m) return
  m.setStyle({
    fillColor: selected ? '#f5890a' : getColor(id),
    color: selected ? '#071a3e' : 'white',
    weight: selected ? 3 : 1.5,
    fillOpacity: selected ? 1 : 0.88,
    radius: selected ? 14 : 10,
  })
}

async function mapSelectDept(dept) {
  deptsStore.departments.forEach(d => setMarkerStyle(d.id, false))
  setMarkerStyle(dept.id, true)
  mapSelectedId.value = dept.id
  const c = CENTROIDS[dept.id]
  if (c && map) map.panTo(c)
  await deptsStore.selectDepartment(dept)
}

async function onMapSelectChange() {
  if (!mapSelectedId.value) { clearMapSelection(); return }
  const d = deptsStore.departments.find(d => d.id === Number(mapSelectedId.value))
  if (d) await mapSelectDept(d)
}

function clearMapSelection() {
  mapSelectedId.value = ''
  deptsStore.departments.forEach(d => setMarkerStyle(d.id, false))
  deptsStore.clearSelection()
}

// ── MODAL ────────────────────────────────────────
const showModal = ref(false)
const modalDept = ref('')
const modalMuni = ref('')

function openModal(municipio) {
  modalDept.value = deptsStore.selectedDept?.name || ''
  modalMuni.value = municipio.name
  form.value.departmentName   = modalDept.value
  form.value.municipalityName = modalMuni.value
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  showModal.value = false
  document.body.style.overflow = ''
  clearVerify()
  form.value = emptyForm()
  saved.value = false
}

// ── VERIFY & FORM ────────────────────────────────
const docNumber    = ref('')
const loadingVerify = computed(() => censusStore.verifyLoading)
const verifyResult  = computed(() => censusStore.verifyResult)

const emptyForm = () => ({
  documentNumber:'', personName:'', email:'',
  departmentName:'', municipalityName:'',
  serviceType:'Gas Natural', agentName:'', observations:''
})

const form = ref(emptyForm())
const saving = ref(false)
const saved  = ref(false)

const isFormValid = computed(() => form.value.documentNumber && form.value.personName && form.value.departmentName)

async function runVerify() {
  if (!docNumber.value.trim()) return
  await censusStore.verify(docNumber.value.trim())
  if (verifyResult.value?.found) {
    const p = verifyResult.value.person
    form.value.documentNumber   = p.documentNumber
    form.value.personName       = `${p.firstName} ${p.lastName}`.trim()
    form.value.email            = p.email || ''
    form.value.departmentName   = p.departmentName || modalDept.value
    form.value.municipalityName = p.municipalityName || modalMuni.value
    form.value.serviceType      = p.serviceType || 'Gas Natural'
  }
}

function clearVerify() {
  docNumber.value = ''
  censusStore.clearVerify()
}

async function saveRecord() {
  saving.value = true; saved.value = false
  try {
    await censusStore.createRecord({ ...form.value })
    saved.value = true
    form.value = { ...emptyForm(), departmentName: modalDept.value, municipalityName: modalMuni.value }
    clearVerify()
    setTimeout(() => { closeModal() }, 1800)
  } finally { saving.value = false }
}

const initials = (p) => `${p.firstName?.[0] || '?'}${p.lastName?.[0] || ''}`
const statusBadge = (s) => ({ Activo:'badge-success', Inactivo:'badge-danger', Pendiente:'badge-warning' }[s] || 'badge-info')

// ── MOUNT ─────────────────────────────────────────
onMounted(async () => {
  await deptsStore.fetchDepartments()

  map = L.map('censo-mapa', { center:[4.5,-73.5], zoom:5, scrollWheelZoom:false })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom:18,
  }).addTo(map)

  deptsStore.departments.forEach(dept => {
    const c = CENTROIDS[dept.id]; if (!c) return
    const marker = L.circleMarker(c, { radius:10, fillColor:getColor(dept.id), color:'white', weight:1.5, opacity:1, fillOpacity:0.88 })
    marker.bindTooltip(`<b>${dept.name}</b><br><small>${dept.municipalityCount} municipios</small>`, { permanent:false, direction:'top', className:'dept-tooltip' })
    marker.on('click', () => mapSelectDept(dept))
    marker.on('mouseover', function() { if(mapSelectedId.value !== dept.id) this.setStyle({ radius:12, fillOpacity:1 }) })
    marker.on('mouseout',  function() { if(mapSelectedId.value !== dept.id) this.setStyle({ radius:10, fillOpacity:0.88 }) })
    marker.addTo(map)
    mapMarkers[dept.id] = marker
  })
})

onBeforeUnmount(() => {
  if (map) { map.remove(); map = null }
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ─── Map layout ─── */
.map-header {
  background: linear-gradient(135deg, var(--navy-dark, #071a3e), var(--navy, #0d2b5e));
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.map-header-title { color: white; font-weight: 700; font-size: 15px; }
.map-header-sub   { color: rgba(255,255,255,0.6); font-size: 12px; }

.map-select {
  background: rgba(255,255,255,0.12);
  color: white;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
}
.map-select option { color: #0d2b5e; background: white; }
.map-clear-btn {
  background: rgba(255,255,255,0.15);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
}

.map-body {
  display: grid;
  grid-template-columns: 1fr 280px;
}

.mapa-container { height: 420px; }

/* ─── Municipality panel ─── */
.muni-panel {
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  background: var(--card);
}
.muni-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 13px;
  padding: 24px;
  text-align: center;
}
.muni-dept-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  flex-shrink: 0;
}
.muni-list {
  overflow-y: auto;
  flex: 1;
  padding: 8px;
  max-height: 374px;
}
.muni-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  background: none;
  border: none;
  text-align: left;
  color: var(--text);
  transition: background 0.15s, transform 0.1s;
  font-family: inherit;
}
.muni-btn:hover {
  background: rgba(245, 137, 10, 0.1);
  transform: translateX(2px);
}
.muni-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--orange, #f5890a);
  flex-shrink: 0;
  display: inline-block;
}
.muni-census-label {
  margin-left: auto;
  font-size: 11px;
  color: var(--orange, #f5890a);
  font-weight: 600;
}

/* ─── Modal ─── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-box {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 100%;
  max-width: 780px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 80px rgba(0,0,0,0.4);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.modal-title    { font-size: 18px; font-weight: 700; color: var(--text); }
.modal-subtitle { display: flex; gap: 8px; margin-top: 6px; flex-wrap: wrap; }
.modal-badge {
  font-size: 12px;
  font-weight: 600;
  background: rgba(249, 115, 22, 0.12);
  color: #f97316;
  border-radius: 6px;
  padding: 3px 10px;
}

.modal-close {
  background: none;
  border: 2px solid var(--border);
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-muted);
  transition: all 0.2s;
  flex-shrink: 0;
}
.modal-close:hover { border-color: #ef4444; color: #ef4444; }

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal-section {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
}

.modal-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.modal-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
  flex-wrap: wrap;
}

/* ─── Transitions ─── */
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .map-body { grid-template-columns: 1fr; }
  .mapa-container { height: 260px; }
  .muni-panel { border-left: none; border-top: 1px solid var(--border); }
  .muni-list { max-height: 240px; }
  .modal-form-grid { grid-template-columns: 1fr; }
}
</style>

<style>
/* global — tooltip del mapa */
.dept-tooltip {
  background: #0d2b5e !important;
  color: white !important;
  border: none !important;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}
.dept-tooltip::before { border-top-color: #0d2b5e !important; }
</style>
