# DNS

> DNS is the naming system of the internet that translates human-readable domain names into IP addresses.

---

## What Is DNS?

DNS stands for **Domain Name System**.

Humans prefer names such as:

```text
google.com
github.com
api.example.com
```

Computers communicate using network addresses such as:

```text
142.250.183.14
```

DNS allows applications to translate:

```text
Domain Name
     ↓
DNS
     ↓
IP Address
```

Example:

```text
example.com
     ↓
93.184.216.34
```

DNS therefore separates a human-friendly application name from the network address where the service is reachable.

---

## Why Does DNS Exist?

Without DNS, users would need to remember IP addresses for every service.

Instead of:

```text
https://142.250.x.x
```

we can use:

```text
https://google.com
```

DNS also allows infrastructure behind a domain to change without requiring users to learn a new address.

For example:

```text
api.example.com
       ↓
Old Server IP

Later:

api.example.com
       ↓
New Server IP
```

The application name can remain the same even when infrastructure changes.

---

## Mental Model

Think of DNS as a directory:

```text
Name
 ↓
Lookup
 ↓
Network Address
```

A simplified analogy:

```text
Contact Name
     ↓
Phone Contacts
     ↓
Phone Number
```

DNS works similarly:

```text
Domain Name
     ↓
DNS
     ↓
IP Address
```

---

## High-Level DNS Resolution

Suppose a browser wants to access:

```text
https://example.com
```

Before connecting to the server, it needs an IP address.

A simplified lookup may look like:

```text
Browser
   ↓
Browser DNS Cache
   ↓
Operating System Cache
   ↓
DNS Resolver
   ↓
DNS Infrastructure
   ↓
IP Address Returned
```

The browser can then use the returned address to continue connecting to the server.

---

## DNS Resolver

A **DNS resolver** is responsible for finding the DNS answer on behalf of the client.

The application normally does not manually query every DNS server.

Instead:

```text
Application
    ↓
Resolver
    ↓
DNS lookup process
    ↓
Answer
```

The resolver may already have the answer cached.

If not, it may query other DNS servers.

---

## DNS Hierarchy

At a high level, DNS is hierarchical.

A simplified lookup can involve:

```text
Resolver
   ↓
Root DNS
   ↓
Top-Level Domain DNS
   ↓
Authoritative DNS
   ↓
DNS Record
```

For:

```text
www.example.com
```

the hierarchy conceptually includes:

```text
.
↓
.com
↓
example.com
↓
www.example.com
```

Do not memorize the complete DNS resolution algorithm yet.

The important idea is:

> DNS is distributed rather than being controlled by one global server.

---

## Root DNS

Root DNS servers help direct a resolver toward the correct top-level domain servers.

For example:

```text
example.com
    ↓
Root
    ↓
.com nameservers
```

The root does not normally provide the final application IP directly.

---

## Top-Level Domain

A Top-Level Domain, or **TLD**, is the final part of a domain.

Examples:

```text
.com
.org
.in
.net
.dev
```

For:

```text
example.com
```

the TLD is:

```text
.com
```

---

## Authoritative DNS Server

The authoritative DNS server contains authoritative DNS records for a domain.

Conceptually:

```text
Where is api.example.com?
           ↓
Authoritative DNS
           ↓
203.0.113.10
```

The authoritative server provides the actual DNS record configured for the domain.

---

# DNS Records

DNS supports different record types for different purposes.

For Day 2, understand these records:

| Record  | Purpose                                  |
| ------- | ---------------------------------------- |
| `A`     | Name → IPv4 address                      |
| `AAAA`  | Name → IPv6 address                      |
| `CNAME` | Alias → another domain name              |
| `MX`    | Mail server information                  |
| `TXT`   | Arbitrary text/configuration information |
| `NS`    | Nameserver responsible for a domain      |

---

## A Record

An `A` record maps a domain name to an IPv4 address.

Example:

```text
api.example.com
        ↓
A Record
        ↓
203.0.113.10
```

Conceptually:

```text
api.example.com.   A   203.0.113.10
```

---

## AAAA Record

An `AAAA` record maps a domain name to an IPv6 address.

Example:

```text
example.com
    ↓
AAAA
    ↓
2001:db8::1
```

