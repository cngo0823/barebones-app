<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import type { ColDef } from 'ag-grid-community'

const API_BASE_URL = 'http://localhost:8000'

interface DataItem {
  id: number
  name: string
  description: string
}

const rowData = ref<DataItem[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const apiStatus = ref<string>('checking...')

// AG Grid column definitions
const columnDefs = ref<ColDef[]>([
  { 
    field: 'olympus_id', 
    headerName: 'ID',
    width: 100,
    sortable: true,
    filter: true
  },
  { 
    field: 'cusip', 
    headerName: 'CUSIP',
    flex: 1,
    sortable: true,
    filter: true
  }
])

// Default grid options
const defaultColDef = ref<ColDef>({
  resizable: true,
  sortable: true,
  filter: true
})

const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health`)
    apiStatus.value = `✅ ${response.data.status}`
  } catch (err) {
    apiStatus.value = '❌ API not available'
  }
}

const fetchData = async () => {
  try {
    loading.value = true
    const response = await axios.get(`${API_BASE_URL}/api/data`)
    rowData.value = response.data
    error.value = null
  } catch (err) {
    error.value = 'Failed to fetch data from API'
    console.error('Error fetching data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  checkApiHealth()
  fetchData()
})
</script>

<template>
  <div class="container">
    <header class="header">
      <h1 class="title">🚀 Barebones App</h1>
      <p class="subtitle">A simple Vue.js + FastAPI application</p>
      <div class="status-box">
        API Status: <strong>{{ apiStatus }}</strong>
      </div>
    </header>

    <main>
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Data from API</h2>
          <button @click="fetchData" class="refresh-button">
            🔄 Refresh
          </button>
        </div>

        <div v-if="loading" class="loading">
          Loading...
        </div>

        <div v-if="error" class="error">
          {{ error }}
        </div>

        <div v-if="!loading && !error" class="grid-container">
          <div v-if="rowData.length > 0">
            <AgGridVue
              class="ag-theme-alpine"
              style="height: 500px; width: 100%;"
              :rowData="rowData"
              :columnDefs="columnDefs"
              :defaultColDef="defaultColDef"
              :pagination="true"
              :paginationPageSize="10"
              :domLayout="'normal'"
            />
          </div>
          <div v-else class="no-data">
            No data available
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>Built with Vue.js + Vite + FastAPI</p>
    </footer>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 2.5rem;
}

.subtitle {
  color: #666;
  margin: 0;
  font-size: 1.1rem;
}

.status-box {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 5px;
  font-size: 14px;
}

.section {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-title {
  color: #333;
  margin: 0;
  font-size: 1.5rem;
}

.refresh-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.refresh-button:hover {
  background-color: #0056b3;
}

.loading,
.no-data {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 16px;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.grid-container {
  margin-top: 20px;
}

.ag-theme-alpine {
  --ag-border-radius: 8px;
  --ag-header-background-color: #f8f9fa;
}

.footer {
  text-align: center;
  margin-top: 40px;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

.footer p {
  margin: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .title {
    font-size: 2rem;
  }

  .section-header {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
