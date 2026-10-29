# HTTP Fundamentals

> HTTP is an application-layer request-response protocol used for communication between clients and servers.

---

## What Is HTTP?

HTTP stands for **Hypertext Transfer Protocol**.

It is an **application-layer protocol** used for communication between a client and a server.

A client can be:

- a web browser
- a mobile application
- a React frontend
- `curl`
- another backend service
- any application capable of sending HTTP requests

The basic communication model is:

```text
Client
   ↓
HTTP Request
   ↓
Server
   ↓
HTTP Response
   ↓
Client
```

The client initiates the communication by sending a request.

The server receives the request, performs the required processing, and sends back a response.

In a MERN application:

```text
React
   ↓
GET /api/users
   ↓
Node / Express
   ↓
Business Logic
   ↓
MongoDB
   ↓
Result
   ↓
200 OK + JSON
   ↓
React
```

> **Important**
>
> HTTP does not contain your application business logic.
>
> HTTP defines **how messages are exchanged** between systems.
>
> Node/Express contains the application logic that decides what to do with the request.

---

# HTTP Request

An HTTP request represents something that a client wants the server to do.

Example:

```http
GET /api/users/123 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer <token>
```

Conceptually, an HTTP request can contain:

```text
HTTP Request
│
├── Method
├── Path / URL
├── Headers
├── Query Parameters
└── Optional Body
```

A request generally consists of:

1. Request method
2. Headers
3. Optional body

Example:

```http
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "name": "Mahesh"
}
```

Here:

```text
POST                    → HTTP method
/api/users              → Resource path
HTTP/1.1                → HTTP version
Host                    → Request header
Content-Type            → Request header
JSON                    → Request body
```

---

# HTTP Methods

HTTP methods communicate the **intention of the request**.

| Method   | Typical Purpose             |
| -------- | --------------------------- |
| `GET`    | Retrieve a resource         |
| `POST`   | Create or submit something  |
| `PUT`    | Replace a resource          |
| `PATCH`  | Partially update a resource |
| `DELETE` | Remove a resource           |

Examples:

```http
GET /users/123
```

Retrieve user `123`.

```http
POST /users
```

Create a new user.

```http
PUT /users/123
```

Replace the representation of user `123`.

```http
PATCH /users/123
```

Modify part of user `123`.

```http
DELETE /users/123
```

Delete user `123`.

---

## PUT vs PATCH

Consider this resource:

```json
{
  "name": "Mahesh",
  "city": "Pune",
  "role": "Engineer"
}
```

A `PATCH` request may send:

```json
{
  "city": "Mumbai"
}
```

Meaning:

> Update only the `city` field.

A `PUT` request generally represents replacing the resource representation with the supplied representation.

> **NOTE**
>
> Real-world APIs sometimes implement `PUT` differently, so always check the API contract.

---

# HTTP Response

After processing a request, the server sends an HTTP response.

Example:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "Mahesh"
}
```

Conceptually:

```text
HTTP Response
│
├── HTTP Version
├── Status Code
├── Headers
└── Optional Body
```

Here:

```text
HTTP/1.1                       → HTTP version
200                            → Status code
OK                             → Reason phrase
Content-Type                   → Response header
JSON                           → Response body
```

The status code tells the client the outcome of the request.

---

# HTTP Status Codes

HTTP status codes are grouped into five categories.

| Range | Meaning                 |
| ----- | ----------------------- |
| `1xx` | Informational           |
| `2xx` | Successful              |
| `3xx` | Redirection             |
| `4xx` | Client/request problem  |
| `5xx` | Server/upstream problem |

---

## Important Status Codes

### Success

| Status           | Meaning                                  |
| ---------------- | ---------------------------------------- |
| `200 OK`         | Request completed successfully           |
| `201 Created`    | New resource created                     |
| `204 No Content` | Successful request with no response body |

### Redirection

| Status                  | Meaning                                 |
| ----------------------- | --------------------------------------- |
| `301 Moved Permanently` | Resource permanently moved              |
| `304 Not Modified`      | Cached representation can still be used |

### Client Errors

| Status                  | Meaning                                       |
| ----------------------- | --------------------------------------------- |
| `400 Bad Request`       | Request is invalid                            |
| `401 Unauthorized`      | Authentication missing or invalid             |
| `403 Forbidden`         | Authenticated but not permitted               |
| `404 Not Found`         | Resource does not exist                       |
| `409 Conflict`          | Request conflicts with current resource state |
| `429 Too Many Requests` | Rate limit exceeded                           |

### Server Errors

| Status                      | Meaning                                             |
| --------------------------- | --------------------------------------------------- |
| `500 Internal Server Error` | Server encountered an unexpected problem            |
| `502 Bad Gateway`           | Gateway/proxy received an invalid upstream response |
| `503 Service Unavailable`   | Service temporarily unavailable                     |

---

## 401 vs 403

This distinction is important.

```text
401 Unauthorized
        ↓
