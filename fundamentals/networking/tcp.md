# TCP

> TCP provides reliable, ordered, connection-oriented byte-stream communication between network endpoints.

---

## What Is TCP?

TCP stands for **Transmission Control Protocol**.

It is a transport-layer protocol used to provide reliable communication between two endpoints over an IP network.

A simplified model is:

```text
Application A
    ↓
TCP
    ↓
IP Network
    ↓
TCP
    ↓
Application B
```

TCP handles many communication problems for the application, including:

- lost data
- duplicate data
- incorrect ordering
- retransmission
- flow control
- congestion control

A useful mental model is:

> TCP gives applications a reliable, ordered stream of bytes between two endpoints.

---

## Why Does TCP Exist?

IP can move packets between network endpoints, but IP itself does not guarantee:

- delivery
- ordering
- retransmission
- duplicate prevention

Applications such as:

- web servers
- SSH
- databases
- APIs

often need reliable communication.

TCP adds this reliability layer above IP.

Conceptually:

```text
Application
    ↓
TCP
    ↓
Reliable Transport
    ↓
IP
    ↓
Network
```

---

## Core Properties

TCP is commonly described as:

```text
Connection-oriented
Reliable
Ordered
Byte-stream based
```

---

## Connection-Oriented

Before normal data transfer, TCP establishes connection state between both endpoints.

Conceptually:

```text
Client
   ↓
Establish TCP Connection
   ↓
Exchange Data
   ↓
Close Connection
```

This is different from a connectionless protocol such as UDP.

---

## Reliable Delivery

TCP attempts to ensure that the intended bytes are delivered successfully.

If data is lost during transmission, TCP can detect the missing data and arrange retransmission.

Example:

```text
Sender
  ↓
1
2
3
4

Network
  ↓
Packet 3 lost

Receiver
  ↓
1
2
4
```

TCP detects that expected data is missing and retransmits it.

Eventually the receiving application should see the correct byte stream.

---

## Ordered Delivery

Network packets may not always arrive in the same order in which they were sent.

Example:

```text
Sent:

1
2
3
4

Arrived:

1
3
2
4
```

TCP uses sequence information so the receiving side can reconstruct the correct byte order before presenting the data to the application.

The application sees:

```text
1
2
3
4
```

---

## Byte Stream

TCP provides a **stream of bytes**.

It does not preserve application message boundaries.

For example, an application may write:

```text
Hello
World
```

but TCP treats the underlying data as a sequence of bytes.

Applications using TCP must therefore define their own message boundaries when necessary.

Protocols such as HTTP do this at the application layer.

> **Important**
>
> TCP guarantees byte ordering, not application-level message boundaries.

---

# TCP Three-Way Handshake

Before normal data exchange begins, a TCP connection is established using a three-way handshake.

The simplified sequence is:

```text
Client                          Server
   |                              |
   | -------- SYN ------------->  |
   |                              |
   | <------ SYN-ACK -----------  |
   |                              |
   | -------- ACK ------------->  |
   |                              |
   |       Connection Ready       |
```

The sequence is:

```text
SYN
↓
SYN-ACK
↓
ACK
```

---

## Why Is the Handshake Needed?

The handshake allows both sides to establish connection state and synchronize the initial sequence information used by TCP.

At a high level:

```text
Client
→ I want to establish a connection.

Server
→ I received your request and I am ready too.

Client
→ Confirmed.
```

After that, application data can be exchanged.

---

# Acknowledgements

TCP uses acknowledgements to confirm received data.

Simplified:

```text
Sender
   ↓
Data
   ↓
Receiver
   ↓
ACK
   ↓
Sender
```

An acknowledgement tells the sender that expected data has been successfully received up to a certain point.

If expected acknowledgement information does not arrive, TCP may retransmit data.

---

# Retransmission

Suppose the sender transmits data and some of it is lost.

```text
Sender
   ↓
Segment
   ↓
Network
   X
Lost
```

The sender may later retransmit that data.

Conceptually:

```text
Send
  ↓
Wait for acknowledgement
  ↓
Not acknowledged
  ↓
Retransmit
```

The exact algorithms are more complex, but this high-level model is enough for now.

---

# Flow Control

