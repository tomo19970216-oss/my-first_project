import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function ExperienceForm() {
  const navigate = useNavigate()
  const { carId } = useParams()
  const [car, setCar] = useState(null)
  const [experienceType, setExperienceType] = useState('saw')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCarDetails()
  }, [carId])

  const fetchCarDetails = async () => {
    try {
      const response = await fetch('/api/makers')
      const makersData = await response.json()
      
      for (const maker of makersData.makers) {
        const modelsResponse = await fetch(`/api/models?maker_id=${maker.maker_id}`)
        const modelsData = await modelsResponse.json()
        const foundCar = modelsData.models.find(m => m.car_id === parseInt(carId))
        if (foundCar) {
          setCar({ ...foundCar, maker_name: maker.maker_name })
          break
        }
      }
    } catch (error) {
      console.error('Error fetching car details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          car_id: parseInt(carId),
          experience_type: experienceType,
          note: note || undefined,
        }),
      })

      if (response.ok) {
        alert('経験を登録しました！')
        navigate('/score')
      } else {
        alert('登録に失敗しました')
      }
    } catch (error) {
      console.error('Error submitting experience:', error)
      alert('登録に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="container">読み込み中...</div>
  }

  if (!car) {
    return <div className="container">車種が見つかりません</div>
  }

  const experiencePoints = {
    saw: 1,
    rode: 2,
    drove: 5,
    owned: 10
  }

  const calculatedPoints = experiencePoints[experienceType] * car.rarity

  return (
    <div className="container">
      <h1>経験を入力</h1>
      
      <div className="card">
        <h2>{car.maker_name} {car.model_name}</h2>
        <p style={{ color: '#666', marginBottom: '10px' }}>{car.segment}</p>
        <p><strong>レアリティ:</strong> {car.rarity}</p>
        <p style={{ color: '#4CAF50', fontSize: '18px', marginTop: '10px' }}>
          <strong>獲得ポイント: {calculatedPoints} PT</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          経験種別
        </label>
        <select 
          value={experienceType} 
          onChange={(e) => setExperienceType(e.target.value)}
          required
        >
          <option value="saw">見た (1pt × レアリティ)</option>
          <option value="rode">乗った (2pt × レアリティ)</option>
          <option value="drove">運転した (5pt × レアリティ)</option>
          <option value="owned">所持した (10pt × レアリティ)</option>
        </select>

        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          メモ（任意）
        </label>
        <input 
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="メモを入力..."
        />

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={submitting}
          style={{ width: '100%', fontSize: '18px', padding: '14px' }}
        >
          {submitting ? '登録中...' : '登録'}
        </button>
      </form>

      <button 
        className="btn btn-secondary" 
        onClick={() => navigate(-1)}
        style={{ marginTop: '20px', width: '100%' }}
      >
        戻る
      </button>
    </div>
  )
}

export default ExperienceForm
