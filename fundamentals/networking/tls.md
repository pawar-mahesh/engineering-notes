# TLS

> TLS is a security protocol that protects application communication using authentication, encryption, and integrity mechanisms.

**Status:** 🟡 Learning  
**Last reviewed:** 2026-10-23  
**Confidence:** Beginner

---

## What Is TLS?

TLS stands for:

**Transport Layer Security**

TLS provides security for application communication over a network.

In HTTPS:

```text
HTTP
 ↓
TLS
 ↓
TCP
 ↓
IP
```

TLS is not limited to HTTP.

Other application protocols can also use TLS.

---

## Why Does TLS Exist?

A network path can involve multiple systems:

```text
Client
   ↓
Router
   ↓
ISP
   ↓
Internet Infrastructure
   ↓
Server
```

Without cryptographic protection, communication could potentially be:

- observed
- modified
- impersonated

TLS addresses these risks by providing:

```text
Confidentiality
Integrity
Authentication
```

---

# Confidentiality

Confidentiality protects data from unauthorized reading.

Conceptually:

```text
Plaintext
   ↓
Encrypt using session key
   ↓
Ciphertext
   ↓
Network
   ↓
Decrypt
   ↓
Plaintext
```

The network carries protected data rather than the original plaintext.

---

# Integrity

Integrity ensures that protected data cannot be modified unnoticed.

If encrypted traffic is changed in transit, cryptographic integrity mechanisms allow the receiver to detect that the data is no longer valid.

---

# Authentication

Authentication allows a client to verify the identity of the server.

TLS commonly uses certificates for server authentication.

Conceptually:

```text
Server
   ↓
Certificate
   ↓
Client validates identity
```

---

# Symmetric Encryption

Symmetric cryptography uses the same shared secret key for encryption and decryption.

Conceptually:

```text
Shared Secret Key
      ↓
    Encrypt
      ↓
  Ciphertext
      ↓
    Decrypt
      ↓
Shared Secret Key
```

Advantages:

- computationally efficient
- suitable for large amounts of data

Challenge:

> How do two parties securely establish the shared key?

TLS solves this during the handshake.

---

# Asymmetric Cryptography

Asymmetric cryptography uses a key pair:

```text
Public Key
Private Key
```

The public key can be shared.

The private key must remain secret.

Conceptually:

```text
Public Key
     ↕
Private Key
```

The keys are mathematically related.

TLS uses public-key cryptography primarily for:

- authentication
- digital signatures
- key-establishment mechanisms

depending on the TLS version and negotiated algorithms.

---

# Why TLS Uses Both

Public-key cryptography is useful for authentication and securely establishing shared secrets.

Symmetric cryptography is much more efficient for bulk traffic.

Therefore:

```text
TLS Handshake
     ↓
Public-Key / Key-Agreement Operations
     ↓
Shared Session Keys
     ↓
Symmetric Protection
     ↓
Application Traffic
```

> **Important**
>
> TLS does not normally encrypt every application byte using the server's private key.

That is a common misunderstanding.

---

# TLS Handshake

The TLS handshake establishes secure communication before protected application traffic is exchanged.

A simplified mental model:

```text
Client                         Server
  |                              |
  | ------ ClientHello ------->  |
  |                              |
  | <----- ServerHello --------  |
  | <----- Certificate --------  |
  |                              |
  |  Validate Certificate        |
  |                              |
  | <---- Key Agreement ------>  |
  |                              |
  |    Shared Keys Derived       |
  |                              |
  | ==== Protected Traffic ====  |
```

Actual TLS 1.3 messages and ordering are more detailed.

For initial learning, understand the purpose rather than memorizing packets.

---

# ClientHello

The client begins the TLS handshake by sending a `ClientHello`.

It can include information such as:

- supported TLS versions
- cryptographic algorithm options
- key-agreement information
- extensions
- server name information

Mental model:

```text
Client:
Here is what I support.
```

---

