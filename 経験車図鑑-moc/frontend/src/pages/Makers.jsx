import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Makers() {
  const navigate = useNavigate()
  const [makers, setMakers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMakers()
  }, [])

  const fetchMakers = async () => {
    try {
      const response = await fetch('/api/makers')
      const data = await response.json()
      setMakers(data.makers || [])
    } catch (error) {
      console.error('Error fetching makers:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container">読み込み中...</div>
  }

  return (
    <div className="container">
      <h1>メーカー選択</h1>
      <div className="card">
        {makers.map((maker) => (
          <div 
            key={maker.maker_id} 
            className="list-item"
            onClick={() => navigate(`/models/${maker.maker_id}`)}
          >
            <strong>{maker.maker_name}</strong>
          </div>
        ))}
      </div>
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate('/score')}
        style={{ marginTop: '20px' }}
      >
        戻る
      </button>
    </div>
  )
}

export default Makers