Authentication problem

Who are you?
```

Examples:

- token missing
- token expired
- invalid credentials

```text
403 Forbidden
        ↓
Authorization problem

I know who you are,
but you cannot perform this action.
```

Example:

```text
User has valid token
        ↓
User requests /admin
        ↓
User does not have ADMIN role
        ↓
403 Forbidden
```

> **TIP**
> Think:
>
> **401 → Who are you?**  
> **403 → You cannot do that.**

---

# HTTP Headers

HTTP headers contain **metadata about the HTTP message**.

Examples:

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
Cache-Control: no-cache
User-Agent: Chrome
```

Useful mental model:

```text
Headers
   ↓
Information about the message

Body
   ↓
The actual data being transferred
```

---

## Common Headers

### Content-Type

Describes the format of the request or response body.

Example:

```http
Content-Type: application/json
```

---

### Accept

Tells the server which response formats the client can understand.

```http
Accept: application/json
```

---

### Authorization

Provides authentication credentials.

```http
Authorization: Bearer <token>
```

---

### User-Agent

Provides information about the client.

```http
User-Agent: Mozilla/5.0
```

---

### Cache-Control

Defines caching behavior.

```http
Cache-Control: no-cache
```

Caching will be studied separately later.

---

# Path Parameters vs Query Parameters

Consider:

```http
GET /users/123
```

Here:

```text
123
 ↓
Identifies a particular resource
```

This is commonly treated as a **path parameter**.

Compare:

```http
GET /users?page=2&limit=20
```

Here:

```text
page=2
limit=20
```

are query parameters.

They modify how the resource collection is requested.

Useful mental model:

```text
Path Parameter
      ↓
Which resource?

Query Parameter
      ↓
How should it be searched,
filtered, sorted, or presented?
```

### Example

```http
GET /products/123
```

Meaning:

> Give me product `123`.

Compare:

```http
GET /products?category=phone&limit=20
```

Meaning:

> Give me up to 20 products belonging to the phone category.

---

# HTTP Is Stateless

HTTP is fundamentally a **stateless protocol**.

This means HTTP itself does not automatically remember previous requests.

Consider:

```text
Request 1
User logs in

        ↓

Request 2
User asks for profile
```

HTTP itself does not automatically know:

> Request 2 came from the same user as Request 1.

Each HTTP request can be processed independently.

Applications therefore introduce state using mechanisms such as:

```text
Cookies
Sessions
Tokens
```

Conceptually:

```text
HTTP
  ↓
Stateless

Application
  ↓
Can maintain state using additional mechanisms
```

> **!IMPORTANT**
>
> Stateless HTTP does not mean web applications cannot remember users.
>
> It means **HTTP itself does not provide application session memory automatically**.

Cookies, sessions, JWTs, and authentication will be studied separately.

---

# HTTP Connections

A simplified HTTP interaction looks like:

```text
Establish Connection
        ↓
Send HTTP Request
        ↓
Server Processes Request
        ↓
Receive HTTP Response
        ↓
Reuse or Close Connection
```

Repeatedly establishing connections can be expensive.

Modern HTTP versions therefore include mechanisms for improving connection efficiency.

---

# HTTP Versions

For now, only understand the high-level differences.

| Version  | Important Idea                  |
| -------- | ------------------------------- |
| HTTP/1.1 | Persistent connections          |
| HTTP/2   | Multiplexing and binary framing |
| HTTP/3   | HTTP over QUIC                  |

---

## HTTP/1.1

HTTP/1.1 commonly allows a TCP connection to remain open and be reused for multiple requests.

Conceptually:

```text
Without connection reuse

Request
 ↓
Connection
 ↓
Close

Request
 ↓
New Connection
 ↓
Close
```

Compared with:

```text
Persistent Connection

Connection
   ↓
Request 1
   ↓
Response 1
   ↓
Request 2
   ↓
Response 2
```

---

## HTTP/2

HTTP/2 introduced improvements including **multiplexing**.

Multiple streams can share a single connection.

Simplified mental model:

```text
Single Connection
│
├── Request A
├── Request B
├── Request C
│
├── Response A
├── Response B
└── Response C
```

Do not go deep into HTTP/2 internals yet.

---

## HTTP/3

HTTP/3 uses **QUIC** rather than TCP as its transport foundation.