Flow control prevents a sender from overwhelming a receiver.

Imagine:

```text
Fast Sender
    ↓
Huge amount of data
    ↓
Slow Receiver
```

The receiving side has limited buffer capacity.

TCP therefore allows the receiver to communicate how much additional data it can currently accept.

This is related to the TCP **receive window**.

Simplified:

```text
Receiver
   ↓
I can currently accept X bytes
   ↓
Sender adjusts
```

---

## Flow Control Mental Model

```text
Question:

Can the receiver keep up?
```

Flow control primarily protects the receiver.

---

# Congestion Control

Congestion control deals with the capacity of the network itself.

Imagine:

```text
Many Senders
    ↓
Network
    ↓
Too much traffic
```

TCP adjusts sending behavior when it detects congestion.

A useful distinction:

```text
Flow Control
→ Can the receiver handle the data?

Congestion Control
→ Can the network handle the traffic?
```

Do not study individual congestion-control algorithms deeply yet.

---

# TCP Connection Termination

A TCP connection should eventually be closed.

A simplified close may involve:

```text
Client                          Server
   |                              |
   | -------- FIN ------------->  |
   | <-------- ACK -------------  |
   | <-------- FIN -------------  |
   | -------- ACK ------------->  |
```

The important concept is:

> TCP connection teardown requires coordination between both endpoints.

The exact state machine will be studied later if required.

---

# TCP and HTTP

HTTP/1.1 and HTTP/2 commonly use TCP as their transport protocol.

Conceptually:

```text
HTTP
 ↓
TCP
 ↓
IP
 ↓
Network
```

For HTTPS:

```text
HTTP
 ↓
TLS
 ↓
TCP
 ↓
IP
```

HTTP defines the application message.

TCP provides reliable transport.

---

# Complete Request Mental Model

Suppose the browser requests:

```text
https://example.com/users
```

At a high level:

```text
Browser
   ↓
DNS Lookup
   ↓
Server IP
   ↓
Port 443
   ↓
TCP Three-Way Handshake
   ↓
TLS Handshake
   ↓
HTTP Request
   ↓
Server
```

This connects Day 1, Day 2, and Day 3.

---

# Practical Labs

## Lab 1 — Inspect Established TCP Connections

On macOS:

```bash
lsof -iTCP -sTCP:ESTABLISHED
```

Open a few websites and run the command again.

Observe:

- process
- local address
- local port
- remote address
- remote port
- connection state

---

## Lab 2 — Start a TCP-Based HTTP Server

Run:

```bash
python3 -m http.server 8000
```

Then:

```bash
lsof -iTCP:8000 -sTCP:LISTEN
```

You should see a process listening on TCP port `8000`.

---

## Lab 3 — Send an HTTP Request

Run:

```bash
curl -v http://localhost:8000
```

Conceptually:

```text
curl
  ↓
TCP socket
  ↓
TCP connection
  ↓
localhost:8000
  ↓
Python HTTP server
```

---

## Lab 4 — Experiment with Netcat

Terminal 1:

```bash
nc -l 9000
```

Terminal 2:

```bash
nc localhost 9000
```

Type:

```text
hello
```

Observe the data appear on the server side.

This gives a simple demonstration of TCP socket communication.

---

# Common Problems

TCP-related failures can appear as:

```text
Connection refused
Connection timed out
Connection reset
Broken pipe
```

---

## Connection Refused

Usually means:

```text
Target reachable
+
No application accepting connection on that port
```

Possible reasons:

- application is stopped
- wrong port
- service only listening on another interface
- connection actively rejected

---

## Connection Timeout

Possible reasons:

- network path unavailable
- firewall dropping traffic
- server unreachable
- routing issue
- severe network delay

---

## Connection Reset

A TCP connection may be abruptly terminated by one side.

Applications may report errors similar to:

```text
ECONNRESET
```

---

# Debugging

A useful debugging sequence:

```text
Is DNS resolving?
        ↓
Is IP reachable?
        ↓
Is correct port open?
        ↓
Is service listening?
        ↓
Can TCP connection establish?
        ↓
Can application protocol communicate?
```

Useful commands:

```bash
lsof -iTCP -P -n
```

