# Equivalence Class Table for Reqres API Registration

This table outlines the equivalence classes identified for testing the `/api/register` endpoint.

| Parameter  | Equivalence Class ID | Description                     | Example Value          | Expected Outcome (Simplified) |
| :--------- | :------------------- | :------------------------------ | :--------------------- | :---------------------------- |
| `email`    | V1                   | Valid format & known user     | `eve.holt@reqres.in`   | Success (200 OK, token)       |
| `email`    | I1                   | Malformed email                 | `eve.holt@`            | Failure (400 Bad Request)     |
| `email`    | I2                   | Empty string                    | `""`                   | Failure (400 Bad Request)     |
| `email`    | I3                   | Parameter missing               | (Not sent)             | Failure (400 Bad Request)     |
| `password` | V2                   | Non-empty string (known user) | `pistol`               | (Part of Success Case)        |
| `password` | I4                   | Empty string                    | `""`                   | Failure (400 Bad Request)     |
| `password` | I5                   | Parameter missing               | (Not sent)             | Failure (400 Bad Request)     |

**Test Case Combinations:**

*   **TC1 (Happy Path):** V1 + V2 -> Success
*   **TC2 (Invalid Email - Malformed):** I1 + V2 -> Failure
*   **TC3 (Invalid Email - Empty):** I2 + V2 -> Failure
*   **TC4 (Invalid Email - Missing):** I3 + V2 -> Failure
*   **TC5 (Invalid Password - Empty):** V1 + I4 -> Failure
*   **TC6 (Invalid Password - Missing):** V1 + I5 -> Failure
