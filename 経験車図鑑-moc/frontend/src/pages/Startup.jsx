import { useNavigate } from 'react-router-dom'

function Startup() {
  const navigate = useNavigate()

  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
      <div style={{ fontSize: '80px', marginBottom: '20px' }}>🚗</div>
      <h1 style={{ fontSize: '32px', marginBottom: '40px' }}>経験車図鑑</h1>
      <button 
        className="btn btn-primary" 
        style={{ marginRight: '10px', fontSize: '20px', padding: '16px 32px' }}
        onClick={() => navigate('/score')}
      >
        はじめる
      </button>
      <button 
        className="btn btn-secondary" 
        style={{ fontSize: '20px', padding: '16px 32px' }}
        onClick={() => alert('遊び方の説明（未実装）')}
      >
        遊び方
      </button>
    </div>
  )
}

export default Startup