---

## CNAME Record

A `CNAME` record makes one hostname an alias of another hostname.

Example:

```text
www.example.com
       ↓
CNAME
       ↓
example.com
```

The target name can then resolve to its own address records.

Useful mental model:

```text
Alias
  ↓
Real DNS Name
  ↓
IP Address
```

---

## MX Record

An `MX` record specifies mail servers for a domain.

Example conceptually:

```text
example.com
    ↓
MX
    ↓
mail.example.com
```

It is mainly related to email delivery.

---

## TXT Record

A `TXT` record stores text associated with a domain.

Common uses include:

- domain verification
- email-security configuration
- service ownership verification
- metadata required by external services

---

## NS Record

An `NS` record identifies the nameservers responsible for a DNS zone/domain.

Conceptually:

```text
example.com
    ↓
NS
    ↓
ns1.provider.com
```

---

# DNS Caching

DNS lookups are cached because repeating the entire lookup process for every request would be inefficient.

Caching can occur at multiple levels:

```text
Browser
   ↓
Operating System
   ↓
DNS Resolver
   ↓
Other DNS infrastructure
```

If the answer is already cached:

```text
Domain
   ↓
Cache Hit
   ↓
IP Returned Quickly
```

This improves performance and reduces DNS traffic.

---

## TTL

TTL stands for **Time To Live**.

It indicates how long a DNS answer may be cached before it should be considered stale.

Example:

```text
api.example.com
A
203.0.113.10
TTL = 300
```

This means the answer may be cached for approximately:

```text
300 seconds
```

After the TTL expires, the resolver may need to refresh the record.

---

## Why DNS Changes May Not Appear Immediately

Suppose:

```text
Old record:
api.example.com → 203.0.113.10
```

You change it to:

```text
New record:
api.example.com → 203.0.113.20
```

Some resolvers may still have the old value cached.

So temporarily:

```text
User A
 ↓
Old cached IP

User B
 ↓
New IP
```

Eventually the old cached records expire.

---

## Advantages of DNS Caching

DNS caching provides:

- faster lookups
- reduced DNS traffic
- lower latency
- reduced load on authoritative DNS servers

---

## Trade-Offs of DNS Caching

Caching can also cause:

- temporary use of old records
- delayed infrastructure changes
- harder debugging during DNS migrations

This is a common example of a system-design trade-off:

```text
Performance
   vs
Freshness
```

---

# DNS in a Web Request

Suppose the user enters:

```text
https://api.example.com/users
```

The high-level flow is:

```text
Browser
   ↓
Parse hostname
   ↓
api.example.com
   ↓
DNS lookup
   ↓
203.0.113.10
   ↓
Connect to server
   ↓
Send HTTP request
```

DNS happens before the browser can normally send the HTTP request to the destination server.

---

# MERN Example

Suppose a React application calls:

```javascript
fetch("https://api.myapp.com/users");
```

Conceptually:

```text
React
  ↓
api.myapp.com
  ↓
DNS Lookup
  ↓
Server IP
  ↓
Connection
  ↓
HTTP Request
  ↓
Node / Express
```

The React application normally does not need to know the server IP directly.

It only needs the hostname.

---

# Practical Labs

## Lab 1 — Resolve a Domain

Run:

```bash
nslookup google.com
```

Observe:

- requested domain
- DNS server
- returned IP address

Then:

```bash
nslookup github.com
```

Compare the results.

---

## Lab 2 — Use dig

On macOS/Linux:

```bash
dig google.com
```

Look for the:

```text
ANSWER SECTION
```

Do not try to understand every field today.

Identify:

- record type
- TTL
- returned value

---

## Lab 3 — Query an A Record

Run:

```bash
dig A github.com
```

Look for IPv4 addresses.

---

## Lab 4 — Query an AAAA Record

Run:

```bash
dig AAAA google.com
```

Look for IPv6 addresses.

---

## Lab 5 — Query Nameservers

Run:

```bash
dig NS github.com
```

Observe which nameservers are responsible for the domain.

---

## Lab 6 — Query Mail Records

Run:

```bash
dig MX google.com
```

Observe the configured mail servers.

---

# Common Problems

DNS problems commonly appear as:

