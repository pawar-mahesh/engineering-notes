# UDP

> UDP is a connectionless transport protocol that sends independent datagrams without providing TCP-style delivery or ordering guarantees.

---

## What Is UDP?

UDP stands for **User Datagram Protocol**.

It is a transport-layer protocol used to send independent messages called **datagrams** between network endpoints.

A simplified model:

```text
Application
   ↓
UDP Datagram
   ↓
IP
   ↓
Network
   ↓
Destination
```

Unlike TCP, UDP does not establish a persistent transport connection before sending data.

---

## Why Does UDP Exist?

Not every application requires TCP's reliability mechanisms.

Some applications care more about:

- low overhead
- low latency
- timely delivery
- application-controlled reliability
- simple message-oriented transport

Examples can include:

- DNS queries
- real-time media
- online games
- telemetry
- QUIC-based protocols

UDP provides a simpler transport mechanism for these situations.

---

# Core Properties

UDP is generally:

```text
Connectionless
Datagram-oriented
No built-in delivery guarantee
No built-in ordering guarantee
No built-in retransmission
Low protocol overhead
```

---

# Connectionless Communication

UDP does not perform a TCP-style three-way handshake before sending data.

Conceptually:

```text
Sender
   ↓
Datagram
   ↓
Receiver
```

The sender can transmit a datagram without first establishing a transport connection.

---

# Datagram-Oriented

UDP preserves message/datagram boundaries.

If an application sends:

```text
Message A
Message B
```

UDP treats these as separate datagrams.

This differs from TCP's byte-stream model.

Conceptually:

```text
TCP
→ stream of bytes

UDP
→ individual datagrams
```

---

# No Built-In Delivery Guarantee

Suppose the sender sends:

```text
Datagram 1
Datagram 2
Datagram 3
```

The network might deliver:

```text
Datagram 1
Datagram 3
```

with Datagram 2 lost.

UDP itself does not automatically retransmit the lost datagram.

If the application requires retransmission, it must implement suitable logic itself or use a higher-level protocol that does so.

---

# No Built-In Ordering Guarantee

Suppose:

```text
Sent:
1
2
3
```

The receiver might observe:

```text
2
1
3
```

UDP does not reorder the datagrams for the application.

---

# TCP vs UDP

| TCP                           | UDP                            |
| ----------------------------- | ------------------------------ |
| Connection-oriented           | Connectionless                 |
| Reliable transport mechanisms | No delivery guarantee          |
| Ordered byte stream           | Independent datagrams          |
| Retransmission                | No built-in retransmission     |
| Flow control                  | No TCP-style flow control      |
| Congestion mechanisms         | No TCP-style built-in behavior |
| Higher protocol machinery     | Simpler transport              |

---

# Mental Model

Use TCP when you think:

```text
I need a reliable ordered stream.
```

Think about UDP when:

```text
I need datagrams with minimal transport machinery,
and the application/protocol can tolerate or manage loss.
```

Do not use:

```text
TCP = slow
UDP = fast
```

as your mental model.

That is too simplistic.

The important difference is the **transport guarantees and behavior**.

---

# Common Use Cases

## DNS

Many traditional DNS queries use UDP.

Conceptually:

```text
Client
   ↓
DNS Query
   ↓
UDP
   ↓
DNS Server
```

DNS may use TCP in some circumstances as well.

Therefore avoid thinking:

> DNS always uses only UDP.

---

## Real-Time Media

For live voice or video, receiving a very old packet may sometimes be less useful than continuing with newer data.

Example:

```text
Live Audio

Packet 1
Packet 2
Packet 3 lost
Packet 4
Packet 5
```

The application may prefer continuing playback instead of stopping everything waiting for Packet 3.

Actual real-time systems are more sophisticated, but this illustrates the motivation.

---

## Online Gaming

Fast-changing game state can sometimes tolerate missing individual updates because a newer update may quickly replace an older one.

The exact protocol design depends on the game.

---

## QUIC

QUIC uses UDP as its transport foundation.

HTTP/3 runs over QUIC.

Conceptually:

```text
HTTP/3
  ↓
QUIC
  ↓
UDP
  ↓
IP
```

QUIC implements sophisticated reliability, security, and multiplexing behavior above UDP.

Therefore:

> UDP being underneath does not mean HTTP/3 itself is unreliable.

---

# UDP and Ports

UDP also uses port numbers.

Example:

```text
Client
10.0.0.5:52000

        ↓ UDP

Server
10.0.0.10:53
```

Port `53` is commonly associated with DNS.

TCP port `53` and UDP port `53` are distinct transport endpoints because the protocol is part of the endpoint identity.

---

# Practical Labs

## Lab 1 — UDP Listener

On systems where your `nc` implementation supports it:

