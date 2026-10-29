# Network Sockets

> A network socket is an application-facing abstraction used to send and receive data through transport protocols such as TCP or UDP.

---

## What Is a Socket?

Applications need an interface for communicating through the operating system's networking stack.

A **socket** provides that interface.

Conceptually:

```text
Application
   ↓
Socket API
   ↓
TCP / UDP
   ↓
IP
   ↓
Network
```

The socket allows an application to send and receive network data without manually implementing low-level packet transmission.

---

## Why Do Sockets Exist?

Imagine writing a Node server.

Your application needs to:

- listen for incoming network traffic
- accept client connections
- send data
- receive data
- close communication

Sockets provide operating-system abstractions for these operations.

Without a socket API, every application would have to interact directly with low-level networking mechanisms.

---

# Endpoint Mental Model

A network communication endpoint commonly involves:

```text
IP Address
+
Port
+
Transport Protocol
```

A TCP connection can be identified by information such as:

```text
Source IP
Source Port
Destination IP
Destination Port
Protocol
```

Example:

```text
Client
192.168.1.10:53122

        ↓ TCP

Server
203.0.113.20:443
```

---

# Client Socket

A client creates a socket and uses it to communicate with a remote server.

Simplified:

```text
Client Application
      ↓
Create Socket
      ↓
Connect
      ↓
Server IP + Port
      ↓
Send / Receive Data
```

Example conceptually:

```text
Browser
   ↓
TCP Socket
   ↓
example.com:443
```

---

# Server Socket

A server typically creates a socket and binds it to a local address and port.

Simplified:

```text
Server Application
      ↓
Create Socket
      ↓
Bind to Port
      ↓
Listen
      ↓
Accept Connections
```

Example:

```text
Node Server
   ↓
0.0.0.0:3000
   ↓
Listening
```

Clients can then attempt to connect to the service.

---

# Listening

When an application is **listening**, it is waiting for incoming connection attempts on a particular endpoint.

Example:

```text
Node API
   ↓
TCP
   ↓
Port 3000
   ↓
LISTEN
```

You can inspect listening processes using:

```bash
lsof -iTCP -sTCP:LISTEN
```

---

# Bind Address

A server can bind to different local addresses.

Examples include:

```text
127.0.0.1:3000
```

or:

```text
0.0.0.0:3000
```

These are not the same.

---

## 127.0.0.1

Binding to:

```text
127.0.0.1
```

means the service is generally accessible only through the local loopback interface.

Conceptually:

```text
Same Computer
     ↓
127.0.0.1:3000
```

---

## 0.0.0.0

Binding to:

```text
0.0.0.0
```

commonly means:

> Listen on all available IPv4 interfaces.

Conceptually:

```text
Machine Interfaces
├── localhost
├── Wi-Fi
├── Ethernet
└── other IPv4 interfaces
        ↓
      :3000
```

This becomes important in:

- Docker
- cloud VMs
- Kubernetes
- local development
- debugging "works locally but not remotely"

---

# Server Port

Servers generally listen on predictable or configured ports.

Examples:

```text
HTTP        80
HTTPS       443
Node App    3000
PostgreSQL  5432
Redis       6379
```

A server can choose another port if configured accordingly.

---

# Ephemeral Client Ports

Clients usually do not use a fixed source port for every outgoing connection.

The operating system commonly selects a temporary **ephemeral port**.

Example:

```text
Client
10.0.0.5:53122

      ↓ TCP

Server
203.0.113.10:443
```

Here:

```text
53122
```

is a client-side ephemeral port.

The server remains on:

```text
443
```

---

# Why Can Many Clients Use Port 443?

A server may receive thousands of connections on:

```text
203.0.113.10:443
```

because each connection has different endpoint information.

Example:

```text
Client A
10.0.0.1:51001
        \
         \
          → 203.0.113.10:443
         /
Client B
10.0.0.2:52002
```

The connections are distinguishable because the full connection identity differs.

Simplified:

```text
Client A IP + Port
Server IP + Port

≠

Client B IP + Port
Server IP + Port
```

---

# TCP Socket Flow

A simplified server flow:

