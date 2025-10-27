const http = require('http');

const PORT = process.env.API_PORT || 4000;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Simple routing
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Test server is running' }));
    return;
  }

  // Auth endpoints
  if (req.url === '/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        user: { id: 'user_' + Date.now(), email: data.email, name: data.name || 'User' },
        token: 'test_token_' + Date.now()
      }));
    });
    return;
  }

  if (req.url === '/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        user: { id: 'user_123', email: data.email, name: 'Test User' },
        token: 'test_token_' + Date.now()
      }));
    });
    return;
  }

  // Orders endpoints
  if (req.url === '/orders' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([
      { id: '1', status: 'PENDING', price: 200, createdAt: new Date().toISOString() },
      { id: '2', status: 'ASSIGNED', price: 300, createdAt: new Date().toISOString() }
    ]));
    return;
  }

  if (req.url === '/orders' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        id: 'order_' + Date.now(),
        ...data,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }));
    });
    return;
  }

  if (req.url.startsWith('/orders/') && req.method === 'GET') {
    const id = req.url.split('/orders/')[1];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      id, 
      status: 'PENDING', 
      price: 200,
      createdAt: new Date().toISOString()
    }));
    return;
  }

  if (req.url === '/api/test' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        received: true, 
        data: JSON.parse(body || '{}'),
        timestamp: new Date().toISOString()
      }));
    });
    return;
  }

  // Default response
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    message: 'Test server running',
    endpoints: ['/api/health', '/api/test'],
    port: PORT
  }));
});

server.listen(PORT, () => {
  console.log(`🚀 Android Test Server running on http://localhost:${PORT}`);
  console.log(`📡 Available endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/test`);
  console.log(`   POST /auth/register`);
  console.log(`   POST /auth/login`);
  console.log(`   GET  /orders`);
  console.log(`   POST /orders`);
  console.log(`   GET  /orders/:id`);
});
