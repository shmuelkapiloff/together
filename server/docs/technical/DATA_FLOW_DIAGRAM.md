# 🔄 Data Flow Diagram - זרימת מידע מלאה

## דיאגרמה כללית - From User to Payment

```mermaid
sequenceDiagram
    participant User as 👤 User<br/>(Browser)
    participant React as ⚛️ React App
    participant API as 🔧 Express API
    participant DB as 💾 MongoDB
    participant Redis as ⚡ Redis
    participant Stripe as 💳 Stripe
    participant Email as 📧 Email Service

    User->>React: 1. Browse Products
    activate React
    React->>API: GET /api/products
    activate API
    API->>Redis: Check cache
    alt Cache hit
        Redis-->>API: Products
    else Cache miss
        API->>DB: Query products
        DB-->>API: Products
        API->>Redis: Store 1hr
    end
    API-->>React: Products JSON
    deactivate API
    React-->>User: Display products
    deactivate React

    User->>React: 2. Add to Cart
    activate React
    React->>API: POST /api/cart/add
    activate API
    API->>API: ✓ Auth check
    API->>DB: Update cart
    DB-->>API: Cart updated
    API-->>React: New cart
    React-->>User: Item added ✓
    deactivate API
    deactivate React

    User->>React: 3. Create Order
    activate React
    React->>API: POST /api/orders
    activate API
    API->>API: ✓ Auth + Idempotency check
    API->>DB: Start Transaction
    activate DB
    DB->>DB: Create order (pending_payment)
    DB->>DB: Decrease product quantities
    DB->>DB: Create payment document
    DB-->>API: Transaction committed
    deactivate DB
    API-->>React: Order + clientSecret
    React-->>User: Redirect to Stripe
    deactivate API
    deactivate React

    User->>Stripe: 4. Pay on Stripe Checkout
    activate Stripe
    Stripe->>Stripe: Process payment
    Stripe-->>User: ✓ Success
    deactivate Stripe

    Stripe->>API: 5. Webhook: payment_intent.succeeded
    activate API
    API->>API: ✓ Verify signature
    API->>API: ✓ Check idempotency
    API->>DB: Start Transaction
    activate DB
    DB->>DB: Update payment status
    DB->>DB: Update order status
    DB->>DB: Log inventory change
    DB-->>API: Transaction committed
    deactivate DB
    API->>Redis: Invalidate cart cache
    API->>Email: Send confirmation
    activate Email
    Email-->>User: Order confirmed email
    deactivate Email
    API-->>Stripe: 200 OK
    deactivate API

    User->>React: 6. Check order status
    activate React
    React->>API: GET /api/orders/:id
    activate API
    API->>DB: Get order
    DB-->>API: Order (confirmed)
    API-->>React: Order data
    React-->>User: Order confirmed ✓
    deactivate API
    deactivate React
```

---

## זרימה לפי מודול

### 🔐 Authentication Flow

```mermaid
graph TD
    A["User submits\nEmail + Password"] -->|POST /auth/login| B["Express Route"]
    B -->|Middleware| C["authRateLimiter<br/>Check: <= 5/min per IP"]
    C -->|Pass| D["LoginController"]
    D -->|Query| E["MongoDB<br/>users collection"]
    E -->|Found| F["Verify password<br/>bcrypt.compare"]
    F -->|Match| G["Generate tokens<br/>access + refresh"]
    G -->|Store| H["Redis<br/>Session cache"]
    G -->|Return| I["Response:<br/>access_token<br/>refresh_token"]
    I -->|localStorage| J["Browser<br/>Token storage"]
    
    F -->|No match| K["lockoutAttempts++<br/>lockoutUntil = now + 15min"]
    K -->|Update| E
    K -->|Return| L["Error: Invalid credentials"]
    
    C -->|Exceeded| M["Return 429<br/>Too Many Requests"]
    
    style C fill:#ff6b6b
    style G fill:#51cf66
    style H fill:#ffd43b
    style J fill:#a78bfa
```

### 🛒 Cart → Order → Payment Flow

