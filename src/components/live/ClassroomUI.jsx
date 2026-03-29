import { useTracks, VideoTrack } from "@livekit/components-react";
import { Track } from "livekit-client";
import ParticipantsPanel from "./ParticipantsPanel";
import ChatPanel from "./ChatPanel";
import RaiseHandButton from "./RaiseHandButton";
import ControlBar from "./ControlBar";
import { useState } from "react";

export default function ClassroomUI({ role }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: false },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  // 🔥 BEST WAY: detect teacher (publisher)
  const teacherTrack = tracks.find(
    (t) => t.participant.permissions?.canPublish
  );

  if (!teacherTrack) {
    return (
      <div className="waiting-screen">
        <div className="waiting-card">
          <div className="waiting-pulse" />
          <h2>Waiting for teacher to start…</h2>
          <p>You'll be connected as soon as the session begins</p>
        </div>
      </div>
    );
  }

  return (
    <div className="classroom-layout">
      {/* MAIN VIDEO */}
      <div className={`main-stage ${sidebarOpen ? "" : "full-width"}`}>
        <button
          className="toggle-sidebar-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Hide panel" : "Show panel"}
        >
          {sidebarOpen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          )}
        </button>

        <VideoTrack trackRef={teacherTrack} />
      </div>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <div className="right-sidebar">
          <ParticipantsPanel />
          <ChatPanel role={role} />
        </div>
      )}

      {/* CONTROLS */}
      <ControlBar role={role} />

      {/* STUDENT ONLY */}
      {role === "STUDENT" && <RaiseHandButton />}
    </div>
  );
}
