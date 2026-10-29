# TLS Certificates

> A TLS certificate binds an identity, such as a domain name, to a public key through a cryptographically verifiable trust chain.

---

## What Is a TLS Certificate?

A TLS certificate is a digital document used during secure communication to help prove the identity of a server.

A certificate typically contains information such as:

```text
Domain / Identity
Public Key
Issuer
Validity Period
Digital Signature
Certificate Metadata
```

Conceptually:

```text
Certificate
│
├── example.com
├── Public Key
├── Issuer
├── Valid From
├── Valid Until
└── Digital Signature
```

---

## Why Do Certificates Exist?

Encryption alone does not prove who is on the other side.

Suppose:

```text
Client
   ↓
Encrypted Connection
   ↓
Unknown Server
```

The connection could be encrypted but still be connected to an attacker.

Certificates help answer:

> Am I communicating with the server authorized for this domain?

Conceptually:

```text
example.com
    ↓
Certificate
    ↓
Public Key + Identity
    ↓
Trusted Signature Chain
```

---

# Public Key

The certificate contains a public key.

This public key can safely be shared.

The corresponding private key is held by the server/operator and must remain secret.

Conceptually:

```text
Certificate
   ↓
Public Key

Server
   ↓
Private Key
```

The certificate does **not** contain the private key.

---

# Private Key

The private key is sensitive secret material.

It must be protected carefully.

If an attacker obtains a server private key, the consequences can be severe depending on the deployment and cryptographic setup.

Never:

```text
commit private keys to Git
send private keys in chat/email
store private keys in public repos
```

---

# Certificate Authority

A **Certificate Authority**, or CA, is an entity trusted to issue/sign certificates under a defined trust model.

Examples of certificate authorities exist in browser and operating-system trust ecosystems.

High-level model:

```text
Browser / OS Trust Store
        ↓
Trusted Root CA
        ↓
Certificate Chain
        ↓
Server Certificate
```

---

# Why Do Browsers Trust a CA?

Browsers and operating systems maintain a collection of trusted root certificates.

These trusted roots form the starting point for certificate validation.

Conceptually:

```text
Browser already trusts
Root CA
   ↓
Root trusts/signs
Intermediate CA
   ↓
Intermediate signs
Server Certificate
```

If the chain is valid, the browser can establish trust in the server certificate.

---

# Root CA

A root CA sits at the top of a certificate trust hierarchy.

Its certificate is generally self-signed and explicitly trusted by an operating system, browser, or application trust store.

Conceptually:

```text
Trusted Root CA
       ↓
Intermediate CA
       ↓
Server Certificate
```

Root private keys are especially sensitive.

---

# Intermediate CA

Certificate authorities commonly use intermediate CAs rather than signing every server certificate directly with a root key.

Conceptually:

```text
Root CA
   ↓
signs
   ↓
Intermediate CA
   ↓
signs
   ↓
example.com
```

This improves operational security by reducing direct use of the root key.

---

# Certificate Chain

A certificate chain connects a server certificate back to a trusted root.

Example:

```text
example.com Certificate
        ↓
Intermediate CA
        ↓
Root CA
```

The server commonly sends:

```text
Server Certificate
+
Intermediate Certificate(s)
```

The client typically already has trusted root certificates.

---

# Certificate Validation

When a browser receives a certificate, it performs several checks.

High-level validation includes:

```text
Certificate received
       ↓
Hostname matches?
       ↓
Currently valid?
       ↓
Signatures valid?
       ↓
Trusted chain?
       ↓
Accept
```

---

# Hostname Validation

Suppose the certificate covers:

```text
api.example.com
```

but the browser requests:

```text
shop.example.com
```

If the certificate does not cover the requested hostname, validation fails.

Conceptually:

```text
Requested Host
      ↓
Certificate Identity
      ↓
Match?
```

---

# Subject Alternative Name

Modern certificates commonly specify valid hostnames through the **Subject Alternative Name**, or SAN, extension.

Example:

```text
SAN:
example.com
www.example.com
api.example.com
```

The browser checks whether the requested hostname is covered by the certificate.

---

# Wildcard Certificates

A wildcard certificate may cover multiple subdomains.

Example:

```text
*.example.com
```

can commonly cover names such as:

```text
api.example.com
shop.example.com
```

but wildcard matching has specific rules.

Do not assume a wildcard matches every possible nested hostname.

---

# Certificate Validity Period

