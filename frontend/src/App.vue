<template>
  <!-- UNAUTHENTICATED: solo login -->
  <router-view v-if="!authStore.isAuthenticated" />

  <!-- AUTHENTICATED: layout completo -->
  <div v-else class="app-layout">
    <!-- Overlay mobile -->
    <div
      class="sidebar-overlay"
      :class="{ active: sidebarOpen }"
      @click="sidebarOpen = false"
      v-if="sidebarOpen"
    ></div>

    <!-- SIDEBAR -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-logo">
        <div class="logo-badge">
          <div class="logo-icon">🔥</div>
          <div class="logo-text">
            <h1>DYGAS</h1>
            <p>Sistema de Censo</p>
          </div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <span class="nav-label">Principal</span>
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="{ active: $route.path === item.to }"
          @click="sidebarOpen = false"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          {{ item.label }}
        </router-link>
      </nav>

      <!-- User info in sidebar -->
      <div class="sidebar-user">
        <div class="sidebar-user-avatar">{{ userInitials }}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">{{ authStore.user?.name }}</div>
          <div class="sidebar-user-role">{{ authStore.user?.role }}</div>
        </div>
      </div>

      <div class="sidebar-footer">
        DYGAS © 2025 — v1.0.0
      </div>
    </aside>

    <!-- MAIN -->
    <div class="main-wrapper">
      <!-- HEADER -->
      <header class="header">
        <div class="header-left">
          <button class="burger-btn" @click="sidebarOpen = !sidebarOpen">☰</button>
          <div>
            <div class="header-title">{{ routeTitle }}</div>
            <div class="header-subtitle">Empresa de Gas Combustible y Energías Alternativas</div>
          </div>
        </div>
        <div class="header-right">
          <button
            @click="toggleDark"
            :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
            style="background:none;border:2px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:16px;color:var(--text-muted);transition:all 0.2s;display:flex;align-items:center;gap:6px"
          >
            {{ isDark ? '☀️' : '🌙' }}
            <span style="font-size:12px;font-weight:600">{{ isDark ? 'Claro' : 'Oscuro' }}</span>
          </button>
          <div class="header-badge">
            <span class="header-dot"></span>
            Sistema Activo
          </div>
          <button class="logout-btn" @click="handleLogout" title="Cerrar sesión">
            <span>🚪</span>
            <span class="logout-label">Salir</span>
          </button>
        </div>
      </header>

      <!-- ROUTER VIEW -->
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Dark mode
const isDark = ref(false)
function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('dygas-dark', isDark.value ? '1' : '0')
}
onMounted(() => {
  if (localStorage.getItem('dygas-dark') === '1') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
  authStore.initAuth()
})

const sidebarOpen = ref(false)

const navItems = [
  { to: '/', icon: '📊', label: 'Dashboard' },
  { to: '/censo', icon: '📋', label: 'Censo' },
  { to: '/registros', icon: '📁', label: 'Registros' },
]

const routeTitle = computed(() => {
  const map = { '/': 'Dashboard', '/censo': 'Censo', '/registros': 'Registros' }
  return map[route.path] || 'DYGAS'
})

const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 2px solid var(--border);
  border-radius: 8px;
  padding: 7px 12px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-muted);
  transition: all 0.2s;
  font-family: inherit;
}
.logout-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.06);
}
.logout-label { font-size: 12px; font-weight: 600; }

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: auto 0 0;
  padding: 16px;
  border-top: 1px solid var(--border);
}
.sidebar-user-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}
.sidebar-user-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sidebar-user-role {
  font-size: 10px;
  font-weight: 700;
  color: #f97316;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
</style>