```text
Create Socket
    ↓
Bind
    ↓
Listen
    ↓
Accept
    ↓
Read / Write
    ↓
Close
```

Client:

```text
Create Socket
    ↓
Connect
    ↓
Read / Write
    ↓
Close
```

Combined:

```text
Client                         Server
  |                              |
Create                         Create
Socket                         Socket
  |                              |
  |                            Bind
  |                              |
  |                            Listen
  |                              |
Connect -----------------------> |
  |                            Accept
  |                              |
Write -------------------------> Read
Read  <------------------------- Write
  |                              |
Close                           Close
```

---

# UDP Socket Flow

UDP does not require a TCP-style connection establishment.

Simplified:

```text
Sender
   ↓
UDP Socket
   ↓
sendto()
   ↓
Network
   ↓
Receiver UDP Socket
   ↓
recvfrom()
```

The exact API differs by language, but the concept is similar.

---

# Node.js Mental Model

Consider:

```javascript
app.listen(3000);
```

At a high level, Node ultimately relies on operating-system networking facilities.

Conceptually:

```text
Node.js
   ↓
Socket
   ↓
Bind / Listen
   ↓
TCP Port 3000
```

Express hides much of the low-level socket handling from application developers.

---

# Socket vs Port

These are related but not identical concepts.

A port is a numeric transport-layer identifier.

A socket is the application/OS abstraction used to communicate.

Mental model:

```text
Port
→ number identifying transport endpoint/service

Socket
→ programming/OS communication endpoint
```

---

# Socket vs Connection

A listening server socket waits for incoming connections.

Accepted TCP connections are represented separately.

Conceptually:

```text
Listening Socket
      ↓
Port 443
      ↓
Incoming Client
      ↓
Accepted Connection Socket
```

This allows a server to continue listening while handling multiple client connections.

---

# Practical Labs

## Lab 1 — Start a Server

Run:

```bash
python3 -m http.server 8000
```

Now inspect:

```bash
lsof -iTCP:8000 -sTCP:LISTEN
```

Observe the server process.

---

## Lab 2 — Connect to the Server

Run:

```bash
curl http://localhost:8000
```

Conceptually:

```text
curl
  ↓
Client Socket
  ↓
TCP
  ↓
Server Socket
  ↓
Python HTTP Server
```

---

## Lab 3 — Use Netcat

Terminal 1:

```bash
nc -l 9000
```

Terminal 2:

```bash
nc localhost 9000
```

Send:

```text
hello
```

Observe that one process listens while another connects.

---

## Lab 4 — Inspect Established Connections

Run:

```bash
lsof -iTCP -sTCP:ESTABLISHED
```

Identify:

- local IP
- local port
- remote IP
- remote port

Try to identify ephemeral client ports.

---

## Lab 5 — Observe Bind Behavior

If you have a simple Node server, try binding to:

```text
127.0.0.1
```

and compare with:

```text
0.0.0.0
```

Observe how service accessibility changes from other network interfaces.

Do this only on a trusted local network.

---

# Common Problems

## Address Already in Use

Example:

```text
EADDRINUSE
```

Meaning:

> Another socket/process is already bound to the requested endpoint in a conflicting way.

Check:

```bash
lsof -i :3000
```

---

## Connection Refused

Possible causes:

- no server listening
- wrong port
- server crashed
- incorrect bind address
- connection rejected

---

## Works on localhost but Not Remotely

Possible causes:

```text
Service bound only to 127.0.0.1
Firewall
Security group
Wrong IP
Wrong port
Container networking
Routing issue
```

This becomes a very common Docker/AWS debugging scenario.

---

# Debugging Flow

When an application cannot connect:

```text
Correct hostname?
      ↓
DNS resolving?
      ↓
Correct IP?
      ↓
Correct port?
      ↓
Process running?
      ↓
Socket listening?
      ↓
Correct bind address?
      ↓
Firewall allowing traffic?
      ↓
Connection established?
```

Useful commands:

```bash
lsof -i -P -n
```

```bash
lsof -iTCP:3000 -sTCP:LISTEN
```

```bash
nc -vz localhost 3000
```

```bash
curl -v http://localhost:3000
```

---

