# Museum Delivery — API Test Notes

Use these curl examples to exercise the local API running on `http://localhost:4000`.

1) Register a user

```bash
curl -X POST http://localhost:4000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"pass","name":"Test User"}'
```

Response includes `accessToken` (JWT) in this scaffold.

2) Login (obtain token)

```bash
curl -X POST http://localhost:4000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com"}'
```

Copy `accessToken` value to use in Authorization header: `-H "Authorization: Bearer <token>"`.

3) Create an order

```bash
curl -X POST http://localhost:4000/orders \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{"userId":"<userId>","addressId":"<addressId>","type":"STANDARD","floor":3,"lat":50.45,"lng":30.52,"price":200}'
```

4) List nearby orders

```bash
curl "http://localhost:4000/orders/nearby?lat=50.45&lng=30.52"
```

5) Create payment link (mock Monobank Jar)

```bash
curl -X POST http://localhost:4000/payments/create \
  -H 'Content-Type: application/json' \
  -d '{"orderId":"<orderId>","amount":200}'
```

6) Simulate payment webhook (mark order ASSIGNED and create transaction)

```bash
curl -X POST http://localhost:4000/payments/webhook \
  -H 'Content-Type: application/json' \
  -d '{"orderId":"<orderId>","status":"CONFIRMED","amount":200}'
```

7) Update order status (courier actions)

```bash
curl -X POST http://localhost:4000/orders/<orderId>/status \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{"status":"EN_ROUTE"}'
```

Postman: `apps/server/postman_collection.json` contains these requests and can be imported to Postman.


