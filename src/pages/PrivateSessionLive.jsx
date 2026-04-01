/**
 * FILE: STUDENT_DASHBOARD/src/pages/PrivateSessionLive.jsx
 *
 * Uses @livekit/components-react (already installed) with
 * PrivateClassroomUI for multi-participant video.
 *
 * Flow:
 * 1. Fetches session detail
 * 2. Calls /sessions/{id}/join/ to get LiveKit token
 * 3. Connects to LiveKit room via <LiveKitRoom>
 * 4. Renders PrivateClassroomUI inside
 */

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { useAuth } from "../contexts/AuthContext";
import privateSession from "../api/privateSessionService";
import PrivateClassroomUI from "../components/live/PrivateClassroomUI";
import "../styles/privateSessions.css";

export default function PrivateSessionLive() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sessionData, setSessionData] = useState(null);
  const [livekitData, setLivekitData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const detail = await privateSession.getSessionDetail(id);
        if (cancelled) return;
        setSessionData(detail);

        if (detail.status === "ongoing") {
          const joinData = await privateSession.joinSession(id);
          if (cancelled) return;
          setLivekitData(joinData);
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err?.response?.data?.error ||
          err?.response?.data?.detail ||
          "Unable to join session. It may not have started yet."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="tps__live-loading">
        <div className="tps__live-spinner" />
        <p>Joining private session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tps__live-error">
        <h2>Unable to join session</h2>
        <p>{error}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => navigate("/private-sessions")}
            style={{
              padding: "10px 24px", borderRadius: 8, border: "none",
              background: "#015865", color: "#fff", fontWeight: 600, cursor: "pointer",
            }}
          >
            Back to Private Sessions
          </button>
          <button
            onClick={() => { setError(null); setLoading(true); window.location.reload(); }}
            style={{
              padding: "10px 24px", borderRadius: 8,
              border: "2px solid #94a3b8", background: "transparent",
              color: "#475569", fontWeight: 600, cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!livekitData) {
    return (
      <div className="tps__live-error">
        <h2>Session not started yet</h2>
        <p>The teacher hasn't started this session. Please wait and try again.</p>
        <button
          onClick={() => navigate("/private-sessions")}
          style={{
            padding: "10px 24px", borderRadius: 8, border: "none",
            background: "#015865", color: "#fff", fontWeight: 600, cursor: "pointer",
          }}
        >
          Back to Private Sessions
        </button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={livekitData.livekit_url}
      token={livekitData.token}
      connect={true}
      video={true}
      audio={true}
      onDisconnected={() => navigate("/private-sessions")}
    >
      <PrivateClassroomUI
        role={livekitData.role?.toLowerCase() || "student"}
        session={sessionData}
      />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}