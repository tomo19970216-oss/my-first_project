import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Score() {
  const navigate = useNavigate()
  const [scoreData, setScoreData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScore()
  }, [])

  const fetchScore = async () => {
    try {
      const response = await fetch('/api/score')
      const data = await response.json()
      setScoreData(data)
    } catch (error) {
      console.error('Error fetching score:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container">読み込み中...</div>
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center' }}>経験車図鑑</h1>
      
      <div className="score-display">
        {scoreData?.score || 0} PT
      </div>

      <div className="stats">
        <div className="stat-item">
          <div className="stat-label">経験車数</div>
          <div className="stat-value">{scoreData?.total_cars || 0}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">見た台数</div>
          <div className="stat-value">{scoreData?.saw_count || 0}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">乗った台数</div>
          <div className="stat-value">{scoreData?.rode_count || 0}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">運転した台数</div>
          <div className="stat-value">{scoreData?.drove_count || 0}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">所持した台数</div>
          <div className="stat-value">{scoreData?.owned_count || 0}</div>
        </div>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <button 
          className="btn btn-primary" 
          style={{ fontSize: '18px', padding: '14px 28px', width: '280px' }}
          onClick={() => navigate('/experiences')}
        >
          経験車図鑑を見る
        </button>
        <button 
          className="btn btn-primary" 
          style={{ fontSize: '18px', padding: '14px 28px', width: '280px' }}
          onClick={() => navigate('/makers')}
        >
          経験を登録する
        </button>
      </div>
    </div>
  )
}

export default Score