```mermaid
graph TD
    A["Cart<br/>3 items"] -->|POST /orders| B["Create Order<br/>Controller"]
    B -->|Validate| C["createOrderSchema<br/>Zod validation"]
    C -->|Pass| D["Order Service"]
    D -->|Transaction START| E["MongoDB"]
    
    E -->|1. Create Order| F["orders collection<br/>status: pending_payment"]
    E -->|2. Decrease Stock| G["products collection<br/>quantity--"]
    E -->|3. Create Payment| H["payments collection<br/>status: pending"]
    
    E -->|COMMIT| I["Transaction Success"]
    
    I -->|Parallel| J["Create Stripe<br/>Payment Intent"]
    J -->|API Call| K["Stripe"]
    K -->|Return| L["clientSecret<br/>+ checkoutUrl"]
    
    I -->|Return| M["Order Response<br/>+ clientSecret"]
    
    M -->|Client sends<br/>to Stripe| N["Stripe Checkout"]
    N -->|User completes| O["Stripe event:<br/>payment_intent.succeeded"]
    
    O -->|Webhook POST| P["paymentController"]
    P -->|Verify signature| Q["HMAC-SHA256"]
    Q -->|Check idempotency| R["webhook_events<br/>collection"]
    
    R -->|Not processed yet| S["Process Webhook"]
    S -->|Transaction START| T["MongoDB"]
    
    T -->|Update payment| H
    T -->|Update order| F
    T -->|Log inventory| U["inventory_logs"]
    
    T -->|COMMIT| V["Webhook processed"]
    V -->|Cache invalidate| W["Redis:<br/>Clear user cart"]
    V -->|Send email| X["Email service<br/>Order confirmed"]
    
    R -->|Already processed| Y["Return 200<br/>Idempotent response"]
    
    style A fill:#fff3bf
    style F fill:#d0f4ff
    style H fill:#ffe0e0
    style K fill:#e7f5ff
    style N fill:#e7f5ff
    style Q fill:#f3e9ff
```

### 👥 Admin Management Flow

```mermaid
graph TD
    A["Admin User<br/>role: admin"] -->|POST /admin/products| B["Admin Route"]
    B -->|Middleware| C["requireAdmin<br/>Check role"]
    C -->|Pass| D["Admin Controller"]
    D -->|Middleware| E["autoLogAction<br/>Log all changes"]
    E -->|Validate| F["Schema validation<br/>Zod"]
    F -->|Pass| G["Admin Service"]
    G -->|Update| H["MongoDB<br/>products collection"]
    H -->|Return| I["Updated product"]
    I -->|Log entry| J["audit_logs<br/>collection"]
    J -->|Return| K["Admin Response<br/>+ timestamp"]
    
    E -->|Log action| L["Context:<br/>userId, action, payload"]
    
    style C fill:#ff6b6b
    style E fill:#ffd43b
    style J fill:#b197fc
```

### 📊 Health & Monitoring

```mermaid
graph TD
    A["Request to<br/>/api/health"] -->|GET| B["Health Controller"]
    B -->|Check MongoDB| C["MongoDB<br/>connection"]
    C -->|Ping| D["DB Response"]
    D -->|readyState = 1| E["Connected ✓"]
    
    B -->|Check Redis| F["Redis<br/>connection"]
    F -->|PING| G["Redis Response"]
    G -->|status = ready| H["Connected ✓"]
    
    B -->|Check Webhooks| I["webhook_events<br/>collection"]
    I -->|Last 24h| J["Recent webhooks"]
    J -->|Count| K["Received last 24h"]
    
    B -->|Aggregate| L["Health Status"]
    L -->|All OK| M["Response:<br/>healthy"]
    L -->|One down| N["Response:<br/>degraded"]
    
    style E fill:#51cf66
    style H fill:#51cf66
    style M fill:#51cf66
    style N fill:#ffd43b
```

---

## שכבות Request - מלמעלה למטה

```mermaid
graph TD
    A["1. HTTP Request<br/>POST /api/orders"] -->|→| B["2. Express App"]
    B -->|→| C["3. Global Middlewares<br/>cors, bodyParser, errorHandler"]
    C -->|→| D["4. Route Dispatcher<br/>Router.use"]
    D -->|→| E["5. Route-Specific Middlewares<br/>requireAuth, idempotency"]
    E -->|→| F["6. Controller<br/>OrderController.create"]
    F -->|→| G["7. Input Validation<br/>createOrderSchema.parse"]
    G -->|→| H["8. Business Logic<br/>OrderService.create"]
    H -->|→| I["9. Data Access<br/>MongoDB Transaction"]
    I -->|→| J["10. External Services<br/>Stripe API"]
    
    J -->|←| K["11. Response Builder"]
    K -->|←| L["12. Response Headers<br/>Cache-Control, X-Request-ID"]
    L -->|←| M["13. HTTP Response<br/>200/201/4xx/5xx"]
    
    style A fill:#d0ebff
    style I fill:#ffe0e0
    style J fill:#e7f5ff
    style M fill:#d0f4ff
```

