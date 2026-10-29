# HTTPS

> HTTPS is HTTP protected by TLS, providing confidentiality, integrity, and server authentication for web communication.

---

## What Is HTTPS?

HTTPS stands for:

**Hypertext Transfer Protocol Secure**

HTTPS is not a completely different application protocol from HTTP.

It is HTTP communication protected using **TLS**.

Conceptually:

```text
HTTP
 ↓
TLS
 ↓
TCP
 ↓
IP
```

So:

```text
HTTPS = HTTP over TLS
```

---

## Why Does HTTPS Exist?

Plain HTTP does not encrypt application data.

Suppose a client sends:

```http
POST /login HTTP/1.1
Content-Type: application/json

{
  "username": "mahesh",
  "password": "secret123"
}
```

With plain HTTP, the request itself is not encrypted by HTTP.

Conceptually:

```text
Browser
   ↓
HTTP
   ↓
Network
   ↓
Server
```

A party capable of observing traffic somewhere along the network path could potentially inspect the transmitted data.

HTTPS adds TLS protection:

```text
Browser
   ↓
HTTP
   ↓
TLS Protection
   ↓
Network
   ↓
TLS Processing
   ↓
Server
```

---

# What Does HTTPS Provide?

HTTPS primarily provides three security properties:

```text
Confidentiality
Integrity
Authentication
```

---

## Confidentiality

Confidentiality means unauthorized parties should not be able to read the application data being transmitted.

Without protection:

```text
username=mahesh
password=secret123
```

could potentially be visible to someone observing the traffic.

With TLS, application data is encrypted before transmission.

Conceptually:

```text
Plaintext
   ↓
Encryption
   ↓
Ciphertext
   ↓
Network
   ↓
Decryption
   ↓
Plaintext
```

---

## Integrity

Integrity means transmitted data should not be modified without detection.

Suppose an application sends:

```text
amount=100
```

An attacker should not be able to silently change it to:

```text
amount=100000
```

TLS provides integrity protection so unauthorized modification of protected traffic is detected.

---

## Authentication

Authentication helps the client verify that it is communicating with the intended server.

For example:

```text
Browser requests:
example.com
```

The browser needs evidence that the server presenting itself as:

```text
example.com
```

is authorized to use that identity.

TLS certificates provide this server-authentication mechanism.

---

# HTTP vs HTTPS

| HTTP                              | HTTPS                                        |
| --------------------------------- | -------------------------------------------- |
| Application protocol              | HTTP protected by TLS                        |
| No built-in encryption            | Encrypted communication                      |
| No TLS certificate validation     | Server identity validated using certificates |
| Common default port: 80           | Common default port: 443                     |
| Traffic can be visible in transit | Application traffic is protected             |

---

# Where HTTPS Fits in the Stack

For plain HTTP:

```text
Application
   ↓
HTTP
   ↓
TCP
   ↓
IP
```

For HTTPS:

```text
Application
   ↓
HTTP
   ↓
TLS
   ↓
TCP
   ↓
IP
```

> **Important**
>
> TLS protects the HTTP communication.
>
> HTTP still defines the request-response semantics.

---

# Complete HTTPS Request Flow

Suppose the user enters:

```text
https://example.com/users
```

A simplified flow is:

```text
Browser
   ↓
Parse URL
   ↓
DNS Lookup
   ↓
Get IP Address
   ↓
Target Port 443
   ↓
TCP Connection
   ↓
TLS Handshake
   ↓
Validate Server Certificate
   ↓
Establish Shared Session Keys
   ↓
Encrypted HTTP Request
   ↓
Server
   ↓
Encrypted HTTP Response
```

This combines the networking topics learned so far.

---

# HTTPS and Port 443

HTTPS commonly uses:

```text
443
```

as its default port.

Therefore:

```text
https://example.com
```

usually implies:

```text
https://example.com:443
```

The port does not itself provide security.

Security comes from TLS.

---

# What HTTPS Does Not Guarantee

HTTPS does not mean:

> The website is safe, honest, or trustworthy.

HTTPS tells us that communication is protected and the certificate validation process succeeded for the requested identity.

A malicious website can still use HTTPS.

So:

```text
HTTPS
≠
Website is trustworthy
```

Better mental model:

```text
HTTPS
→ Secure communication with the authenticated TLS endpoint
```

---

# MERN Mental Model

Suppose React sends:

```javascript
fetch("https://api.example.com/users");
```

Conceptually:

```text
React
   ↓
DNS
   ↓
Server IP
   ↓
TCP :443
   ↓
TLS Handshake
   ↓
Encrypted HTTP Request
   ↓
Node / Express
   ↓
Application Logic
   ↓
MongoDB
```

HTTP still defines:

```text
GET /users
Headers
Body
Status Code
```

TLS protects those HTTP messages during transport.

---

# Practical Labs

## Lab 1 — Inspect HTTPS with curl

