import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Models() {
  const navigate = useNavigate()
  const { makerId } = useParams()
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModels()
  }, [makerId])

  const fetchModels = async () => {
    try {
      const response = await fetch(`/api/models?maker_id=${makerId}`)
      const data = await response.json()
      setModels(data.models || [])
    } catch (error) {
      console.error('Error fetching models:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container">読み込み中...</div>
  }

  return (
    <div className="container">
      <h1>車種選択</h1>
      <div className="card">
        {models.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            このメーカーの車種データはまだ登録されていません
          </div>
        ) : (
          models.map((model) => (
            <div 
              key={model.car_id} 
              className="list-item"
              onClick={() => navigate(`/experience/${model.car_id}`)}
            >
              <div>
                <strong>{model.model_name}</strong>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                  {model.segment} | レアリティ: {model.rarity}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate('/makers')}
        style={{ marginTop: '20px' }}
      >
        戻る
      </button>
    </div>
  )
}

export default Models