For now, remember only:

```text
HTTP/1.1
   ↓
TCP

HTTP/2
   ↓
TCP

HTTP/3
   ↓
QUIC / UDP
```

TCP, TLS, QUIC, and transport internals will be studied separately.

---

# MERN Request Lifecycle

Consider:

```javascript
fetch("/api/users");
```

A useful mental model is:

```text
React
   ↓
fetch("/api/users")
   ↓
HTTP Request
   ↓
GET /api/users
Headers
   ↓
Network
   ↓
Node / Express
   ↓
Route Matching
   ↓
Controller
   ↓
Service / Business Logic
   ↓
MongoDB
   ↓
Query Result
   ↓
Express
   ↓
HTTP Response
   ↓
200 OK
Content-Type: application/json
JSON Body
   ↓
Network
   ↓
React
   ↓
Response Parsed
   ↓
State Updated
   ↓
UI Re-rendered
```

This is the key connection between HTTP fundamentals and practical MERN development.

---

# Practical Labs

## Lab 1 — Inspect Response Headers

Run:

```bash
curl -I https://example.com
```

`-I` retrieves response headers.

Observe:

```text
HTTP status
content-type
cache-related headers
server-related headers
```

Do not worry if the exact output differs.

---

## Lab 2 — Inspect Full HTTP Communication

Run:

```bash
curl -v https://example.com
```

Look for lines beginning with:

```text
>
```

These generally represent information sent by the client.

Example:

```text
> GET / HTTP/1.1
> Host: example.com
```

Look for:

```text
<
```

These generally represent information received from the server.

Example:

```text
< HTTP/1.1 200 OK
< Content-Type: text/html
```

---

## Lab 3 — Send a GET Request

Run:

```bash
curl https://httpbin.org/get
```

Inspect the returned information.

Identify:

- request method
- headers
- URL
- response body

---

## Lab 4 — Send a POST Request

Run:

```bash
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"name":"Mahesh"}'
```

Observe how the JSON body is reflected in the response.

Identify:

```text
HTTP Method
Headers
Request Body
Response Body
```

---

## Lab 5 — Send a Custom Header

Run:

```bash
curl https://httpbin.org/headers \
  -H "X-Learning: HTTP-Day-1"
```

Verify that the server received:

```text
X-Learning: HTTP-Day-1
```

This demonstrates that headers travel as part of the HTTP request.

---

# Browser DevTools Practice

Open Chrome Developer Tools.

```text
Developer Tools
      ↓
Network
      ↓
Reload Page
```

Select any network request.

Inspect:

```text
Headers
Payload
Response
Timing
```

Pay attention to:

```text
Request URL
Request Method
Status Code

Request Headers
Response Headers

Query String Parameters
Request Payload
Response Body
```

Ask yourself:

```text
Which information came from the browser?

Which information was sent to the server?

Which information came from the server?

Where is the HTTP method?

Where is the status code?

Where are the headers?

Where is the request body?

Where is the response body?
```

---

# MERN Application Practice

Open any existing React + Node application.

Use:

```text
Chrome DevTools
   ↓
Network
```

Trigger one API call.

For example:

```http
GET /api/music/123
```

Identify:

- HTTP method
- URL
- path parameters
- query parameters
- request headers
- request body, if any
- response headers
- status code
- response body
- request duration

Then identify the corresponding backend route.

Example:

```javascript
app.get("/api/music/:id", handler);
```

Connect:

```text
Browser Network Request
        ↕
Express Route
```

This is one of the best exercises for connecting theory with existing development experience.

---

# Common Misunderstandings

## HTTP and REST Are Not the Same Thing

HTTP is a communication protocol.

REST is an architectural style that commonly uses HTTP.

```text
HTTP
    → protocol

REST
    → architectural style
```

REST will be studied separately.

---

## HTTP Does Not Mean JSON

HTTP can transport many types of content.

Examples:

```text
JSON
HTML
XML
plain text
images
video
binary files
```

The format is usually communicated using headers such as:

```http
Content-Type: application/json
```

---

## HTTP Does Not Execute Business Logic

HTTP transports messages.

Your application performs the actual processing.

```text
HTTP Request
     ↓
Node / Express
     ↓
Business Logic
     ↓
Database
```

---

# Security Considerations

At this stage, remember:

- HTTP by itself does not encrypt traffic.
- HTTPS adds TLS protection.
- Authentication credentials should not be sent over insecure HTTP.
- Sensitive tokens should be handled carefully.
- Request input must never automatically be trusted.

HTTPS and TLS will be studied separately.

---

# Performance Considerations

HTTP performance can be influenced by:

