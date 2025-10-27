'use client';

import React, { useState, useEffect } from 'react';

interface Stats {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  avgOrderPrice: number;
  activeCouriers: number;
  averageRating: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    avgOrderPrice: 0,
    activeCouriers: 0,
    averageRating: 4.8,
  });

  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'all'>('week');
  const [orderTypes, setOrderTypes] = useState([
    { type: 'STANDARD', count: 145, percentage: 48 },
    { type: 'RECYCLABLE', count: 98, percentage: 33 },
    { type: 'BULKY', count: 57, percentage: 19 },
  ]);

  const [hourlyOrders] = useState([
    { hour: '00:00', orders: 2 },
    { hour: '06:00', orders: 8 },
    { hour: '12:00', orders: 45 },
    { hour: '18:00', orders: 120 },
    { hour: '20:00', orders: 95 },
    { hour: '22:00', orders: 28 },
  ]);

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      totalOrders: 543,
      completedOrders: 498,
      cancelledOrders: 45,
      totalRevenue: 45670,
      todayRevenue: 3420,
      avgOrderPrice: 68,
      activeCouriers: 12,
      averageRating: 4.8,
    });
  }, [selectedPeriod]);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: '#D4AF37', fontSize: 28, fontWeight: '700', marginBottom: 8 }}>
          📊 Аналитика
        </h2>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          {(['day', 'week', 'month', 'all'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                background: selectedPeriod === period ? '#D4AF37' : '#1A1A1A',
                color: selectedPeriod === period ? '#0A0A0A' : '#F3F3F3',
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {period === 'day' && 'Сегодня'}
              {period === 'week' && 'Неделя'}
              {period === 'month' && 'Месяц'}
              {period === 'all' && 'Все время'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
        marginBottom: 24 
      }}>
        <div style={{ 
          background: '#1A1A1A', 
          borderRadius: 12, 
          padding: 20,
          border: '1px solid #2A2A2A' 
        }}>
          <div style={{ color: '#B8B8B8', fontSize: 14, marginBottom: 8 }}>Всего заказов</div>
          <div style={{ color: '#D4AF37', fontSize: 32, fontWeight: '700' }}>{stats.totalOrders}</div>
          <div style={{ color: '#4CAF50', fontSize: 12, marginTop: 4 }}>↑ +12% за неделю</div>
        </div>

        <div style={{ 
          background: '#1A1A1A', 
          borderRadius: 12, 
          padding: 20,
          border: '1px solid #2A2A2A' 
        }}>
          <div style={{ color: '#B8B8B8', fontSize: 14, marginBottom: 8 }}>Выполнено</div>
          <div style={{ color: '#D4AF37', fontSize: 32, fontWeight: '700' }}>{stats.completedOrders}</div>
          <div style={{ color: '#4CAF50', fontSize: 12, marginTop: 4 }}>92% success rate</div>
        </div>

        <div style={{ 
          background: '#1A1A1A', 
          borderRadius: 12, 
          padding: 20,
          border: '1px solid #2A2A2A' 
        }}>
          <div style={{ color: '#B8B8B8', fontSize: 14, marginBottom: 8 }}>Доход</div>
          <div style={{ color: '#D4AF37', fontSize: 32, fontWeight: '700' }}>{stats.totalRevenue} ₴</div>
          <div style={{ color: '#4CAF50', fontSize: 12, marginTop: 4 }}>↑ +8% за неделю</div>
        </div>

        <div style={{ 
          background: '#1A1A1A', 
          borderRadius: 12, 
          padding: 20,
          border: '1px solid #2A2A2A' 
        }}>
          <div style={{ color: '#B8B8B8', fontSize: 14, marginBottom: 8 }}>Средняя цена заказа</div>
          <div style={{ color: '#D4AF37', fontSize: 32, fontWeight: '700' }}>{stats.avgOrderPrice} ₴</div>
          <div style={{ color: '#B8B8B8', fontSize: 12, marginTop: 4 }}>За все время</div>
        </div>

        <div style={{ 
          background: '#1A1A1A', 
          borderRadius: 12, 
          padding: 20,
          border: '1px solid #2A2A2A' 
        }}>
          <div style={{ color: '#B8B8B8', fontSize: 14, marginBottom: 8 }}>Активные курьеры</div>
          <div style={{ color: '#D4AF37', fontSize: 32, fontWeight: '700' }}>{stats.activeCouriers}</div>
          <div style={{ color: '#4CAF50', fontSize: 12, marginTop: 4 }}>Сейчас онлайн</div>
        </div>

        <div style={{ 
          background: '#1A1A1A', 
          borderRadius: 12, 
          padding: 20,
          border: '1px solid #2A2A2A' 
        }}>
          <div style={{ color: '#B8B8B8', fontSize: 14, marginBottom: 8 }}>Средний рейтинг</div>
          <div style={{ color: '#D4AF37', fontSize: 32, fontWeight: '700' }}>
            ⭐ {stats.averageRating}
          </div>
          <div style={{ color: '#4CAF50', fontSize: 12, marginTop: 4 }}>От пользователей</div>
        </div>
      </div>

      {/* Order Types Distribution */}
      <div style={{ 
        background: '#1A1A1A', 
        borderRadius: 12, 
        padding: 24,
        marginBottom: 24 
      }}>
        <h3 style={{ color: '#D4AF37', fontSize: 20, marginBottom: 16 }}>📦 Распределение по типам мусора</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          {orderTypes.map((item) => (
            <div key={item.type} style={{ marginBottom: 12 }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: 8 
              }}>
                <span style={{ color: '#F3F3F3', fontWeight: '600' }}>
                  {item.type === 'STANDARD' && 'Обычный мусор'}
                  {item.type === 'RECYCLABLE' && 'Перерабатываемый'}
                  {item.type === 'BULKY' && 'Крупногабаритный'}
                </span>
                <span style={{ color: '#D4AF37', fontWeight: '600' }}>
                  {item.count} заказов ({item.percentage}%)
                </span>
              </div>
              <div style={{ 
                background: '#0E0E0E', 
                borderRadius: 4, 
                height: 8, 
                overflow: 'hidden' 
              }}>
                <div 
                  style={{ 
                    background: '#D4AF37', 
                    height: '100%', 
                    width: `${item.percentage}%`,
                    transition: 'width 0.3s'
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Distribution */}
      <div style={{ 
        background: '#1A1A1A', 
        borderRadius: 12, 
        padding: 24 
      }}>
        <h3 style={{ color: '#D4AF37', fontSize: 20, marginBottom: 16 }}>⏰ Активность по часам</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200 }}>
          {hourlyOrders.map((item, index) => (
            <div key={index} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ 
                background: '#D4AF37',
                height: `${(item.orders / 120) * 180}px`,
                borderRadius: '4px 4px 0 0',
                marginBottom: 8,
                minHeight: 8
              }} />
              <div style={{ color: '#B8B8B8', fontSize: 12, marginBottom: 4 }}>{item.orders}</div>
              <div style={{ color: '#F3F3F3', fontSize: 11 }}>{item.hour}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

