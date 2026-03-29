import {
  useRoomContext,
  useLocalParticipant,
} from "@livekit/components-react";
import { useState } from "react";

export default function ControlBar({ role }) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  const isStudent = role === "STUDENT";

  const toggleMic = async () => {
    await localParticipant.setMicrophoneEnabled(!micOn);
    setMicOn(!micOn);
  };

  const toggleCam = async () => {
    await localParticipant.setCameraEnabled(!camOn);
    setCamOn(!camOn);
  };

  const toggleScreenShare = async () => {
    await localParticipant.setScreenShareEnabled(!screenSharing);
    setScreenSharing(!screenSharing);
  };

  const leaveRoom = async () => {
    await room.disconnect();
    window.history.back();
  };

  return (
    <div className="control-bar">
      {/* Mic + Camera: teacher only */}
      {!isStudent && (
        <>
          <button
            className={`ctrl-btn ${!micOn ? "ctrl-btn--off" : ""}`}
            onClick={toggleMic}
            title={micOn ? "Mute microphone" : "Unmute microphone"}
          >
            {micOn ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23"/>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            )}
            <span>{micOn ? "Mute" : "Unmute"}</span>
          </button>

          <button
            className={`ctrl-btn ${!camOn ? "ctrl-btn--off" : ""}`}
            onClick={toggleCam}
            title={camOn ? "Turn off camera" : "Turn on camera"}
          >
            {camOn ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            )}
            <span>{camOn ? "Camera" : "No Cam"}</span>
          </button>
        </>
      )}

      {/* Screen Share: everyone */}
      <button
        className={`ctrl-btn ${screenSharing ? "ctrl-btn--active" : ""}`}
        onClick={toggleScreenShare}
        title={screenSharing ? "Stop sharing" : "Share screen"}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
        <span>{screenSharing ? "Stop Share" : "Share Screen"}</span>
      </button>

      {/* Leave: everyone */}
      <button className="ctrl-btn ctrl-btn--leave" onClick={leaveRoom} title="Leave class">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span>Leave</span>
      </button>
    </div>
  );
}
