# Lab 01 — API Security & BOLA

## Overview

This lab demonstrates the identification and remediation of a Broken Object Level Authorization (BOLA) vulnerability in an intentionally vulnerable Node.js/Express API.

The lab was performed in a local environment using Burp Suite for HTTP request manipulation and security testing.

## Objectives

- Understand API authentication vs authorization
- Test object-level authorization
- Identify BOLA
- Manipulate API object identifiers
- Analyze unauthorized data exposure
- Implement an authorization control
- Retest the endpoint after remediation

## Environment

- Windows 11
- Node.js
- Express.js
- JWT
- bcryptjs
- Burp Suite Community Edition

## Target

`http://localhost:3000`

This application was created specifically for security testing.

## Vulnerability

The vulnerable endpoint was:

```http
GET /api/users/:id
```

The API authenticated the user using a valid JWT but did not verify whether the authenticated user was authorized to access the requested object.

### Example

Alice authenticated successfully and received a JWT.

The legitimate request:

```http
GET /api/users/1001
```

returned Alice's data.

The object identifier was then changed:

```http
GET /api/users/1002
```

while keeping the same Alice JWT.

The API returned Bob's data.

The same technique was used against:

```http
GET /api/users/1003
```

which returned the administrator's object.

## Evidence

| Request | Identity | Result |
|---|---|---|
| `/api/users/1001` | Alice | Authorized |
| `/api/users/1002` | Alice | Unauthorized Bob data |
| `/api/users/1003` | Alice | Unauthorized Admin data |
| `/api/users/1004` | Alice | User not found |
| `/api/users/9999` | Alice | User not found |

Screenshots are provided in the `evidence/` directory. Any credentials, JWTs, or session tokens should be redacted before publishing publicly.

## Root Cause

The API verified authentication but did not perform object-level authorization.

```text
Authentication → YES
Authorization  → MISSING
```

## Remediation

An authorization check was added so that a normal user can access only their own object, while administrators can access objects according to their role.

```javascript
if (req.user.role !== "admin" &&
    req.user.userId !== requestedId) {
    return res.status(403).json({
        error: "Forbidden"
    });
}
```

## Security Lesson

A valid JWT does not automatically grant access to every object in an API.

Every object request must be evaluated against the authenticated user's authorization.

## Tools

- Burp Suite
- Node.js
- Express.js
- JWT
- JavaScript

## OWASP

Primary classification:

**OWASP API Security — Broken Object Level Authorization (BOLA)**

## Disclaimer

This project was performed entirely against an intentionally vulnerable application running on localhost for educational and defensive security research.

No third-party or production systems were targeted.