```text
domain not resolving
wrong IP returned
old IP still cached
incorrect record type
missing record
DNS server unavailable
```

A useful debugging flow:

```text
Application cannot reach domain
        ↓
Does domain resolve?
        ↓
Check dig / nslookup
        ↓
Correct IP?
        ↓
Check DNS record
        ↓
Check TTL/cache
```

---

# Debugging Commands

Useful commands:

```bash
nslookup example.com
```

```bash
dig example.com
```

```bash
dig A example.com
```

```bash
dig AAAA example.com
```

```bash
dig CNAME www.example.com
```

```bash
dig NS example.com
```

```bash
dig MX example.com
```

---

# Security Considerations

DNS is an important part of application security.

Potential risks include:

- DNS spoofing
- DNS hijacking
- incorrect domain configuration
- malicious DNS records
- expired domains
- incorrect DNS ownership

Later topics will cover secure DNS concepts in more depth.

---

# Performance Considerations

DNS performance can affect application startup and request latency.

Important factors include:

- DNS caching
- TTL configuration
- resolver performance
- number of DNS lookups
- geographic distribution of DNS infrastructure

For most applications, DNS caching greatly reduces repeated lookup cost.

---

# Interview Questions

Try answering without reading the notes.

1. What is DNS?
2. Why do we need DNS?
3. What problem does DNS solve?
4. What happens when a domain needs to be resolved?
5. What is a DNS resolver?
6. What is an authoritative DNS server?
7. What is an `A` record?
8. What is an `AAAA` record?
9. What is a `CNAME` record?
10. `A` vs `CNAME`?
11. What is an `MX` record?
12. What is an `NS` record?
13. What is DNS TTL?
14. Why does DNS use caching?
15. Why can DNS changes take time to appear?
16. Does DNS itself send the HTTP request?
17. Where does DNS fit in the browser request lifecycle?
18. Can one domain resolve to multiple IP addresses?
19. Why is DNS considered distributed?
20. How would you troubleshoot a domain that is not resolving?

---

# Quick Revision

```text
DNS
│
├── Domain → Network Address
│
├── Resolver
│
├── Root
│
├── TLD
│
├── Authoritative DNS
│
├── Records
│   ├── A
│   ├── AAAA
│   ├── CNAME
│   ├── MX
│   ├── TXT
│   └── NS
│
└── Caching
    └── TTL
```

---

# My Understanding

DNS provides a distributed naming system that allows applications to use human-readable domain names instead of directly using IP addresses.

When a client wants to communicate with a hostname, a DNS resolver obtains the appropriate DNS record, often using cached information.

The returned network address allows the client to continue establishing a connection to the target service.

DNS does not execute the HTTP request itself. It helps the client determine where the target service can be reached.

---

# Completion Checklist

- [ ] Understand what DNS is
- [ ] Understand why DNS exists
- [ ] Understand DNS resolution at a high level
- [ ] Understand resolver, root, TLD and authoritative DNS
- [ ] Understand A records
- [ ] Understand AAAA records
- [ ] Understand CNAME records
- [ ] Understand MX, TXT and NS records
- [ ] Understand DNS caching
- [ ] Understand TTL
- [ ] Run `nslookup`
- [ ] Run `dig`
- [ ] Inspect an A record
- [ ] Inspect an AAAA record
- [ ] Inspect NS records
- [ ] Explain where DNS fits before HTTP
- [ ] Answer interview questions without notes

---

# References

## Primary

- [Cloudflare Learning Center — What is DNS?](https://www.cloudflare.com/learning/dns/what-is-dns/)
- [Cloudflare Learning Center — DNS Records](https://www.cloudflare.com/learning/dns/dns-records/)
- [MDN — How the Web Works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)

## Deeper Reference

- [ICANN — DNS](https://www.icann.org/resources/pages/dns-2012-02-25-en)

---

# Related Topics

- [IP Addresses and Ports](ip-addresses-and-ports.md)
- [TCP](tcp.md)
- [UDP](udp.md)
- [HTTP](http.md)
- TLS
- CDN
- Load Balancing
- AWS Route 53

---

[← Previous: Network Sockets](sockets.md) · [Next: HTTP →](http.md)
