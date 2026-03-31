/**
 * Private Session API Service — Student Dashboard
 *
 * All methods hit the real backend. No mock data.
 * LiveKit tokens come from /api/private-sessions/<id>/join/
 * which reuses the existing livestream token generator.
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function authHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(method, path, body = null) {
  const opts = { method, headers: authHeaders() };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

// ──────────────────────────────────────────────
// Student session lists
// ──────────────────────────────────────────────

export async function getSessions(tab = "scheduled") {
  return request("GET", `/api/private-sessions/student/?tab=${tab}`);
}

// ──────────────────────────────────────────────
// Session detail
// ──────────────────────────────────────────────

export async function getSessionDetail(sessionId) {
  return request("GET", `/api/private-sessions/${sessionId}/`);
}

// ──────────────────────────────────────────────
// Request a new session
// ──────────────────────────────────────────────

export async function requestSession(data) {
  return request("POST", "/api/private-sessions/request/", data);
}

// ──────────────────────────────────────────────
// Student actions
// ──────────────────────────────────────────────

export async function cancelSession(sessionId, reason = "") {
  return request("POST", `/api/private-sessions/${sessionId}/cancel/`, { reason });
}

export async function confirmReschedule(sessionId) {
  return request("POST", `/api/private-sessions/${sessionId}/confirm-reschedule/`);
}

export async function declineReschedule(sessionId, reason = "") {
  return request("POST", `/api/private-sessions/${sessionId}/decline-reschedule/`, { reason });
}

export async function leaveSession(sessionId) {
  return request("POST", `/api/private-sessions/${sessionId}/cancel/`, {
    reason: "Student left the session.",
  });
}

// ──────────────────────────────────────────────
// Teachers list (for the request form)
// ──────────────────────────────────────────────

export async function getTeachers() {
  try {
    return await request("GET", "/api/accounts/teachers/");
  } catch {
    console.warn("Teachers list endpoint not available, returning empty.");
    return [];
  }
}

export async function validateStudentId(studentId) {
  try {
    return await request(
      "GET",
      `/api/accounts/validate-student/?student_id=${encodeURIComponent(studentId)}`
    );
  } catch {
    return { valid: false };
  }
}

// ──────────────────────────────────────────────
// LiveKit — reuses existing livestream token infra
// ──────────────────────────────────────────────

export async function getLiveKitToken(sessionId) {
  return request("POST", `/api/private-sessions/${sessionId}/join/`);
}