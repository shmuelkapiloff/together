# ALL API - Request Structure Professional (HE)

מטרה: מסמך מקצועי אחד שמציג גם את סדר ה-flow העסקי וגם את חוזה ה-API המלא, בלי לפספס פרטים.

Scope: Auth, Products, Cart, Orders, Addresses, Payments, Admin, Health, Metrics.

---

## 1) Flow ראשון: מה קורה ובאיזה סדר

### 1.1 הרשמה/התחברות משתמש

| Step | Endpoint | Method | Actor | Middleware קריטי | Output לשלב הבא |
|---|---|---|---|---|---|
| A1 | /api/auth/register | POST | Client | authRateLimiter | token + refreshToken + user |
| A2 | /api/auth/login | POST | Client | authRateLimiter | token + refreshToken + user |
| A3 | /api/auth/verify | GET | Client | authenticate | user context מאומת |
| A4 | /api/auth/profile | GET/PUT | Client | authenticate | user profile מעודכן |
| A5 | /api/auth/refresh | POST | Client | authRateLimiter | access token חדש |
| A6 | /api/auth/logout | POST | Client | authenticate | session/token invalidation |

### 1.2 מסע רכישה מלא (Catalog -> Cart -> Order -> Payment)

| Step | Endpoint | Method | Actor | Middleware קריטי | Output לשלב הבא |
|---|---|---|---|---|---|
| C1 | /api/products | GET | Client | publicReadRateLimiter | רשימת מוצרים |
| C2 | /api/products/:id | GET | Client | publicReadRateLimiter + validateProductId | פרטי מוצר |
| C3 | /api/cart/add | POST | Client | requireAuth + apiRateLimiter | cart מעודכן |
| C4 | /api/cart | GET | Client | requireAuth + apiRateLimiter | cart סופי לתשלום |
| C5 | /api/orders | POST | Client | requireAuth + idempotencyMiddleware('order') | order pending_payment |
| C6 | /api/payments/create-intent | POST | Client | requireAuth + validateRequest(body) | clientSecret/checkoutUrl |
| C7 | /api/payments/webhook | POST | Stripe | webhookRateLimiter + signature verification | אישור/כשל תשלום |
| C8 | /api/payments/:orderId/status | GET | Client | requireAuth + validateRequest(params) | סטטוס תשלום מעודכן |
| C9 | /api/orders/:orderId | GET | Client | requireAuth + validateOrderId | order state final |

### 1.3 תפעול וניהול

