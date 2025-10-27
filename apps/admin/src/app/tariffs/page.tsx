'use client';

import React, { useState } from 'react';

interface Rate {
  id: string;
  type: 'STANDARD' | 'RECYCLABLE' | 'BULKY';
  basePrice: number;
  perBagPrice: number;
  perFloorPrice: number;
  floorExtraForStairs: number;
  rushHourMultiplier: number;
}

export default function TariffsPage() {
  const [rates, setRates] = useState<Rate[]>([
    {
      id: '1',
      type: 'STANDARD',
      basePrice: 50,
      perBagPrice: 20,
      perFloorPrice: 10,
      floorExtraForStairs: 10,
      rushHourMultiplier: 1.5,
    },
    {
      id: '2',
      type: 'RECYCLABLE',
      basePrice: 75,
      perBagPrice: 25,
      perFloorPrice: 10,
      floorExtraForStairs: 10,
      rushHourMultiplier: 1.5,
    },
    {
      id: '3',
      type: 'BULKY',
      basePrice: 100,
      perBagPrice: 30,
      perFloorPrice: 15,
      floorExtraForStairs: 15,
      rushHourMultiplier: 1.5,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const updateRate = (id: string, field: keyof Rate, value: number) => {
    setRates(rates.map(rate => 
      rate.id === id ? { ...rate, [field]: value } : rate
    ));
  };

  const saveRates = () => {
    // TODO: API call to save rates
    alert('Тарифы сохранены!');
    setEditingId(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: '#D4AF37', fontSize: 28, fontWeight: '700', marginBottom: 8 }}>
          Тарифы
        </h2>
        <p style={{ color: '#B8B8B8' }}>Управление ценами на вывоз мусора</p>
      </div>

      <div style={{ 
        background: '#1A1A1A', 
        borderRadius: 12, 
        padding: 24, 
        marginBottom: 24 
      }}>
        <h3 style={{ color: '#D4AF37', fontSize: 20, marginBottom: 16 }}>
          ℹ️ Как работает расчет цены
        </h3>
        <div style={{ color: '#B8B8B8', lineHeight: '24px' }}>
          <div style={{ marginBottom: 12 }}>
            <strong style={{ color: '#F3F3F3' }}>Базовая цена</strong> - зависит от типа мусора
          </div>
          <div style={{ marginBottom: 12 }}>
            <strong style={{ color: '#F3F3F3' }}>+ Доплата за пакеты</strong> - дополнительные пакеты (2+)
          </div>
          <div style={{ marginBottom: 12 }}>
            <strong style={{ color: '#F3F3F3' }}>+ Доплата за этаж</strong> - если нет лифта
          </div>
          <div style={{ marginBottom: 12 }}>
            <strong style={{ color: '#F3F3F3' }}>× Rush Hour</strong> - коэффициент в часы пик (вечер, выходные)
          </div>
          <div style={{ 
            background: '#2A2A2A', 
            padding: 12, 
            borderRadius: 8, 
            marginTop: 16,
            border: '1px solid #D4AF37' 
          }}>
            <strong style={{ color: '#D4AF37' }}>Пример:</strong> 
            <div style={{ marginTop: 8 }}>
              3 пакета, 5-й этаж, без лифта, STANDARD: 
              <br />
              50₴ + (2×20₴) + (5×10₴) = <strong style={{ color: '#4CAF50' }}>140₴</strong>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 16 
        }}>
          <h3 style={{ color: '#D4AF37', fontSize: 20 }}>Тарифы по типам мусора</h3>
          <button
            onClick={saveRates}
            style={{
              background: '#D4AF37',
              color: '#0A0A0A',
              padding: '10px 20px',
              borderRadius: 8,
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            💾 Сохранить все изменения
          </button>
        </div>

        {rates.map((rate) => (
          <div
            key={rate.id}
            style={{
              background: '#1A1A1A',
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
              border: '1px solid #2A2A2A'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h4 style={{ color: '#F3F3F3', fontSize: 18, fontWeight: '600' }}>
                {rate.type === 'STANDARD' && 'Обычный мусор'}
                {rate.type === 'RECYCLABLE' && 'Перерабатываемый'}
                {rate.type === 'BULKY' && 'Крупногабаритный'}
              </h4>
              <button
                onClick={() => setEditingId(editingId === rate.id ? null : rate.id)}
                style={{
                  background: editingId === rate.id ? '#4CAF50' : 'transparent',
                  color: editingId === rate.id ? '#F3F3F3' : '#D4AF37',
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: `1px solid ${editingId === rate.id ? '#4CAF50' : '#D4AF37'}`,
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {editingId === rate.id ? '✓ Редактирование' : '✏️ Изменить'}
              </button>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16 
            }}>
              <div>
                <label style={{ color: '#B8B8B8', fontSize: 14, marginBottom: 8, display: 'block' }}>
                  Базовая цена (₴)
                </label>
                <input
                  type="number"
                  value={rate.basePrice}
                  onChange={(e) => updateRate(rate.id, 'basePrice', Number(e.target.value))}
                  disabled={editingId !== rate.id}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#0E0E0E',
                    color: '#F3F3F3',
                    border: '1px solid #2A2A2A',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                />
              </div>

              <div>
                <label style={{ color: '#B8B8B8', fontSize: 14, marginBottom: 8, display: 'block' }}>
                  За дополнительный пакет (₴)
                </label>
                <input
                  type="number"
                  value={rate.perBagPrice}
                  onChange={(e) => updateRate(rate.id, 'perBagPrice', Number(e.target.value))}
                  disabled={editingId !== rate.id}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#0E0E0E',
                    color: '#F3F3F3',
                    border: '1px solid #2A2A2A',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                />
              </div>

              <div>
                <label style={{ color: '#B8B8B8', fontSize: 14, marginBottom: 8, display: 'block' }}>
                  За этаж без лифта (₴)
                </label>
                <input
                  type="number"
                  value={rate.perFloorPrice}
                  onChange={(e) => updateRate(rate.id, 'perFloorPrice', Number(e.target.value))}
                  disabled={editingId !== rate.id}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#0E0E0E',
                    color: '#F3F3F3',
                    border: '1px solid #2A2A2A',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                />
              </div>

              <div>
                <label style={{ color: '#B8B8B8', fontSize: 14, marginBottom: 8, display: 'block' }}>
                  Коэффициент Rush Hour
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={rate.rushHourMultiplier}
                  onChange={(e) => updateRate(rate.id, 'rushHourMultiplier', Number(e.target.value))}
                  disabled={editingId !== rate.id}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#0E0E0E',
                    color: '#F3F3F3',
                    border: '1px solid #2A2A2A',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        background: '#1A1A1A', 
        borderRadius: 12, 
        padding: 24 
      }}>
        <h3 style={{ color: '#D4AF37', fontSize: 20, marginBottom: 16 }}>
          🎯 Промо-коды и скидки
        </h3>
        <div style={{ color: '#B8B8B8', marginBottom: 16 }}>
          Настройте специальные предложения для привлечения клиентов
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => alert('Добавить промо-код')}
            style={{
              background: '#2A2A2A',
              color: '#F3F3F3',
              padding: '12px 24px',
              borderRadius: 8,
              border: '1px solid #D4AF37',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ➕ Добавить промо-код
          </button>
          <button
            onClick={() => alert('Добавить акцию')}
            style={{
              background: '#2A2A2A',
              color: '#F3F3F3',
              padding: '12px 24px',
              borderRadius: 8,
              border: '1px solid #D4AF37',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🎁 Создать акцию
          </button>
        </div>
      </div>
    </div>
  );
}

