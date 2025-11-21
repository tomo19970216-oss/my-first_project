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

  const getPlayerStatus = (score) => {
    if (score <= 50) return { name: 'ノーマル', color: '#f5f5f5', textColor: '#333' }
    if (score <= 150) return { name: 'ブロンズ', color: '#CD7F32', textColor: '#fff' }
    if (score <= 300) return { name: 'シルバー', color: '#C0C0C0', textColor: '#333' }
    if (score <= 500) return { name: 'ゴールド', color: '#FFD700', textColor: '#333' }
    if (score <= 1000) return { name: 'プラチナ', color: '#E5E4E2', textColor: '#333' }
    return { name: 'ブラック', color: '#1a1a1a', textColor: '#fff' }
  }

  if (loading) {
    return <div className="container">読み込み中...</div>
  }

  const score = scoreData?.score || 0
  const status = getPlayerStatus(score)

  return (
    <div 
      className="container" 
      style={{ 
        backgroundColor: status.color, 
        minHeight: '100vh',
        color: status.textColor,
        transition: 'background-color 0.5s ease'
      }}
    >
      <h1 style={{ textAlign: 'center', paddingTop: '20px' }}>経験車図鑑</h1>
      
      <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
        {status.name}
      </div>

      <div className="score-display" style={{ color: status.textColor }}>
        {score} PT
      </div>

      <div className="stats">
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
          className="btn" 
          style={{ fontSize: '18px', padding: '14px 28px', width: '280px', backgroundColor: '#000', color: '#fff' }}
          onClick={() => navigate('/experiences')}
        >
          経験車図鑑を見る
        </button>
        <button 
          className="btn" 
          style={{ fontSize: '18px', padding: '14px 28px', width: '280px', backgroundColor: '#000', color: '#fff' }}
          onClick={() => navigate('/makers')}
        >
          経験を登録する
        </button>
      </div>
    </div>
  )
}

export default Score
