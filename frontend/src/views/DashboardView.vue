<template>
  <div class="fade-in">
    <div class="page-header">
      <h2>📊 Dashboard General</h2>
      <p>Resumen del estado del censo DYGAS a nivel nacional</p>
    </div>

    <!-- STATS CARDS -->
    <div class="stats-grid" v-if="stats">
      <div class="stat-card">
        <div class="stat-icon orange">👥</div>
        <div class="stat-value">{{ stats.totalPersons }}</div>
        <div class="stat-label">Total Usuarios</div>
      </div>
      <div class="stat-card success">
        <div class="stat-icon success">✅</div>
        <div class="stat-value" style="color:#10b981">{{ stats.activePersons }}</div>
        <div class="stat-label">Usuarios Activos</div>
      </div>
      <div class="stat-card navy">
        <div class="stat-icon navy">🏘️</div>
        <div class="stat-value">{{ stats.departmentsCovered }}</div>
        <div class="stat-label">Departamentos</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-icon warning">⏳</div>
        <div class="stat-value" style="color:#f59e0b">{{ stats.pendingPersons }}</div>
        <div class="stat-label">Pendientes</div>
      </div>
    </div>

    <div class="stats-grid" v-else>
      <div class="stat-card" v-for="i in 4" :key="i" style="min-height:120px;display:flex;align-items:center;justify-content:center;">
        <div class="spinner"></div>
      </div>
    </div>

    <div class="two-col">
      <!-- Service breakdown -->
      <div class="card" v-if="stats">
        <div class="section-title">🔥 Distribución por Servicio</div>
        <div style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:14px;font-weight:600">Gas Natural</span>
            <span style="font-size:14px;color:var(--text-muted)">{{ stats.gasNatural }} usuarios</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: pct(stats.gasNatural, stats.totalPersons) }"></div>
          </div>
        </div>
        <div style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:14px;font-weight:600">Gas Licuado</span>
            <span style="font-size:14px;color:var(--text-muted)">{{ stats.gasLicuado }} usuarios</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill warning" :style="{ width: pct(stats.gasLicuado, stats.totalPersons) }"></div>
          </div>
        </div>
        <div class="divider"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;text-align:center">
          <div style="background:var(--bg);border-radius:8px;padding:14px">
            <div style="font-size:22px;font-weight:800;color:var(--orange)">{{ stats.totalCensus }}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Censos Registrados</div>
          </div>
          <div style="background:var(--bg);border-radius:8px;padding:14px">
            <div style="font-size:22px;font-weight:800;color:var(--danger)">{{ stats.inactivePersons }}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Usuarios Inactivos</div>
          </div>
        </div>
      </div>

      <!-- Last records -->
      <div class="card">
        <div class="section-title">📋 Últimos Registros</div>
        <div v-if="recordsLoading" style="text-align:center;padding:20px"><div class="spinner"></div></div>
        <div v-else class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Persona</th>
                <th>Departamento</th>
                <th>Servicio</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in lastRecords" :key="r.id">
                <td>
                  <div style="font-weight:600;font-size:13px">{{ r.personName }}</div>
                  <div style="font-size:11px;color:var(--text-muted)">CC {{ r.documentNumber }}</div>
                </td>
                <td><span style="font-size:13px">{{ r.departmentName }}</span></td>
                <td>
                  <span class="badge" :class="r.serviceType === 'Gas Natural' ? 'badge-navy' : 'badge-warning'">
                    {{ r.serviceType }}
                  </span>
                </td>
                <td style="font-size:12px;color:var(--text-muted)">{{ formatDate(r.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="margin-top:14px;text-align:right">
          <router-link to="/registros" class="btn btn-outline" style="font-size:13px;padding:8px 16px">
            Ver todos →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Mission banner -->
    <div class="card" style="margin-top:20px;background:linear-gradient(135deg,var(--navy-dark),var(--navy));color:white;border:none">
      <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
        <div style="font-size:48px">🔥</div>
        <div>
          <div style="font-size:17px;font-weight:700;margin-bottom:6px">Misión DYGAS</div>
          <p style="font-size:13px;opacity:0.8;max-width:600px;line-height:1.6">
            Empresa de servicios públicos que contribuye a mejorar la calidad de vida de las comunidades
            mediante la distribución y comercialización de gas combustible y energías alternativas,
            llevando progreso y desarrollo sostenible a zonas olvidadas del país.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useCensusStore } from '../stores/census'

const censusStore = useCensusStore()
const stats = computed(() => censusStore.stats)
const recordsLoading = computed(() => censusStore.recordsLoading)
const lastRecords = computed(() => censusStore.records.slice(0, 5))

onMounted(async () => {
  await Promise.all([censusStore.fetchStats(), censusStore.fetchRecords()])
})

const pct = (v, t) => t ? `${Math.round((v / t) * 100)}%` : '0%'

const formatDate = (iso) => {
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
