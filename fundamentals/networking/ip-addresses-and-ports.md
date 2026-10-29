# IP Addresses and Ports

> An IP address identifies a network endpoint, while a port identifies a particular service communicating through that endpoint.

---

## What Is an IP Address?

IP stands for **Internet Protocol**.

An IP address is used to identify an endpoint on an IP network so network traffic can be routed toward the correct destination.

Example:

```text
203.0.113.10
```

A simplified mental model:

```text
Domain Name
    ↓
DNS
    ↓
IP Address
    ↓
Network Destination
```

---

## Why Do We Need IP Addresses?

A network needs a way to identify destinations.

Suppose:

```text
Client
    ↓
Send data
    ↓
Which destination?
```

The IP address provides destination information used by the network layer.

Conceptually:

```text
Source IP
    ↓
Network
    ↓
Destination IP
```

---

# IPv4

IPv4 addresses are commonly represented using four decimal numbers.

Example:

```text
192.168.1.10
```

Each section is called an octet.

Conceptually:

```text
192 . 168 . 1 . 10
```

IPv4 provides a 32-bit address space.

For Day 2, you do not need to study binary representation or subnet calculations deeply.

---

# IPv6

IPv6 was introduced partly because the available IPv4 address space is limited.

Example:

```text
2001:db8::1
```

IPv6 provides a much larger address space.

High-level comparison:

| IPv4                  | IPv6                          |
| --------------------- | ----------------------------- |
| 32-bit                | 128-bit                       |
| Dotted decimal        | Hexadecimal notation          |
| Smaller address space | Extremely large address space |

For now, understand the purpose rather than memorizing IPv6 formatting rules.

---

# Public IP Address

A public IP address is globally routable on the public internet, subject to network and firewall configuration.

Conceptually:

```text
Internet
   ↓
Public IP
   ↓
Server / Network
```

Example architecture:

```text
User
  ↓
Internet
  ↓
203.0.113.10
  ↓
Web Server
```

---

# Private IP Address

Private IP addresses are intended for private networks and are not directly globally routed across the public internet.

Common IPv4 private ranges include:

```text
10.0.0.0/8
```

```text
172.16.0.0/12
```

```text
192.168.0.0/16
```

Example:

```text
192.168.1.20
```

may represent a laptop inside a home or office network.

---

## Public vs Private IP

| Public IP                             | Private IP                                      |
| ------------------------------------- | ----------------------------------------------- |
| Globally routable                     | Used inside private networks                    |
| Internet-facing use                   | Internal communication                          |
| Must be globally unique while routed  | May be reused across different private networks |
| Common at network boundaries/services | Common inside LANs, VPCs, containers            |

This distinction becomes very important later for:

- AWS VPC
- subnets
- EC2
- load balancers
- Kubernetes
- Docker networking

---

# Localhost

`localhost` refers to the local computer.

Common IPv4 loopback address:

```text
127.0.0.1
```

So:

```text
http://localhost:3000
```

means:

> Connect to a service running on my own machine on port 3000.

Similarly:

```text
http://127.0.0.1:3000
```

typically refers to the same local machine.

---

## Loopback

Loopback traffic does not need to leave the machine and travel across the external network.

Conceptually:

```text
Application
    ↓
127.0.0.1
    ↓
Same Computer
```

This is extremely useful during local development.

---

# What Is a Port?

A machine can run many network services at the same time.

An IP address identifies the network endpoint.

A port helps distinguish the service/process endpoint being addressed for a transport protocol.

Useful mental model:

```text
IP Address
    ↓
Which machine / endpoint?

Port
    ↓
Which network service?
```

Example:

```text
192.168.1.20:3000
```

Here:

```text
192.168.1.20
      ↓
IP Address

3000
 ↓
Port
```

---

# Why Are Ports Needed?

Imagine one server running:

```text
SSH
HTTP Server
HTTPS Server
PostgreSQL
Redis
Node API
```

They can be differentiated using ports.

Example:

```text
Server
IP: 10.0.0.5
│
├── :22     → SSH
├── :80     → HTTP
├── :443    → HTTPS
├── :3000   → Application
├── :5432   → PostgreSQL
└── :6379   → Redis
```

Without ports, the transport layer would have no standard way to distinguish multiple network services sharing an IP address.

---

# Common Ports

Know these common defaults:

