'use client';

import React, { useState, useEffect } from 'react';

export default function Page() {
  const [stats, setStats] = useState({
    activeOrders: 0,
    onlineCouriers: 0,
    todayRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    averageRating: 0,
  });

  useEffect(() => {
    // TODO: Fetch real stats from API
    // For now, using mock data
    setStats({
      activeOrders: 12,
      onlineCouriers: 8,
      todayRevenue: 3420,
      totalOrders: 543,
      completedOrders: 498,
      averageRating: 4.8,
    });
  }, []);

  return (
    <main style={{ background: '#0A0A0A', minHeight: '100vh', color: '#F3F3F3', padding: 32 }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#D4AF37' }}>мусора.нет Admin</h1>
        <p className="text-gray-400 mb-8">Dashboard для управления сервисом вывоза мусора</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface rounded-lg p-6 border border-card">
            <h3 className="text-lg font-semibold mb-2">Активные заказы</h3>
            <p className="text-3xl font-bold" style={{ color: '#D4AF37' }}>{stats.activeOrders}</p>
            <p className="text-sm text-gray-400 mt-2">Ожидают курьера или в процессе</p>
          </div>
          <div className="bg-surface rounded-lg p-6 border border-card">
            <h3 className="text-lg font-semibold mb-2">Онлайн курьеры</h3>
            <p className="text-3xl font-bold" style={{ color: '#D4AF37' }}>{stats.onlineCouriers}</p>
            <p className="text-sm text-gray-400 mt-2">Сейчас на линии</p>
          </div>
          <div className="bg-surface rounded-lg p-6 border border-card">
            <h3 className="text-lg font-semibold mb-2">Доход за сегодня</h3>
            <p className="text-3xl font-bold" style={{ color: '#D4AF37' }}>{stats.todayRevenue} ₴</p>
            <p className="text-sm text-green-400 mt-2">↑ +12% вчера</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface rounded-lg p-6 border border-card">
            <h3 className="text-lg font-semibold mb-2">Всего заказов</h3>
            <p className="text-3xl font-bold" style={{ color: '#D4AF37' }}>{stats.totalOrders}</p>
            <p className="text-sm text-gray-400 mt-2">За все время</p>
          </div>
          <div className="bg-surface rounded-lg p-6 border border-card">
            <h3 className="text-lg font-semibold mb-2">Выполнено</h3>
            <p className="text-3xl font-bold" style={{ color: '#D4AF37' }}>{stats.completedOrders}</p>
            <p className="text-sm text-green-400 mt-2">92% success rate</p>
          </div>
          <div className="bg-surface rounded-lg p-6 border border-card">
            <h3 className="text-lg font-semibold mb-2">Средний рейтинг</h3>
            <p className="text-3xl font-bold" style={{ color: '#D4AF37' }}>⭐ {stats.averageRating}</p>
            <p className="text-sm text-gray-400 mt-2">От клиентов</p>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6 border border-card">
          <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/orders" className="bg-card hover:bg-primary/20 transition rounded-lg p-4 text-center border border-primary/20 hover:border-primary">
              <p className="text-sm font-medium">Заказы</p>
            </a>
            <a href="/couriers" className="bg-card hover:bg-primary/20 transition rounded-lg p-4 text-center border border-primary/20 hover:border-primary">
              <p className="text-sm font-medium">Курьеры</p>
            </a>
            <a href="/users" className="bg-card hover:bg-primary/20 transition rounded-lg p-4 text-center border border-primary/20 hover:border-primary">
              <p className="text-sm font-medium">Пользователи</p>
            </a>
            <a href="/zones" className="bg-card hover:bg-primary/20 transition rounded-lg p-4 text-center border border-primary/20 hover:border-primary">
              <p className="text-sm font-medium">Зоны</p>
            </a>
            <a href="/tariffs" className="bg-card hover:bg-primary/20 transition rounded-lg p-4 text-center border border-primary/20 hover:border-primary">
              <p className="text-sm font-medium">Тарифы</p>
            </a>
            <a href="/promos" className="bg-card hover:bg-primary/20 transition rounded-lg p-4 text-center border border-primary/20 hover:border-primary">
              <p className="text-sm font-medium">Промокоды</p>
            </a>
            <a href="/support" className="bg-card hover:bg-primary/20 transition rounded-lg p-4 text-center border border-primary/20 hover:border-primary">
              <p className="text-sm font-medium">Поддержка</p>
            </a>
            <a href="/analytics" className="bg-card hover:bg-primary/20 transition rounded-lg p-4 text-center border border-primary/20 hover:border-primary">
              <p className="text-sm font-medium">Аналитика</p>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}


