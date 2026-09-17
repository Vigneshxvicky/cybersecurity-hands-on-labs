# Lab 01 — API Security & BOLA Pentesting Report

## 1. Executive Summary

A Broken Object Level Authorization (BOLA) vulnerability was identified in an intentionally vulnerable local Node.js/Express API.

An authenticated Alice user was able to change the object identifier in a request and retrieve Bob's and the administrator's user objects while retaining Alice's valid JWT.

## 2. Scope

Target: `http://localhost:3000`

Testing was restricted to the intentionally vulnerable local application.

## 3. Attack Flow

1. Authenticate as Alice.
2. Capture the JWT.
3. Request Alice's own object (`1001`).
4. Change the object ID to Bob (`1002`) without changing the JWT.
5. Observe unauthorized data exposure.
6. Change the object ID to Admin (`1003`).
7. Observe unauthorized cross-role data exposure.
8. Implement object-level authorization.
9. Retest the endpoint.

## 4. Evidence Summary

- `01_burp_ready.png` — Burp Suite ready for local API testing.
- `02_login_success.png` — Successful Alice authentication.
- `03_alice_1001_baseline.png` — Authorized baseline request.
- `04_bola_bob_1002.png` — Alice JWT accessing Bob's object.
- `05_bola_admin_1003.png` — Alice JWT accessing Admin's object.

**Public repository warning:** screenshots containing JWTs, passwords, cookies, or other secrets must be redacted before committing.

## 5. Root Cause

The application authenticated the requester but failed to verify whether the requester was authorized to access the requested object.

## 6. Remediation

The endpoint was updated to compare the requested object ID with the authenticated user's ID and to permit broader access only for an administrator role.

## 7. Security Impact

The flaw can expose user profile information across account boundaries. In a real application, similar authorization failures can potentially expose or modify sensitive records depending on the affected endpoint.

## 8. Lessons Learned

- Authentication and authorization are separate security controls.
- Object identifiers should never be treated as proof of authorization.
- API authorization must be enforced server-side.
- Burp Repeater is useful for testing authorization boundaries.
- Retesting is required after remediation.

## 9. Ethical Use

This lab was conducted only against a self-hosted intentionally vulnerable application for educational and defensive security research.