---

## Cache Strategy

```mermaid
graph TD
    A["Request for<br/>Products List"] -->|Check| B["Redis<br/>products:all"]
    B -->|HIT<br/>< 1sec| C["Return cached<br/>+ TTL:3600"]
    
    B -->|MISS| D["Query MongoDB"]
    D -->|Get data| E["Process<br/>format"]
    E -->|Store in Redis| F["products:all<br/>TTL: 1 hour"]
    F -->|Return| C
    
    G["Update Product<br/>in Admin"] -->|Invalidate| H["Redis<br/>DELETE products:all"]
    H -->|On next request| B
    H -->|Cache miss| D
    
    style B fill:#ffd43b
    style C fill:#51cf66
    style H fill:#ff6b6b
```

---

## Error Handling Flow

```mermaid
graph TD
    A["Request"] -->|Process| B{"Error<br/>Occurs?"}
    B -->|No| C["Success<br/>Response 200"]
    
    B -->|Yes| D{"Error<br/>Type?"}
    
    D -->|Validation| E["400 Bad Request<br/>+ field errors"]
    D -->|Auth| F["401 Unauthorized<br/>or 403 Forbidden"]
    D -->|Not Found| G["404 Not Found"]
    D -->|Conflict| H["409 Conflict<br/>e.g., email exists"]
    D -->|Rate Limit| I["429 Too Many<br/>Requests"]
    D -->|Server| J["500 Internal<br/>Server Error"]
    
    E -->|Log| K["logger.warn<br/>+ context"]
    F -->|Log| K
    G -->|Log| K
    H -->|Log| K
    I -->|Log| K
    J -->|Log| L["logger.error<br/>+ stack trace"]
    
    K -->|Error Response| M["JSON:<br/>success: false<br/>message: ..."]
    L -->|Error Response| M
    
    M -->|Send to Client| N["HTTP Response"]
    
    style C fill:#51cf66
    style E fill:#ffc078
    style F fill:#ff8c42
    style J fill:#ff6b6b
```

---

## Integration Points - שירותים חיצוניים

```mermaid
graph LR
    API["Simple Shop<br/>Express API"]
    
    API -->|Connection<br/>Pool| DB["MongoDB<br/>Atlas"]
    API -->|Cache<br/>Cluster| Redis["Redis<br/>Cloud"]
    API -->|HTTP POST| Stripe["Stripe<br/>Payments"]
    API -->|Read| ENV["Environment<br/>Variables"]
    API -->|Send| Email["Email<br/>Service"]
    API -->|Store| S3["AWS S3<br/>Images"]
    
    Stripe -->|Webhook| API
    
    style API fill:#d0d9ff
    style DB fill:#ffe0e0
    style Redis fill:#ffd43b
    style Stripe fill:#e7f5ff
    style Email fill:#e0f2fe
    style S3 fill:#e0ffe0
```

---

## Load & Scalability

```mermaid
graph TD
    A["Incoming Requests<br/>100 RPS"] -->|Load Balancer| B["API Instance 1<br/>Node.js"]
    A -->|Load Balancer| C["API Instance 2<br/>Node.js"]
    A -->|Load Balancer| D["API Instance 3<br/>Node.js"]
    
    B -->|Connection Pool<br/>10 connections| E["MongoDB<br/>Primary"]
    C -->|Connection Pool| E
    D -->|Connection Pool| E
    
    E -->|Replica Set| F["MongoDB<br/>Secondary 1"]
    E -->|Replica Set| G["MongoDB<br/>Secondary 2"]
    
    B -->|Cluster<br/>Master| H["Redis<br/>Cluster"]
    C -->|Cluster| H
    D -->|Cluster| H
    
    H -->|Replicate| I["Redis<br/>Node 2"]
    H -->|Replicate| J["Redis<br/>Node 3"]
    
    style E fill:#ffe0e0
    style H fill:#ffd43b
    style B fill:#d0f4ff
    style C fill:#d0f4ff
    style D fill:#d0f4ff
```