- connection establishment
- request/response size
- network latency
- server processing time
- connection reuse
- caching
- compression
- HTTP version

These topics will be explored later.

---

# Interview Questions

Try answering these without referring to the notes.

### Fundamentals

1. What is HTTP?
2. Why do we need HTTP?
3. Is HTTP stateful or stateless?
4. What does an HTTP request contain?
5. What does an HTTP response contain?
6. What are HTTP headers?
7. Can HTTP transport something other than JSON?

### Methods

8. GET vs POST?
9. PUT vs PATCH?
10. When would you use DELETE?

### Status Codes

11. What do `2xx`, `4xx`, and `5xx` represent?
12. `200` vs `201`?
13. `401` vs `403`?
14. `500` vs `502`?
15. What does `429` mean?

### API Design

16. Path parameter vs query parameter?
17. What is the role of `Content-Type`?
18. What is the role of `Accept`?
19. Where does HTTP fit between React and Express?
20. Does HTTP execute application business logic?

### Connections

21. Why are persistent connections useful?
22. What is the high-level difference between HTTP/1.1 and HTTP/2?
23. What transport does HTTP/3 use?

---

# Quick Revision

```text
HTTP
│
├── Application-layer protocol
├── Client → Request
├── Server → Response
├── Stateless
│
├── Request
│   ├── Method
│   ├── URL
│   ├── Headers
│   └── Optional Body
│
├── Response
│   ├── Status Code
│   ├── Headers
│   └── Optional Body
│
├── Methods
│   ├── GET
│   ├── POST
│   ├── PUT
│   ├── PATCH
│   └── DELETE
│
├── Status
│   ├── 2xx Success
│   ├── 3xx Redirect
│   ├── 4xx Client Problem
│   └── 5xx Server Problem
│
└── Versions
    ├── HTTP/1.1
    ├── HTTP/2
    └── HTTP/3
```

---

# My Understanding

HTTP is an application-layer protocol that provides a standard request-response communication model between clients and servers.

A client sends an HTTP request containing information such as the method, URL, headers, and optionally a body.

The server processes the request using application logic and returns an HTTP response containing a status code, headers, and optionally a response body.

HTTP itself is stateless. Applications maintain user state through additional mechanisms such as cookies, sessions, and tokens.

In a MERN application, HTTP provides the communication layer between the React frontend and the Node/Express backend, while the application code and database perform the actual business processing.

---

# Day 1 Completion Checklist

Before marking this topic complete:

- [ ] Understand the client-server request-response model
- [ ] Understand HTTP request structure
- [ ] Understand HTTP response structure
- [ ] Understand GET, POST, PUT, PATCH, DELETE
- [ ] Understand status-code categories
- [ ] Explain `401` vs `403`
- [ ] Understand headers vs body
- [ ] Understand path vs query parameters
- [ ] Explain why HTTP is stateless
- [ ] Understand HTTP/1.1, HTTP/2, HTTP/3 at a high level
- [ ] Run `curl -I`
- [ ] Run `curl -v`
- [ ] Perform GET and POST using `httpbin`
- [ ] Inspect an HTTP request using Chrome DevTools
- [ ] Inspect one request in an existing MERN application
- [ ] Answer the interview questions without notes

---

# References

## Primary Reading

- [MDN — Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- [MDN — HTTP Messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages)
- [MDN — HTTP Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference)
- [MDN — A Typical HTTP Session](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Session)

## Deeper Reference

- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)

> [!NOTE]
> The RFC is primarily a reference. It does not need to be read end-to-end while learning HTTP fundamentals.

---

# Related Topics

Study these separately after completing HTTP fundamentals:

- [ ] [DNS](dns.md)
- [ ] [IP addresses and ports](ip-addresses-and-ports.md)
- [ ] [TCP](tcp.md)
- [ ] [UDP](udp.md)
- [ ] [Network sockets](sockets.md)
- [ ] [TLS](tls.md)
- [ ] [TLS Certificates](certificates.md)
- [ ] [HTTPS](https.md)
- [ ] Cookies
- [ ] Sessions
- [ ] Authentication
- [ ] CORS
- [ ] HTTP caching
- [ ] Reverse proxies
- [ ] Load balancing
- [ ] CDN
- [ ] WebSockets

---

## Not Required Yet

Do not go deep into these while completing this note:

- TCP internals
- TLS cryptography
- QUIC internals
- HTTP/3 internals
- DNS internals
- OAuth
- JWT
- Nginx
- advanced caching algorithms

They will make much more sense after the networking foundations are complete.

---

[← Previous: DNS](dns.md) · [Next: TLS →](tls.md)
