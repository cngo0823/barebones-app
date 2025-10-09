import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [apiStatus, setApiStatus] = useState('checking...')

  useEffect(() => {
    checkApiHealth()
    fetchData()
  }, [])

  const checkApiHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health`)
      setApiStatus(`✅ ${response.data.status}`)
    } catch (err) {
      setApiStatus('❌ API not available')
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/data`)
      setData(response.data.items)
      setError(null)
    } catch (err) {
      setError('Failed to fetch data from API')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          color: '#333',
          marginBottom: '10px'
        }}>
          🚀 Barebones App
        </h1>
        <p style={{
          color: '#666',
          margin: '0'
        }}>
          A simple React + FastAPI application
        </p>
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          API Status: <strong>{apiStatus}</strong>
        </div>
      </header>

      <main>
        <section style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#333', margin: '0' }}>Data from API</h2>
            <button 
              onClick={fetchData}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔄 Refresh
            </button>
          </div>

          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: '#666'
            }}>
              Loading...
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '15px',
              borderRadius: '5px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          {!loading && !error && (
            <div>
              {data.length > 0 ? (
                <div style={{ display: 'grid', gap: '15px' }}>
                  {data.map(item => (
                    <div key={item.id} style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '15px',
                      backgroundColor: '#fafafa'
                    }}>
                      <h3 style={{
                        margin: '0 0 10px 0',
                        color: '#333',
                        fontSize: '18px'
                      }}>
                        {item.name}
                      </h3>
                      <p style={{
                        margin: '0',
                        color: '#666',
                        fontSize: '14px'
                      }}>
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: '#666'
                }}>
                  No data available
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <footer style={{
        textAlign: 'center',
        marginTop: '40px',
        padding: '20px',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>Built with React + Vite + FastAPI</p>
      </footer>
    </div>
  )
}

export default App
