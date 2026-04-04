<template>
  <div class="login-page">
    <!-- Background blobs -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>

    <div class="login-card">
      <!-- Logo -->
      <div class="login-logo">
        <div class="logo-fire">🔥</div>
        <div class="logo-info">
          <h1>DYGAS</h1>
          <p>Sistema de Censo</p>
        </div>
      </div>

      <div class="login-divider"></div>

      <h2 class="login-title">Iniciar Sesión</h2>
      <p class="login-subtitle">Ingresa tus credenciales para acceder al sistema</p>

      <!-- Error alert -->
      <div v-if="errorMsg" class="login-error">
        <span>⚠️</span> {{ errorMsg }}
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <div class="input-wrapper">
            <span class="input-icon">✉️</span>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="correo@empresa.com"
              autocomplete="email"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input
              id="password"
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              required
            />
            <button type="button" class="toggle-pass" @click="showPass = !showPass">
              {{ showPass ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <button type="submit" class="login-btn" :class="{ loading: loading }" :disabled="loading">
          <span v-if="!loading">Entrar al Sistema</span>
          <span v-else class="spinner"></span>
        </button>
      </form>

      <p class="login-footer">DYGAS © 2025 — Empresa de Gas Combustible y Energías Alternativas</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const showPass = ref(false)

async function handleLogin() {
  errorMsg.value = ''
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (err) {
    const msg = err?.response?.data?.message
    errorMsg.value = Array.isArray(msg) ? msg.join(', ') : (msg || 'Error al iniciar sesión. Verifica tus credenciales.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  position: relative;
  overflow: hidden;
  padding: 16px;
}

/* Animated blobs */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.18;
  animation: blobFloat 8s ease-in-out infinite;
}
.blob-1 {
  width: 400px; height: 400px;
  background: #f97316;
  top: -100px; left: -100px;
  animation-delay: 0s;
}
.blob-2 {
  width: 350px; height: 350px;
  background: #ea580c;
  bottom: -80px; right: -80px;
  animation-delay: 3s;
}
.blob-3 {
  width: 250px; height: 250px;
  background: #fb923c;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 6s;
}
@keyframes blobFloat {
  0%, 100% { transform: scale(1) translate(0, 0); }
  33% { transform: scale(1.05) translate(10px, -10px); }
  66% { transform: scale(0.95) translate(-10px, 10px); }
}

.login-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 40px 36px;
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 1;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  backdrop-filter: blur(10px);
}

.login-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}
.logo-fire {
  font-size: 42px;
  line-height: 1;
  filter: drop-shadow(0 0 8px #f97316);
}
.logo-info h1 {
  font-size: 24px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: 1px;
  margin: 0;
}
.logo-info p {
  font-size: 12px;
  color: var(--text-muted);
  margin: 2px 0 0;
}

.login-divider {
  height: 1px;
  background: var(--border);
  margin-bottom: 24px;
}

.login-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 6px;
}
.login-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 24px;
}

.login-error {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: #ef4444;
  font-size: 13px;
  padding: 10px 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.3px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 14px;
  font-size: 15px;
  pointer-events: none;
  z-index: 1;
}
.input-wrapper input {
  width: 100%;
  padding: 12px 14px 12px 40px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}
.input-wrapper input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
}
.input-wrapper input::placeholder { color: var(--text-muted); opacity: 0.5; }

.toggle-pass {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  line-height: 1;
}

.login-btn {
  margin-top: 6px;
  padding: 14px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
}
.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 22px rgba(249, 115, 22, 0.5);
}
.login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.spinner {
  width: 20px; height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

.login-footer {
  font-size: 11px;
  color: var(--text-muted);
  text-align: center;
  margin: 24px 0 0;
  opacity: 0.6;
}
</style>