# ServerHello

The server responds with a `ServerHello`.

It selects compatible connection parameters from what the client supports.

Simplified:

```text
Client supports:
A
B
C

Server chooses:
B
```

The server also participates in key agreement and provides authentication information.

---

# Certificate Exchange

The server normally provides a certificate chain.

The client validates it.

Conceptually:

```text
Server Certificate
       ↓
Hostname valid?
       ↓
Date valid?
       ↓
Trusted chain?
       ↓
Signature valid?
       ↓
Continue handshake
```

If validation fails, the connection may be rejected or the user may receive a security warning.

---

# Key Agreement

The client and server perform cryptographic operations allowing both sides to derive shared secrets.

Modern TLS commonly uses ephemeral Diffie-Hellman-style key exchange.

At this stage, understand only the result:

```text
Client
   +
Server
   ↓
Shared Session Secrets
```

The secrets are not simply transmitted as plaintext across the network.

---

# Session Keys

After the handshake, both sides derive session keys.

These keys are used to protect application data.

Conceptually:

```text
TLS Handshake
      ↓
Session Keys
      ↓
HTTP Request
      ↓
Protected Data
      ↓
Network
```

Session keys are efficient for ongoing communication.

---

# TLS and HTTP

TLS does not understand business concepts such as:

```text
GET /users
POST /orders
404 Not Found
```

Those belong to HTTP.

TLS protects the bytes representing those messages.

Conceptually:

```text
HTTP
→ application semantics

TLS
→ security

TCP
→ reliable transport

IP
→ routing
```

---

# SNI

SNI stands for:

**Server Name Indication**

A single server or IP address can host multiple HTTPS domains.

Example:

```text
203.0.113.10

├── api.example.com
├── shop.example.com
└── blog.example.com
```

The server needs to know which hostname the client wants so it can present the appropriate certificate.

The client can provide the server name during TLS setup.

Conceptually:

```text
Client:
I want api.example.com
        ↓
Server:
Use certificate for api.example.com
```

---

# Why SNI Is Useful

Without hostname information, a server hosting many HTTPS domains on one address would have difficulty choosing the correct certificate before HTTP begins.

Remember:

```text
TLS handshake
happens before
HTTP Host processing
```

SNI helps solve this.

---

# TLS 1.2 vs TLS 1.3

At a high level:

TLS 1.3 simplifies and modernizes the handshake compared with TLS 1.2.

Benefits include:

- removal of outdated algorithms
- fewer handshake round trips in common cases
- modern cryptographic defaults
- improved security design

Do not memorize detailed packet flows yet.

For now:

```text
TLS 1.3
→ newer
→ simpler
→ stronger defaults
→ more efficient handshake
```

---

# Practical Labs

## Lab 1 — Inspect TLS with curl

Run:

```bash
curl -v https://example.com
```

Look for TLS-related output.

Try to identify:

```text
TCP Connection
     ↓
TLS Negotiation
     ↓
HTTP
```

---

## Lab 2 — Use OpenSSL

Run:

```bash
openssl s_client -connect example.com:443 -servername example.com
```

Look for:

- negotiated TLS version
- certificate chain
- certificate subject
- issuer
- connection details

---

## Lab 3 — Check Negotiated TLS Version

Depending on your OpenSSL version:

```bash
openssl s_client -connect example.com:443 -servername example.com
```

Look for output similar to:

```text
Protocol
Cipher
```

Do not memorize cipher names yet.

---

# Common Problems

TLS failures may be caused by:

```text
Expired certificate
Hostname mismatch
Unsupported TLS version
Untrusted issuer
Incomplete certificate chain
Incorrect server configuration
Clock/time problems
```

A useful debugging flow:

```text
Can TCP connect?
      ↓
Does TLS handshake start?
      ↓
Certificate received?
      ↓
Hostname valid?
      ↓
Dates valid?
      ↓
Chain trusted?
      ↓
Compatible TLS algorithms?
```