Run:

```bash
curl -v https://example.com
```

Look for:

- connection establishment
- TLS information
- certificate-related output
- HTTP request
- HTTP response

Try to identify this sequence:

```text
Connection
   ↓
TLS
   ↓
HTTP
```

---

## Lab 2 — Compare HTTP and HTTPS

Run:

```bash
curl -v http://example.com
```

Then:

```bash
curl -v https://example.com
```

Observe that HTTPS introduces TLS negotiation before HTTP communication.

---

## Lab 3 — Browser DevTools

Open:

```text
https://example.com
```

In browser Developer Tools:

```text
Network
   ↓
Select Request
   ↓
Headers
```

Identify:

- Request URL
- HTTPS scheme
- status code
- request headers
- response headers

The browser hides most TLS complexity from application code.

---

# Common Problems

HTTPS-related issues can include:

```text
Certificate expired
Hostname mismatch
Untrusted certificate chain
TLS version mismatch
Certificate configuration error
Proxy/load-balancer TLS configuration issue
```

These will be easier to diagnose after understanding TLS and certificates.

---

# Common Misunderstandings

## HTTPS Is Not a New HTTP Method

HTTPS does not replace:

```text
GET
POST
PUT
PATCH
DELETE
```

Those remain HTTP concepts.

HTTPS changes how HTTP data is securely transported.

---

## HTTPS Does Not Encrypt the Destination IP

TLS protects application data, but the networking layers still need information required to route traffic.

Do not assume every piece of network metadata becomes invisible simply because HTTPS is used.

---

## HTTPS Does Not Contain Business Logic

```text
HTTPS
→ secure communication

Node / Express
→ application logic
```

---

# Security Considerations

Use HTTPS whenever sensitive or authenticated web communication is involved.

Important principles:

- do not send credentials through plain HTTP
- do not ignore certificate warnings
- protect private keys
- renew certificates before expiration
- use modern TLS configurations
- redirect HTTP traffic to HTTPS when appropriate
- secure cookies appropriately when using HTTPS

Detailed application security will be covered separately.

---

# Performance Considerations

HTTPS adds cryptographic setup and processing.

However, modern TLS is highly optimized.

Performance is influenced by:

- TLS handshake latency
- connection reuse
- session resumption
- geographic latency
- certificate-chain size
- server cryptographic performance

Do not avoid HTTPS for performance reasons.

Security is mandatory for modern production web applications.

---

# Interview Questions

Try answering without notes.

1. What is HTTPS?
2. HTTPS vs HTTP?
3. Is HTTPS a completely different protocol from HTTP?
4. Where does TLS sit in the networking stack?
5. What does confidentiality mean?
6. What does integrity mean?
7. What does authentication mean?
8. Why is HTTPS more secure than HTTP?
9. What is the default HTTPS port?
10. Does port 443 itself provide encryption?
11. Does HTTPS guarantee that a website is trustworthy?
12. Does HTTPS contain application business logic?
13. What happens before the first HTTPS request is sent?
14. Why is certificate validation important?
15. What is the role of TLS in HTTPS?

---

# Quick Revision

```text
HTTPS
│
├── HTTP
├── TLS
│
├── Confidentiality
├── Integrity
├── Authentication
│
└── Default Port
    └── 443
```

Complete flow:

```text
DNS
 ↓
IP
 ↓
Port 443
 ↓
TCP
 ↓
TLS
 ↓
HTTP
 ↓
Application
```

---

# My Understanding

HTTPS is HTTP communication protected using TLS.

HTTP still defines the request-response semantics, while TLS provides confidentiality, integrity, and authentication for the communication.

Before an HTTPS request is exchanged, the client establishes a connection, performs a TLS handshake, validates the server certificate, and derives shared session keys.

The resulting HTTP communication can then be protected while travelling between the client and server.

---

# Completion Checklist

- [ ] Understand what HTTPS is
- [ ] Understand HTTP vs HTTPS
- [ ] Understand where TLS fits
- [ ] Understand confidentiality
- [ ] Understand integrity
- [ ] Understand authentication
- [ ] Know the default HTTPS port
- [ ] Understand the complete HTTPS request flow
- [ ] Run `curl -v` against an HTTPS site
- [ ] Compare HTTP and HTTPS
- [ ] Explain why HTTPS does not guarantee a website is trustworthy
- [ ] Answer interview questions without notes

---

# References

## Primary

- [MDN — HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS)
- [MDN — Transport Layer Security](https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security)
- [Cloudflare — What is HTTPS?](https://www.cloudflare.com/learning/ssl/what-is-https/)

---

# Related Topics

- [HTTP](http.md)
- [TLS](tls.md)
- [TLS Certificates](certificates.md)
- [TCP](tcp.md)
- SNI
- Authentication
- Cookies
- Reverse Proxy
- Load Balancer

---

[← Previous: TLS Certificates](certificates.md)