|    Port | Typical Service           |
| ------: | ------------------------- |
|    `22` | SSH                       |
|    `53` | DNS                       |
|    `80` | HTTP                      |
|   `443` | HTTPS                     |
|  `3000` | Common development server |
|  `5432` | PostgreSQL                |
|  `6379` | Redis                     |
| `27017` | MongoDB                   |

> **Important**
>
> These are common/default ports, not strict requirements in every environment.
>
> Many services can be configured to listen on different ports.

---

# IP + Port

An IP address and port commonly appear together:

```text
203.0.113.10:443
```

Conceptually:

```text
203.0.113.10
      ↓
Destination network endpoint

443
 ↓
HTTPS service
```

Another example:

```text
localhost:3000
```

means:

```text
localhost
   ↓
My computer

3000
 ↓
Service listening on port 3000
```

---

# Why URLs Often Do Not Show Ports

When a URL uses a protocol with a default port, the port can usually be omitted.

Example:

```text
http://example.com
```

normally implies:

```text
port 80
```

And:

```text
https://example.com
```

normally implies:

```text
port 443
```

Therefore:

```text
https://example.com
```

and conceptually:

```text
https://example.com:443
```

normally refer to the same default HTTPS port.

---

# Development Example

Suppose locally you run:

```text
React
localhost:5173
```

and:

```text
Node API
localhost:3000
```

Both applications run on:

```text
same machine
```

but use:

```text
different ports
```

Conceptually:

```text
My Laptop
IP: localhost

├── :5173 → React
└── :3000 → Node API
```

This is why the browser can distinguish between the frontend and backend.

---

# DNS + IP + Port + HTTP

Now combine Day 1 and Day 2.

Suppose the browser requests:

```text
https://api.example.com/users
```

The simplified flow is:

```text
Browser
   ↓
api.example.com
   ↓
DNS Lookup
   ↓
203.0.113.10
   ↓
Port 443
   ↓
Server
   ↓
HTTP Request
   ↓
GET /users
```

The roles are different:

```text
DNS
→ Where is the hostname?

IP
→ Which network destination?

Port
→ Which service endpoint?

HTTP
→ What application request/response message is being exchanged?
```

This distinction should become automatic.

---

# MERN Mental Model

Suppose React calls:

```javascript
fetch("https://api.myapp.com/users");
```

Conceptually:

```text
React
   ↓
api.myapp.com
   ↓
DNS
   ↓
IP Address
   ↓
Port 443
   ↓
Node / Express
   ↓
Application Logic
   ↓
MongoDB
```

Day 1 explained the HTTP layer.

Day 2 explains how the client locates and reaches the service.

---

# Can Multiple Applications Use the Same Port?

Normally, two processes cannot bind to the exact same combination of:

```text
IP address
+
port
+
transport protocol
```

at the same time without special operating-system/socket behavior.

For example:

```text
Process A
localhost:3000
```

If another application tries to use:

```text
localhost:3000
```

you may see an error such as:

```text
Address already in use
```

This is a common development issue.

---

# Practical Labs

## Lab 1 — Start a Local Server

Run:

```bash
python3 -m http.server 8000
```

This starts a local HTTP server on:

```text
localhost:8000
```

Open:

```text
http://localhost:8000
```

or:

```bash
curl http://localhost:8000
```

---

## Lab 2 — Identify the Listening Process

Run:

```bash
lsof -i :8000
```

You should see the process listening on port `8000`.

This demonstrates:

```text
Port
 ↓
Listening Process
```

---

## Lab 3 — Try the Wrong Port

While the server is running on:

```text
8000
```

try:

```bash
curl http://localhost:8001
```

If no application is listening on `8001`, the connection should fail.

This demonstrates that:

```text
Correct machine
+
Wrong port
=
Wrong service endpoint
```

---

## Lab 4 — Run Two Services

Start one service on:

```text
8000
```

and another on:

```text
8001
```

For example, in two terminals:

```bash
python3 -m http.server 8000
```

```bash
python3 -m http.server 8001
```

Now:

```text
localhost:8000
```

and:

```text
localhost:8001
```

represent different server processes/services.

---

# Debugging Commands

## Find a Process Using a Port

```bash
lsof -i :3000
```

Useful when you see:

```text
Address already in use
```

---

## Show Network Connections

On macOS/Linux:

```bash
lsof -i -P -n
```

Depending on the operating system, `ss` or `netstat` may also be useful.

---

## Test a Local Service

```bash
curl http://localhost:3000
```

This helps answer:

> Is something actually listening and responding on this port?

---

# Common Problems

