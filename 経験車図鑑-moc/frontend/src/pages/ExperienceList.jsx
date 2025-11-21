import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ExperienceList() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/experience');
      if (!response.ok) {
        throw new Error('経験データの取得に失敗しました');
      }
      const data = await response.json();
      setExperiences(data.experiences);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getExperienceTypeLabel = (type) => {
    const labels = {
      'saw': '見た',
      'rode': '乗った',
      'drove': '運転した',
      'owned': '所持した'
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>エラー: {error}</p>
        <button onClick={() => navigate('/score')} style={{ marginTop: '20px' }}>
          スコア画面に戻る
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>経験車図鑑</h1>
        <button 
          onClick={() => navigate('/score')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          スコア画面へ
        </button>
      </div>

      {experiences.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ marginBottom: '20px' }}>まだ経験が登録されていません</p>
          <button 
            onClick={() => navigate('/makers')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            経験を登録する
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#666' }}>登録済み: {experiences.length}件</p>
            <button 
              onClick={() => navigate('/makers')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              + 新規登録
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {experiences.map((exp) => (
              <div
                key={exp.id}
                onClick={() => navigate(`/experience-detail/${exp.id}`)}
                style={{
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                      {exp.maker_name} {exp.model_name}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>
                      {exp.segment}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {getExperienceTypeLabel(exp.experience_type)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                    <span>レアリティ: ★{exp.rarity}</span>
                    <span>ポイント: {exp.points}pt</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {formatDate(exp.created_at)}
                  </span>
                </div>

                {exp.note && (
                  <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                    <p style={{ fontSize: '14px', color: '#4b5563' }}>{exp.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExperienceList;