| Step | Endpoint | Method | Actor | Middleware קריטי | Output לשלב הבא |
|---|---|---|---|---|---|
| O1 | /api/admin/stats/summary | GET | Admin | requireAdmin + apiRateLimiter | KPI dashboard |
| O2 | /api/admin/products | POST/PUT/DELETE | Admin | requireAdmin + validations + autoLogAction | catalog management |
| O3 | /api/admin/orders/:id/status | PUT | Admin | requireAdmin + validateObjectId + autoLogAction | lifecycle update |
| O4 | /api/health, /health | GET | Ops/Monitoring | none | service health |
| O5 | /api/metrics/* | GET | Internal user | requireAuth | payment/webhook metrics |

---

## 2) Endpoint Contract מלא (מקור אמת)

Legend:
- Auth: None | Bearer | Admin
- Idempotency: Yes/No
- RL: Rate limit layer

### 2.1 AUTH (`/api/auth`)

| Endpoint | Method | Auth | Middleware | Input Contract | Validation | Success | Errors | Idempotency | RL |
|---|---|---|---|---|---|---|---|---|---|
| /register | POST | None | authRateLimiter | body: name,email,password | registerSchema | 201 + user/token/refreshToken | 400,409,429 | No | authRateLimiter |
| /login | POST | None | authRateLimiter | body: email,password | loginSchema | 200 + user/token/refreshToken | 400,401,423,429 | No | authRateLimiter |
| /forgot-password | POST | None | authRateLimiter | body: email | forgotPasswordSchema | 200 + success message | 400,429 | No | authRateLimiter |
| /reset-password/:token | POST | None | authRateLimiter | params: token, body: password,confirmPassword | resetPasswordSchema + token param check | 200 + success message | 400 | No | authRateLimiter |
| /refresh | POST | None | authRateLimiter | body: refreshToken | manual controller check | 200 + new token pair | 400,401,429 | No | authRateLimiter |
| /google | POST | None | authRateLimiter | body: idToken | manual controller check | 200 + user/token/refreshToken | 400,403,429 | No | authRateLimiter |
| /verify | GET | Bearer | authenticate | header: Authorization | authenticate + verifyToken | 200 + user | 401 | No | - |
| /profile | GET | Bearer | authenticate | header: Authorization | authenticate | 200 + user | 401 | No | - |
| /profile | PUT | Bearer | authenticate | header + body: name/email | updateProfileSchema | 200 + user + message | 400,401 | No | - |
| /change-password | POST | Bearer | authenticate | header + body: currentPassword,newPassword,confirmPassword | changePasswordSchema | 200 + message | 400,401 | No | - |
| /logout | POST | Bearer | authenticate | header: Authorization | authenticate | 200 + message | 401 | No | - |

### 2.2 PRODUCTS (`/api/products`)

| Endpoint | Method | Auth | Middleware | Input Contract | Validation | Success | Errors | Idempotency | RL |
|---|---|---|---|---|---|---|---|---|---|
| / | GET | None | publicReadRateLimiter | query: category,minPrice,maxPrice,search,featured,sort | controller query parsing | 200 + Product[] | 400 | No | publicReadRateLimiter |
| /categories/list | GET | None | publicReadRateLimiter | none | none | 200 + string[] | 400 | No | publicReadRateLimiter |
| /:id | GET | None | publicReadRateLimiter + validateProductId | params: id | validateProductId | 200 + Product | 400,404 | No | publicReadRateLimiter |

### 2.3 CART (`/api/cart`)

| Endpoint | Method | Auth | Middleware | Input Contract | Validation | Success | Errors | Idempotency | RL |
|---|---|---|---|---|---|---|---|---|---|
| / | GET | Bearer | requireAuth + apiRateLimiter | none | requireAuth | 200 + Cart | 401 | No | apiRateLimiter |
| /count | GET | Bearer | requireAuth + apiRateLimiter | none | requireAuth | 200 + {count} | 401 | No | apiRateLimiter |
| /add | POST | Bearer | requireAuth + apiRateLimiter | body: productId,quantity | manual + ObjectId check + quantity>0 | 200 + Cart + message | 400,401 | No | apiRateLimiter |
| /update | PUT | Bearer | requireAuth + apiRateLimiter | body: productId,quantity | manual controller checks | 200 + Cart + message | 400,401,404 | No | apiRateLimiter |
| /remove | DELETE | Bearer | requireAuth + apiRateLimiter | body: productId | manual controller checks | 200 + Cart + message | 400,401,404 | No | apiRateLimiter |
| /clear | DELETE | Bearer | requireAuth + apiRateLimiter | none | requireAuth | 200 + empty cart + message | 401,500 | No | apiRateLimiter |

### 2.4 ORDERS (`/api/orders`)

| Endpoint | Method | Auth | Middleware | Input Contract | Validation | Success | Errors | Idempotency | RL |
|---|---|---|---|---|---|---|---|---|---|
| /track/:orderId | GET | None | publicReadRateLimiter + validateOrderId | params: orderId | validateOrderId | 200 + tracking | 400,404,429 | No | publicReadRateLimiter |
| / | POST | Bearer | requireAuth + idempotencyMiddleware('order') | body: shippingAddress,billingAddress?,paymentMethod?,notes? | createOrderSchema | 201 + {order,payment} | 400,401 | Yes | - |
| / | GET | Bearer | requireAuth | query: status? | requireAuth | 200 + orders | 401 | No | - |
| /:orderId | GET | Bearer | requireAuth + validateOrderId | params: orderId | validateOrderId | 200 + order | 400,401,404 | No | - |
| /:orderId/cancel | POST | Bearer | requireAuth + validateOrderId | params: orderId | validateOrderId | 200 + order + message | 400,401,404 | No | - |

### 2.5 ADDRESSES (`/api/addresses`)

| Endpoint | Method | Auth | Middleware | Input Contract | Validation | Success | Errors | Idempotency | RL |
|---|---|---|---|---|---|---|---|---|---|
| / | GET | Bearer | requireAuth | none | requireAuth | 200 + Address[] | 401 | No | - |
| /default | GET | Bearer | requireAuth | none | requireAuth | 200 + default address | 401,404 | No | - |
| /:addressId | GET | Bearer | requireAuth + validateAddressId | params: addressId | validateAddressId | 200 + Address | 400,401,404 | No | - |
| / | POST | Bearer | requireAuth | body: fullName,phone,street,city,postalCode,country,isDefault? | addressSchema | 201 + Address + message | 400,401 | No | - |
| /:addressId | PUT | Bearer | requireAuth + validateAddressId | params: addressId + body: partial fields | updateAddressSchema | 200 + Address + message | 400,401,404 | No | - |
| /:addressId | DELETE | Bearer | requireAuth + validateAddressId | params: addressId | validateAddressId | 204 | 400,401,404 | No | - |
| /:addressId/set-default | POST | Bearer | requireAuth + validateAddressId | params: addressId | validateAddressId | 200 + Address + message | 400,401,404 | No | - |

### 2.6 PAYMENTS (`/api/payments`)

| Endpoint | Method | Auth | Middleware | Input Contract | Validation | Success | Errors | Idempotency | RL |
|---|---|---|---|---|---|---|---|---|---|
| /webhook | POST | None (Stripe signature) | webhookRateLimiter | raw body + stripe-signature header | signature check in service | 200 + {received:true} | 400 | Event-level dedupe | webhookRateLimiter |
| /create-intent | POST | Bearer | requireAuth + validateRequest(body) | body: orderId | createPaymentIntentSchema | 200 + payment/clientSecret/checkoutUrl | 400,401,404 | No | - |
| /checkout | POST | Bearer | requireAuth + validateRequest(body) | body: orderId | createPaymentIntentSchema | 200 + payment/clientSecret/checkoutUrl | 400,401,404 | No | - |
| /:orderId/status | GET | Bearer | requireAuth + validateRequest(params) | params: orderId | paymentStatusParamsSchema | 200 + status payload | 400,401,404 | No | - |

### 2.7 ADMIN (`/api/admin`)

| Endpoint | Method | Auth | Middleware | Input Contract | Validation | Success | Errors | Idempotency | RL |
|---|---|---|---|---|---|---|---|---|---|
| /stats/summary | GET | Admin | requireAdmin + apiRateLimiter | none | requireAdmin | 200 + stats | 401,403 | No | apiRateLimiter |
| /products | GET | Admin | requireAdmin + apiRateLimiter | query: includeInactive? | requireAdmin | 200 + products | 401,403 | No | apiRateLimiter |
| /products | POST | Admin | requireAdmin + apiRateLimiter + autoLogAction | body: product payload | business validation in service | 201 + product | 400,401,403 | No | apiRateLimiter |
| /products/:id | PUT | Admin | requireAdmin + validateProductId + autoLogAction | params: id + body: patch | validateProductId | 200 + product | 400,401,403,404 | No | - |
| /products/:id | DELETE | Admin | requireAdmin + validateProductId + autoLogAction | params: id | validateProductId | 200 + product + message | 400,401,403,404 | No | - |
| /users | GET | Admin | requireAdmin + apiRateLimiter | query: page?,limit? | requireAdmin | 200 + paginated users | 401,403 | No | apiRateLimiter |
| /users/:id/role | PUT | Admin | requireAdmin + validateObjectId('id') + autoLogAction | params: id + body: role | validateObjectId('id') | 200 + user | 400,401,403,404 | No | - |
| /orders | GET | Admin | requireAdmin + apiRateLimiter | query: status?,userId? | requireAdmin | 200 + orders | 401,403 | No | apiRateLimiter |
| /orders/:id/status | PUT | Admin | requireAdmin + validateObjectId('id') + autoLogAction | params: id + body: status,message? | validateObjectId('id') | 200 + order | 400,401,403,404 | No | - |

### 2.8 HEALTH + METRICS

| Endpoint | Method | Auth | Middleware | Input Contract | Validation | Success | Errors | Idempotency | RL |
|---|---|---|---|---|---|---|---|---|---|
| /health | GET | None | none | none | none | 200 + status | 500 | No | - |
| /api/health | GET | None | none | none | none | 200 + mongo/redis/webhook health | 500 | No | - |
| /api/health/ping | GET | None | none | none | none | 200 + pong | 500 | No | - |
| /api/metrics/payment | GET | Bearer | requireAuth | query: lastN? | requireAuth + parseInt(lastN) | 200 + PaymentMetrics | 401 | No | - |
| /api/metrics/webhook | GET | Bearer | requireAuth | query: lastN? | requireAuth + parseInt(lastN) | 200 + WebhookMetrics | 401 | No | - |
| /api/metrics/all | GET | Bearer | requireAuth | none | requireAuth | 200 + ExportedMetrics | 401 | No | - |

---

## 3) Error Matrix מקצועי (רוחבי)

| Status | מתי זה קורה | איפה בולט | מה חייב להופיע בתגובה |
|---|---|---|---|
| 400 | פורמט/שדות לא תקינים | Auth, Cart, Payments, Validators | success=false + message ברור + field hints |
| 401 | אין token או token לא תקף | Auth protected, Cart, Orders, Addresses, Payments, Metrics | הודעת authentication ברורה |
| 403 | הרשאה לא מספיקה | Admin endpoints, Google auth edge | הודעת forbidden + context |
| 404 | משאב לא נמצא | Product/Order/Address by id | entity name + identifier context |
| 409 | קונפליקט עסקי | register (email קיים) | conflict reason מדויק |
| 423 | user lockout | login | lockout explanation |
| 429 | rate limit | Auth, public tracking/read | retry hint אם יש |
| 500 | תקלת שרת | health/cart clear edge/unknown | generic safe error + internal logging |

---

## 4) Checklist כיסוי (Definition of Done למסמך)

| Check | מצב |
|---|---|
| לכל endpoint יש Auth + Token source | כן |
| לכל endpoint יש Middleware מפורש | כן |
| לכל endpoint יש Input Contract (params/query/body) | כן |
| לכל endpoint יש מקור ולידציה | כן |
| לכל endpoint יש Success + Error codes | כן |
| מסלול ה-flow העסקי מכוסה מקצה לקצה | כן |
| Admin/Ops/Monitoring מכוסים | כן |

---

## 5) איך לעבוד עם המסמך בפועל

1. להתחיל ב-Flow (סעיף 1) כדי להבין סדר עבודה.
2. לעבור ל-Contract (סעיף 2) כדי לממש לקוח או בדיקות.
3. להשתמש ב-Error Matrix (סעיף 3) ל-QA ולבדיקות שליליות.
4. לסיים עם Checklist (סעיף 4) כדי לוודא שלא חסר כלום.
