import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ExperienceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    experience_type: '',
    note: ''
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchExperience();
  }, [id]);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/experience/${id}`);
      if (!response.ok) {
        throw new Error('経験データの取得に失敗しました');
      }
      const data = await response.json();
      setExperience(data.experience);
      setEditData({
        experience_type: data.experience.experience_type,
        note: data.experience.note || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditData({
      experience_type: experience.experience_type,
      note: experience.note || ''
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/experience/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        throw new Error('更新に失敗しました');
      }

      await fetchExperience();
      setIsEditMode(false);
      alert('更新しました');
    } catch (err) {
      alert(`エラー: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('この経験を削除してもよろしいですか？')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`/api/experience/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      alert('削除しました');
      navigate('/experiences');
    } catch (err) {
      alert(`エラー: ${err.message}`);
    } finally {
      setDeleting(false);
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

  const getExperienceTypePoints = (type) => {
    const points = {
      'saw': 1,
      'rode': 2,
      'drove': 5,
      'owned': 10
    };
    return points[type] || 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>エラー: {error || '経験が見つかりません'}</p>
        <button 
          onClick={() => navigate('/experiences')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          一覧に戻る
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/experiences')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← 一覧に戻る
        </button>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
            {experience.maker_name} {experience.model_name}
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>
            {experience.segment}
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '16px',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px'
        }}>
          <div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>レアリティ</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>★ {experience.rarity}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>獲得ポイント</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>{experience.points} pt</p>
          </div>
        </div>

        {!isEditMode ? (
          <>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>経験種別</p>
              <div style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {getExperienceTypeLabel(experience.experience_type)} ({getExperienceTypePoints(experience.experience_type)}pt × {experience.rarity})
              </div>
            </div>

            {experience.note && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>メモ</p>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '4px',
                  border: '1px solid #e5e7eb'
                }}>
                  <p style={{ fontSize: '16px', color: '#374151', whiteSpace: 'pre-wrap' }}>
                    {experience.note}
                  </p>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>登録日時</p>
              <p style={{ fontSize: '16px' }}>{formatDate(experience.created_at)}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleEdit}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                編集
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: deleting ? '#9ca3af' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {deleting ? '削除中...' : '削除'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                経験種別 <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                value={editData.experience_type}
                onChange={(e) => setEditData({ ...editData, experience_type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px'
                }}
              >
                <option value="saw">見た (1pt)</option>
                <option value="rode">乗った (2pt)</option>
                <option value="drove">運転した (5pt)</option>
                <option value="owned">所持した (10pt)</option>
              </select>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                新しいポイント: {getExperienceTypePoints(editData.experience_type)} × {experience.rarity} = {getExperienceTypePoints(editData.experience_type) * experience.rarity}pt
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                メモ（任意）
              </label>
              <textarea
                value={editData.note}
                onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                placeholder="この車についてのメモを入力してください"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: saving ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {saving ? '保存中...' : '保存'}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                キャンセル
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ExperienceDetail;
