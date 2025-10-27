API quick tests

Start server: `pnpm --filter @museum/server start:dev`

Register:

```bash
curl -X POST http://localhost:4000/auth/register -H 'Content-Type: application/json' -d '{"email":"test@example.com","password":"pass"}'
```

Create order:

```bash
curl -X POST http://localhost:4000/orders -H 'Content-Type: application/json' -d '{"userId":"<id>","addressId":"<addr>","type":"STANDARD","floor":3,"lat":50.45,"lng":30.52,"price":200}'
```

Create payment link:

```bash
curl -X POST http://localhost:4000/payments/create -H 'Content-Type: application/json' -d '{"orderId":"<id>","amount":200}'
```

Simulate webhook:

```bash
curl -X POST http://localhost:4000/payments/webhook -H 'Content-Type: application/json' -d '{"orderId":"<id>","status":"CONFIRMED","amount":200}'
```