## Connection Refused

Possible reasons:

```text
No service running
Wrong port
Service crashed
Wrong IP
Service bound only to another interface
Firewall/network rule
```

Debug:

```text
Is process running?
       ↓
Is correct port listening?
       ↓
Is address correct?
       ↓
Can curl reach it?
```

---

## Port Already in Use

Example:

```text
EADDRINUSE
```

Possible cause:

```text
Another process already owns the port.
```

Check:

```bash
lsof -i :3000
```

Then identify the process before deciding whether it should be stopped.

---

# Common Misunderstandings

## IP Address and Port Are Not the Same

```text
IP
→ destination endpoint/address

Port
→ transport service endpoint
```

---

## localhost Does Not Mean Internet

```text
localhost
```

means the current computer.

It does not mean:

```text
development server somewhere on the internet
```

---

## A Port Does Not Identify a Global Application

Port `3000` on your laptop and port `3000` on another server are unrelated.

For example:

```text
192.168.1.10:3000
```

and:

```text
192.168.1.11:3000
```

represent different endpoints.

---

# Security Considerations

Network services should not expose unnecessary ports.

For example:

```text
Public internet
     ↓
Database port exposed
```

can create significant security risk.

Good infrastructure commonly limits access using:

- firewalls
- security groups
- private networks
- authentication
- least-privilege network rules

Later AWS networking topics will build heavily on this.

---

# Performance Considerations

IP addressing and ports themselves are not usually the main application performance bottleneck.

However network architecture can affect:

- latency
- routing
- number of network hops
- service reachability
- connection establishment
- cross-region communication

These topics will be explored later.

---

# Interview Questions

Try answering these without reading your notes.

1. What is an IP address?
2. Why do networks need IP addresses?
3. IPv4 vs IPv6?
4. Public IP vs private IP?
5. What are the private IPv4 ranges?
6. What is localhost?
7. What does `127.0.0.1` mean?
8. What is loopback?
9. What is a port?
10. Why are ports needed?
11. IP address vs port?
12. What does `localhost:3000` mean?
13. Why is HTTPS normally port 443?
14. Why does HTTP normally use port 80?
15. Can one machine run multiple network services?
16. Can two applications use the same port on the same IP normally?
17. Why might you receive `address already in use`?
18. How would you check which process uses port 3000?
19. Why should database ports usually not be public?
20. Explain DNS → IP → port → HTTP.

---

# Quick Revision

```text
Network Communication
│
├── DNS
│   └── Name → IP
│
├── IP Address
│   └── Network Destination
│
├── Port
│   └── Service Endpoint
│
└── HTTP
    └── Application Request / Response
```

And:

```text
localhost:3000
│         │
│         └── Port
│
└── Local Computer
```

---

# My Understanding

An IP address identifies a destination on an IP network, while a port helps identify a specific service endpoint used by a transport protocol.

A single machine can run many network applications because different services can listen on different ports.

`localhost` refers to the current machine, while public and private IP addresses serve different networking scopes.

When a browser communicates with an application, DNS can first resolve the hostname to an IP address, the connection targets a service port, and HTTP carries the application request and response.

---

# Completion Checklist

- [ ] Understand what an IP address is
- [ ] Understand IPv4 vs IPv6 at a high level
- [ ] Understand public vs private IP
- [ ] Know the private IPv4 ranges
- [ ] Understand localhost
- [ ] Understand loopback
- [ ] Understand what a port is
- [ ] Understand why ports exist
- [ ] Know common ports
- [ ] Understand default HTTP and HTTPS ports
- [ ] Understand IP + port
- [ ] Run a local server on port 8000
- [ ] Use `curl` to access it
- [ ] Use `lsof` to identify the process
- [ ] Try accessing an unused port
- [ ] Explain DNS → IP → port → HTTP without notes

---

# References

## Primary

- [MDN — How the Web Works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)
- [MDN — What Is a URL?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL)
- [IANA — Service Name and Port Number Registry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml)

## Supporting

- [Cloudflare — What Is My IP Address?](https://www.cloudflare.com/learning/dns/glossary/what-is-my-ip-address/)

---

# Related Topics

- [DNS](dns.md)
- [TCP](tcp.md)
- [UDP](udp.md)
- [Sockets](sockets.md)
- NAT
- Firewalls
- [HTTP](http.md)
- TLS
- AWS VPC
- Docker Networking
- Kubernetes Networking

---

[Next: TCP →](tcp.md)