Certificates have validity dates.

Conceptually:

```text
Not Before
   ↓
Certificate Valid
   ↓
Not After
```

Example:

```text
Valid From:
2026-01-01

Valid Until:
2026-04-01
```

Outside that period, clients may reject the certificate.

---

# Expired Certificates

If a certificate expires:

```text
Current Date
    ↓
After Not After
    ↓
Certificate Invalid
```

Browsers may display warnings or block normal access.

This is why production certificate renewal must be automated and monitored.

---

# Digital Signature

The issuing CA digitally signs certificate information.

The client can verify the signature using the issuer's public key.

Conceptually:

```text
Certificate Data
      ↓
CA Signature
      ↓
Client verifies
      ↓
Issuer Public Key
```

This helps detect unauthorized certificate modification.

---

# Certificate Chain Validation

Suppose:

```text
Server Certificate
signed by
Intermediate CA
```

The client verifies:

```text
Server Certificate Signature
        ↓
Intermediate Public Key
```

Then:

```text
Intermediate Certificate
signed by
Root CA
```

The client verifies:

```text
Intermediate Signature
        ↓
Root Public Key
```

If the root is trusted, the chain can be trusted.

---

# Self-Signed Certificates

A self-signed certificate is signed using its own private key instead of being chained to a generally trusted CA.

Conceptually:

```text
Server Certificate
      ↓
signed by itself
```

It can still provide encryption.

However, browsers generally do not trust it automatically unless the certificate/root has been explicitly installed into the trust store.

Self-signed certificates are often used for:

- development
- internal systems
- test environments

when managed appropriately.

---

# Certificate Does Not Encrypt Traffic by Itself

A certificate primarily provides:

```text
Identity
+
Public Key Information
+
Trust Chain
```

TLS then uses cryptographic protocols to establish secure session keys.

So avoid thinking:

```text
Certificate
→ encrypts all HTTP traffic
```

Better:

```text
Certificate
→ helps authenticate server
→ provides public-key identity
→ participates in TLS security
```

---

# SNI and Certificates

Suppose one IP hosts:

```text
api.example.com
shop.example.com
blog.example.com
```

The TLS server may have different certificates for each hostname.

SNI allows the client to specify:

```text
I want api.example.com
```

during TLS setup.

The server can then select the corresponding certificate.

---

# Practical Labs

## Lab 1 — Inspect a Server Certificate

Run:

```bash
openssl s_client -connect example.com:443 -servername example.com
```

Look for:

```text
Certificate chain
subject
issuer
TLS version
```

---

## Lab 2 — Extract Certificate Information

Run:

```bash
openssl s_client \
  -connect example.com:443 \
  -servername example.com \
  </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates
```

Look for:

```text
subject
issuer
notBefore
notAfter
```

---

## Lab 3 — Inspect SAN Values

Run:

```bash
openssl s_client \
  -connect example.com:443 \
  -servername example.com \
  </dev/null 2>/dev/null \
  | openssl x509 -noout -ext subjectAltName
```

Observe the hostnames covered by the certificate.

---

## Lab 4 — Inspect Certificate in Browser

Open an HTTPS website.

Inspect certificate/security information.

Identify:

- domain
- issuer
- validity dates
- certificate chain
- SAN entries if available

---

# Common Problems

## Expired Certificate

Symptom:

```text
Browser security warning
```

Cause:

```text
Current date > certificate expiry date
```

Fix:

```text
Renew and deploy a valid certificate.
```

---

## Hostname Mismatch

Example:

```text
Certificate:
api.example.com

Request:
shop.example.com
```

If the certificate does not cover `shop.example.com`, validation fails.

---

## Missing Intermediate Certificate

A server may provide an incomplete chain.

Conceptually:

```text
Server Certificate
      ↓
Missing Intermediate
      ↓
Root
```

Some clients may fail to construct a trusted chain.

---

## Untrusted CA

If the certificate ultimately chains to a root the client does not trust:

```text
Certificate
   ↓
Unknown Root
   ↓
Validation Failure
```

---

# Debugging

Useful command:

```bash
openssl s_client -connect example.com:443 -servername example.com
```

Check:

```text
Hostname
Issuer
Validity dates
Chain
Verification result
```

Useful flow:

```text
TLS failing
   ↓
Correct hostname?
   ↓
Certificate expired?
   ↓
SAN contains hostname?
   ↓
Chain complete?
   ↓
Root trusted?
   ↓
TLS configuration compatible?
```

