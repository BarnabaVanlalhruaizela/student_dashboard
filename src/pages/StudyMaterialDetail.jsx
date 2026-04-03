import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import "../styles/studyMaterialDetail.css";

export default function StudyMaterialDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [material, setMaterial] = useState(null);

  useEffect(() => {
    api.get(`/materials/materials/${id}/`)
      .then((res) => setMaterial(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!material) return <p>Loading...</p>;

  return (
    <div className="smd-page">

      <button className="smd-back" onClick={() => navigate(-1)}>
        &lt; Back
      </button>

      <div className="smd-header">
        <h2>{material.subject_name || "Subject"}</h2>
      </div>

      <div className="smd-wrapper">

        {/* LEFT */}
        <div className="smd-left">

          <h3 className="smd-topic">{material.title}</h3>

          <p className="smd-chapter">
            {material.chapter_title || "No chapter"}
          </p>

          <div className="smd-note">
            <p className="smd-note-label">Note:</p>
            <div className="smd-note-box">
              {material.description || "No note provided"}
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="smd-files-panel">

          <div className="smd-files-header">
            Files - {material.files?.length || 0}
          </div>

          <div className="smd-files-list">

            {material.files?.map((file) => (
              <div key={file.id} className="smd-file-card">

                <div className="smd-file-info">
                  <div className="smd-file-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="2" width="13" height="18" rx="2" fill="#4ba7b5" opacity="0.25"/>
                      <path d="M6 2h8l4 4v14a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="white" strokeWidth="1.5" fill="none"/>
                      <path d="M14 2v4h4" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                      <line x1="8" y1="10" x2="16" y2="10" stroke="white" strokeWidth="1.2"/>
                      <line x1="8" y1="13" x2="16" y2="13" stroke="white" strokeWidth="1.2"/>
                      <line x1="8" y1="16" x2="12" y2="16" stroke="white" strokeWidth="1.2"/>
                    </svg>
                  </div>

                  <div className="smd-file-text">
                    <p className="smd-file-name">{file.file_name}</p>
                    <span className="smd-file-size">—</span>
                  </div>
                </div>

                <div className="smd-file-actions">
                  <button className="smd-view-btn" onClick={() => window.open(file.file_url)}>
                    View
                  </button>
                  <button className="smd-download-btn" onClick={() => window.open(file.file_url)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3v13M7 12l5 5 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 20h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}