---

# Security Considerations

Important TLS practices include:

- use supported modern TLS versions
- disable deprecated protocols
- protect private keys
- use valid certificates
- validate certificates correctly
- do not bypass certificate verification in production
- rotate keys/certificates appropriately
- keep TLS libraries patched

---

# Performance Considerations

TLS introduces:

- handshake latency
- cryptographic computation

Performance can be improved using:

- connection reuse
- TLS session resumption
- modern TLS versions
- efficient certificate chains
- appropriately configured infrastructure

For production systems, security should not be disabled merely to remove TLS overhead.

---

# Common Misunderstandings

## TLS Is Not HTTP

TLS provides security.

HTTP provides application semantics.

---

## Private Key Is Not Shared

The server's private key must remain secret.

It is not sent to clients during normal TLS operation.

---

## TLS Does Not Encrypt Everything with the Private Key

TLS establishes shared session keys and then uses efficient symmetric protection for application traffic.

---

## TCP Does Not Provide TLS Security

TCP provides reliable transport.

TLS provides cryptographic security.

---

# Interview Questions

1. What is TLS?
2. Why does TLS exist?
3. What security properties does TLS provide?
4. What is confidentiality?
5. What is integrity?
6. What is authentication?
7. Symmetric vs asymmetric cryptography?
8. Why does TLS use symmetric encryption for application data?
9. What is a public key?
10. What is a private key?
11. What is the TLS handshake?
12. What is ClientHello?
13. What is ServerHello?
14. What happens during certificate validation?
15. What is key agreement?
16. What are session keys?
17. Why aren't session keys simply sent in plaintext?
18. What is SNI?
19. Why is SNI needed?
20. TLS 1.2 vs TLS 1.3 at a high level?
21. Does TLS provide business logic?
22. Does TLS require HTTP?
23. Does TCP provide encryption?
24. Where does TLS fit in the networking stack?

---

# Quick Revision

```text
TLS
│
├── Confidentiality
├── Integrity
├── Authentication
│
├── Handshake
│   ├── ClientHello
│   ├── ServerHello
│   ├── Certificate
│   └── Key Agreement
│
├── Session Keys
│
└── Protected Application Data
```

---

# My Understanding

TLS is a security protocol that protects communication between applications over a network.

It authenticates the server using certificates, performs cryptographic key agreement, and derives shared session keys.

Those session keys are then used to efficiently protect application traffic using symmetric cryptography.

In HTTPS, TLS sits between HTTP and TCP and protects HTTP communication without changing HTTP's application semantics.

---

# Completion Checklist

- [ ] Understand what TLS is
- [ ] Understand why TLS exists
- [ ] Understand confidentiality
- [ ] Understand integrity
- [ ] Understand authentication
- [ ] Understand symmetric encryption
- [ ] Understand asymmetric cryptography
- [ ] Understand why TLS uses both
- [ ] Understand the TLS handshake
- [ ] Understand ClientHello
- [ ] Understand ServerHello
- [ ] Understand key agreement
- [ ] Understand session keys
- [ ] Understand SNI
- [ ] Understand TLS 1.2 vs TLS 1.3 at a high level
- [ ] Inspect TLS using curl
- [ ] Inspect TLS using OpenSSL
- [ ] Answer interview questions without notes

---

# References

## Primary

- [MDN — Transport Layer Security](https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security)
- [Cloudflare — What is TLS?](https://www.cloudflare.com/learning/ssl/transport-layer-security-tls/)
- [Cloudflare — TLS Handshake](https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/)

## Deeper Reference

- [RFC 8446 — TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446)

---

# Related Topics

- [HTTPS](https.md)
- [TLS Certificates](certificates.md)
- [TCP](tcp.md)
- SNI
- Public-Key Cryptography
- Encryption
- Reverse Proxy
- TLS Termination

---

[← Previous: HTTP](http.md) · [Next: TLS Certificates →](certificates.md)