```bash
nc -u -l 9001
```

In another terminal:

```bash
nc -u localhost 9001
```

Type:

```text
hello
```

Observe the received datagram data.

---

## Lab 2 — Compare TCP and UDP

TCP server:

```bash
nc -l 9000
```

TCP client:

```bash
nc localhost 9000
```

UDP server:

```bash
nc -u -l 9001
```

UDP client:

```bash
nc -u localhost 9001
```

The exercise is primarily to understand that the transport protocol can change while using the same general socket abstraction.

---

## Lab 3 — Inspect UDP Endpoints

On macOS:

```bash
lsof -iUDP -P -n
```

Observe processes using UDP sockets.

---

# Trade-Offs

## Advantages

UDP offers:

- small transport header
- no connection handshake
- message boundaries
- application-controlled communication behavior

---

## Disadvantages

UDP does not directly provide:

- delivery guarantee
- ordering guarantee
- retransmission
- TCP-style flow control
- TCP-style reliability semantics

If an application needs those features, it must provide them elsewhere.

---

# Common Misunderstandings

## UDP Does Not Mean Bad or Unreliable Application

UDP itself does not guarantee delivery.

But applications and protocols built on UDP can implement reliability.

QUIC is an important example.

---

## UDP Is Not Always Faster

Performance depends on:

- protocol design
- network conditions
- workload
- application behavior

UDP has less built-in transport machinery, but that does not automatically mean every UDP application performs better than every TCP application.

---

## UDP Still Uses IP and Ports

Conceptually:

```text
Application
   ↓
UDP
   ↓
IP
   ↓
Network
```

UDP does not replace IP.

---

# Security Considerations

UDP has no built-in encryption.

Applications must use appropriate security protocols when confidentiality or authenticity is required.

UDP-based services can also be associated with amplification and spoofing risks when poorly designed.

Security specifics will be studied later.

---

# Performance Considerations

UDP avoids connection-establishment overhead at the transport layer.

This can be useful for certain workloads.

However applications may need additional logic for:

- loss handling
- ordering
- retries
- security
- congestion management

The total system cost depends on the protocol built above UDP.

---

# Interview Questions

1. What is UDP?
2. Why does UDP exist?
3. What does connectionless mean?
4. Is UDP reliable?
5. Does UDP guarantee ordering?
6. Does UDP retransmit lost data?
7. What is a datagram?
8. TCP stream vs UDP datagram?
9. TCP vs UDP?
10. When would UDP make sense?
11. Why might real-time applications use UDP?
12. Does DNS always use only UDP?
13. Does UDP use ports?
14. Is UDP encrypted?
15. Why does HTTP/3 use UDP underneath?
16. Does using UDP automatically make HTTP/3 unreliable?
17. Can an application build reliability on top of UDP?
18. Is UDP always faster than TCP?
19. What information identifies a UDP endpoint?
20. Where does UDP fit relative to IP?

---

# Quick Revision

```text
UDP
│
├── Transport Layer
├── Connectionless
├── Datagram-Oriented
├── No Delivery Guarantee
├── No Ordering Guarantee
├── No Built-In Retransmission
│
├── Common Uses
│   ├── DNS
│   ├── Real-Time Media
│   ├── Gaming
│   └── QUIC
│
└── Still Uses
    ├── IP
    └── Ports
```

---

# My Understanding

UDP is a connectionless transport protocol that sends independent datagrams between endpoints.

Unlike TCP, UDP does not provide built-in reliable delivery, ordering, retransmission, or connection establishment.

This simpler model can be useful when applications value timeliness, message-oriented communication, or want to implement their own transport behavior.

UDP is not automatically faster or better than TCP; the correct choice depends on application requirements.

---

# Completion Checklist

- [ ] Understand what UDP is
- [ ] Understand connectionless communication
- [ ] Understand datagrams
- [ ] Understand lack of delivery guarantee
- [ ] Understand lack of ordering guarantee
- [ ] Explain TCP vs UDP
- [ ] Understand typical UDP use cases
- [ ] Understand DNS can use UDP and TCP
- [ ] Understand QUIC uses UDP
- [ ] Experiment with UDP using netcat
- [ ] Inspect UDP endpoints
- [ ] Answer interview questions without notes

---

# References

## Primary

- [Cloudflare — What is UDP?](https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp/)
- [Cloudflare — TCP vs UDP](https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/)

## Deeper Reference

- [RFC 768 — User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768)

---

# Related Topics

- [TCP](tcp.md)
- [IP Addresses and Ports](ip-addresses-and-ports.md)
- [Sockets](sockets.md)
- [DNS](dns.md)
- QUIC
- HTTP/3

---

[← Previous: TCP](tcp.md) · [Next: Network Sockets →](sockets.md)