# Security Considerations

Be careful what interfaces a service listens on.

Example:

```text
127.0.0.1
```

may intentionally restrict access to the local machine.

Binding to:

```text
0.0.0.0
```

can expose the service through additional network interfaces if firewall rules allow it.

Never assume:

```text
service listening
=
service should be publicly reachable
```

Network access should be intentionally controlled.

---

# Performance Considerations

Servers handling many concurrent clients may need to manage:

- socket limits
- open file descriptors
- connection pooling
- timeouts
- keep-alive behavior
- memory per connection
- slow clients

These topics will become important later when studying Node.js internals and production systems.

---

# Common Misunderstandings

## Port and Socket Are Not the Same Thing

A port is a number.

A socket is a communication abstraction.

---

## One Listening Port Can Serve Many Connections

A server listening on `443` does not mean only one client can connect.

Multiple connections are distinguished by endpoint information.

---

## localhost and 0.0.0.0 Are Different

```text
127.0.0.1
→ local loopback only
```

```text
0.0.0.0
→ commonly listen on all local IPv4 interfaces
```

This distinction is important in Docker and cloud deployments.

---

# Interview Questions

1. What is a socket?
2. Why do applications need sockets?
3. What is a client socket?
4. What is a server socket?
5. What does bind mean?
6. What does listen mean?
7. What does accept mean?
8. What is an ephemeral port?
9. Why does the client need a source port?
10. Why can thousands of clients connect to port 443?
11. Port vs socket?
12. Socket vs TCP connection?
13. What does `127.0.0.1:3000` mean?
14. What does `0.0.0.0:3000` mean?
15. `127.0.0.1` vs `0.0.0.0`?
16. What causes `EADDRINUSE`?
17. Why might an app work locally but not from another machine?
18. How would you find which process uses port 3000?
19. How does Node.js use sockets underneath HTTP?
20. How do TCP and UDP sockets differ conceptually?

---

# Quick Revision

```text
Application
   ↓
Socket
   ↓
Transport Protocol
├── TCP
└── UDP
   ↓
IP
   ↓
Network
```

TCP server:

```text
Create
 ↓
Bind
 ↓
Listen
 ↓
Accept
 ↓
Read / Write
 ↓
Close
```

Connection identity:

```text
Source IP
+
Source Port
+
Destination IP
+
Destination Port
+
Protocol
```

---

# My Understanding

A socket is an operating-system and programming abstraction that allows applications to communicate using networking protocols such as TCP and UDP.

Servers usually bind a socket to an IP address and port and listen for incoming traffic, while clients create sockets to communicate with remote services.

Clients commonly use temporary ephemeral source ports, allowing many clients to connect to the same server port simultaneously.

Understanding sockets explains how application code such as a Node HTTP server ultimately interacts with the underlying network.

---

# Completion Checklist

- [ ] Understand what a socket is
- [ ] Understand why sockets exist
- [ ] Understand client sockets
- [ ] Understand server sockets
- [ ] Understand bind
- [ ] Understand listen
- [ ] Understand accept
- [ ] Understand ephemeral ports
- [ ] Explain why many clients can use server port 443
- [ ] Understand `127.0.0.1` vs `0.0.0.0`
- [ ] Inspect listening sockets
- [ ] Inspect established connections
- [ ] Experiment with netcat
- [ ] Understand common socket errors
- [ ] Answer interview questions without notes

---

# References

## Primary

- [Node.js — Anatomy of an HTTP Transaction](https://nodejs.org/en/learn/modules/anatomy-of-an-http-transaction)
- [Beej's Guide to Network Programming](https://beej.us/guide/bgnet/)
- [MDN — Client-Server Overview](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview)

## Supporting

- `man socket`
- `man bind`
- `man listen`
- `man accept`
- `man nc`
- `man lsof`

---

# Related Topics

- [TCP](tcp.md)
- [UDP](udp.md)
- [IP Addresses and Ports](ip-addresses-and-ports.md)
- [HTTP](http.md)
- TLS
- Node.js Networking
- Docker Networking
- Kubernetes Networking

---

[← Previous: UDP](udp.md) · [Next: DNS →](dns.md)