```bash
lsof -iTCP:3000
```

```bash
curl -v http://localhost:3000
```

```bash
nc -vz example.com 443
```

---

# Security Considerations

TCP itself does not encrypt application data.

For example:

```text
HTTP
 ↓
TCP
```

does not automatically provide confidentiality.

HTTPS adds TLS:

```text
HTTP
 ↓
TLS
 ↓
TCP
```

This will be covered in the TLS notes.

---

# Performance Considerations

TCP performance can be affected by:

- connection establishment
- network latency
- packet loss
- retransmission
- congestion
- receive-window size
- round-trip time
- connection reuse

Repeated connection establishment can add latency.

That is one reason HTTP persistent connections are useful.

---

# Common Misunderstandings

## TCP Does Not Mean Encrypted

TCP provides reliable transport.

It does not automatically provide encryption.

---

## TCP Does Not Preserve Messages

TCP delivers a byte stream.

The application protocol must determine where messages begin and end.

---

## TCP Does Not Guarantee Infinite Reliability

TCP makes a strong effort to reliably deliver data, but communication can still fail completely when connectivity disappears or endpoints terminate.

Applications must still handle errors.

---

# Interview Questions

Try answering without notes.

1. What is TCP?
2. Why does TCP exist?
3. What does connection-oriented mean?
4. What does reliable transport mean?
5. What does ordered delivery mean?
6. Why is TCP considered a byte-stream protocol?
7. What is the three-way handshake?
8. Explain SYN, SYN-ACK, and ACK.
9. Why is the TCP handshake required?
10. How does TCP detect lost data?
11. What is retransmission?
12. What is an acknowledgement?
13. What is flow control?
14. What problem does flow control solve?
15. What is congestion control?
16. Flow control vs congestion control?
17. How does TCP close a connection?
18. Does TCP provide encryption?
19. Does TCP preserve application message boundaries?
20. Where does TCP fit relative to HTTP and IP?

---

# Quick Revision

```text
TCP
│
├── Transport Layer
├── Connection-Oriented
├── Reliable
├── Ordered
├── Byte Stream
│
├── Connection Setup
│   ├── SYN
│   ├── SYN-ACK
│   └── ACK
│
├── Reliability
│   ├── Sequence Information
│   ├── Acknowledgements
│   └── Retransmission
│
├── Flow Control
│
├── Congestion Control
│
└── Connection Termination
```

---

# My Understanding

TCP is a transport-layer protocol that provides applications with a reliable and ordered byte stream between network endpoints.

Before normal data exchange, TCP establishes connection state through a three-way handshake.

TCP uses mechanisms such as acknowledgements, retransmission, sequencing, flow control, and congestion control to make communication more reliable.

Protocols such as HTTP/1.1 and HTTP/2 use TCP underneath, while TCP itself does not understand application business logic or provide encryption.

---

# Completion Checklist

- [ ] Understand what TCP is
- [ ] Understand why TCP exists
- [ ] Understand connection-oriented communication
- [ ] Understand the three-way handshake
- [ ] Explain SYN, SYN-ACK, ACK
- [ ] Understand reliable delivery
- [ ] Understand ordered delivery
- [ ] Understand TCP byte streams
- [ ] Understand acknowledgements
- [ ] Understand retransmission
- [ ] Understand flow control
- [ ] Understand congestion control
- [ ] Explain flow control vs congestion control
- [ ] Understand connection termination
- [ ] Inspect established TCP connections
- [ ] Inspect a listening TCP port
- [ ] Experiment using netcat
- [ ] Answer interview questions without notes

---

# References

## Primary

- [Cloudflare — What is TCP/IP?](https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/)
- [MDN — How the Web Works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)

## Deeper Reference

- [RFC 9293 — Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293)

> **Note**
>
> RFC 9293 is reference material. It is not necessary to read it end-to-end at this stage.

---

# Related Topics

- [IP Addresses and Ports](ip-addresses-and-ports.md)
- [UDP](udp.md)
- [Sockets](sockets.md)
- TLS
- [HTTP](http.md)
- HTTP/2
- Network Reliability

---

[← Previous: IP Addresses and Ports](ip-addresses-and-ports.md) · [Next: UDP →](udp.md)