---

# Security Considerations

Private keys must be protected.

Do not:

- commit them to Git
- include them in Docker images
- store them in frontend code
- send them through unsecured communication
- log them

Production keys should be managed using appropriate secret-management and access-control systems.

Certificate renewal should be automated where possible.

Monitor expiration proactively.

---

# Performance Considerations

Certificates affect TLS handshake size and validation.

Potential considerations include:

- excessively long certificate chains
- unnecessary SAN entries
- certificate validation latency
- handshake frequency

These are usually secondary compared with correct security configuration.

---

# Common Misunderstandings

## Certificate Is Not the Private Key

```text
Certificate
→ public information

Private Key
→ secret
```

---

## Certificate Does Not Prove a Business Is Safe

It proves cryptographic identity/trust according to the certificate ecosystem.

It does not guarantee the website is morally or commercially trustworthy.

---

## Self-Signed Does Not Mean Unencrypted

A self-signed certificate can still enable encrypted TLS communication.

The issue is automatic trust/authentication.

---

## Certificate Expiration Is Important

An otherwise correctly configured service can fail for clients if its certificate expires.

Certificate lifecycle management is an operational responsibility.

---

# Interview Questions

1. What is a TLS certificate?
2. Why do we need certificates?
3. What information does a certificate contain?
4. Does a certificate contain the server's private key?
5. What is a Certificate Authority?
6. What is a root CA?
7. What is an intermediate CA?
8. Why use intermediate CAs?
9. What is a certificate chain?
10. How does a browser validate a certificate?
11. What is hostname validation?
12. What is SAN?
13. What is a wildcard certificate?
14. What happens when a certificate expires?
15. What is a digital signature?
16. How does a CA signature help establish trust?
17. What is a self-signed certificate?
18. Can a self-signed certificate still encrypt traffic?
19. Why do browsers warn about self-signed certificates?
20. What happens if an intermediate certificate is missing?
21. Why must private keys remain secret?
22. How does SNI relate to certificates?
23. Does HTTPS guarantee that a website is trustworthy?
24. How would you debug a TLS certificate issue?

---

# Quick Revision

```text
TLS Certificate
│
├── Identity
├── Public Key
├── Issuer
├── Validity Period
├── Digital Signature
│
└── Trust Chain
    ├── Server Certificate
    ├── Intermediate CA
    └── Root CA
```

Validation:

```text
Hostname
   +
Validity
   +
Signature
   +
Trusted Chain
   ↓
Certificate Accepted
```

---

# My Understanding

A TLS certificate binds a server identity, such as a domain name, to a public key.

The certificate is signed through a certificate-authority trust chain that a browser can validate against trusted root certificates.

During TLS setup, the browser checks factors such as the hostname, validity period, signatures, and certificate chain.

The certificate helps authenticate the server, while TLS derives session keys that protect the actual application traffic.

---

# Completion Checklist

- [ ] Understand what a TLS certificate is
- [ ] Understand why certificates exist
- [ ] Understand public vs private key
- [ ] Understand Certificate Authorities
- [ ] Understand root CAs
- [ ] Understand intermediate CAs
- [ ] Understand certificate chains
- [ ] Understand hostname validation
- [ ] Understand SAN
- [ ] Understand wildcard certificates
- [ ] Understand validity dates
- [ ] Understand digital signatures
- [ ] Understand self-signed certificates
- [ ] Inspect a certificate using OpenSSL
- [ ] Inspect certificate dates
- [ ] Inspect SAN entries
- [ ] Inspect browser certificate information
- [ ] Answer interview questions without notes

---

# References

## Primary

- [MDN — HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS)
- [Cloudflare — What is an SSL Certificate?](https://www.cloudflare.com/learning/ssl/what-is-an-ssl-certificate/)
- [Cloudflare — Certificate Authority](https://www.cloudflare.com/learning/ssl/what-is-a-certificate-authority/)

## Deeper Reference

- [RFC 5280 — Internet X.509 PKI Certificate Profile](https://www.rfc-editor.org/rfc/rfc5280)

---

# Related Topics

- [TLS](tls.md)
- [HTTPS](https.md)
- Public-Key Cryptography
- Certificate Authority
- SNI
- Reverse Proxy
- TLS Termination
- AWS Certificate Manager

---

[← Previous: TLS](tls.md) · [Next: HTTPS →](https.md)
