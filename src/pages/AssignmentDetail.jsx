import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/apiClient";
import PageHeader from "../components/PageHeader";
import CompletedAssignment from "../components/CompletedAssignment";
import "../styles/assignmentDetail.css";

export default function AssignmentDetail() {
  const navigate = useNavigate();
  const { assignmentId } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!assignmentId) return;
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/assignments/${assignmentId}/`);
        const data = res.data;
        setAssignment(data);
        if (data.submission_status === "SUBMITTED" || data.status === "SUBMITTED") {
          setIsSubmitted(true);
          setSubmittedAt(data.submitted_at ? new Date(data.submitted_at) : null);
        } else {
          setIsSubmitted(false);
          setSubmittedAt(null);
        }
      } catch (err) {
        console.error("Assignment detail error:", err);
        setError(err.response?.data?.detail || "Unable to load assignment.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  const handleFileUpload = (file) => {
    if (!file) return;
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const fileName = file.name.toLowerCase();
    const isValid = allowedMimeTypes.includes(file.type) || allowedExtensions.some(ext => fileName.endsWith(ext));
    if (!isValid) {
      alert("Only PDF, DOC, and DOCX files are allowed.");
      return;
    }
    setUploadedFile(file);
  };

  const handleInputChange = (e) => handleFileUpload(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!uploadedFile) return;
    setConfirmOpen(false);
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      await api.post(`/assignments/${assignment.id}/submit/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const res = await api.get(`/assignments/${assignmentId}/`);
      const updated = res.data;
      setAssignment(updated);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsSubmitted(true);
        setSubmittedAt(updated.submitted_at ? new Date(updated.submitted_at) : new Date());
        setUploadedFile(null);
        setSubmitSuccess(false);
      }, 1200);
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.response?.data?.detail || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatSmallDate = (dateObj) => {
    if (!dateObj) return "";
    return dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  // Due date urgency
  const getDueUrgency = () => {
    if (!assignment?.due_date) return null;
    const diff = Math.ceil((new Date(assignment.due_date) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: "Overdue", cls: "due-overdue" };
    if (diff === 0) return { label: "Due today!", cls: "due-today" };
    if (diff <= 2) return { label: `Due in ${diff} day${diff > 1 ? "s" : ""}`, cls: "due-soon" };
    return null;
  };

  const urgency = getDueUrgency();

  if (loading) return (
    <div className="ad-loading">
      <div className="ad-spinner" />
      <span>Loading assignment…</span>
    </div>
  );
  if (error) return <div className="ad-error">{error}</div>;
  if (!assignment) return <div className="ad-error">Assignment not found.</div>;

  return (
    <div className="assignmentDetailPage">
      <button className="assignmentDetailBack" onClick={() => navigate(-1)}>
        &lt; Back
      </button>

      <div className="assignmentDetailHeaderBox">
        <PageHeader title={assignment.subject_name || assignment.title} />
      </div>

      <div className="assignmentDetailBodyBox">
        <div className="assignmentDetailContent">

          {!isSubmitted && (
            <div className="assignmentDetailLeft">
              <div className="assignmentTitleRow">
                <h3 className="assignmentDetailTitle">Assignment</h3>
                {urgency && (
                  <span className={`ad-urgency-badge ${urgency.cls}`}>{urgency.label}</span>
                )}
              </div>

              <p className="assignmentDetailDue">
                Due Date: {new Date(assignment.due_date).toLocaleDateString("en-GB")}
              </p>

              <div className="assignmentDetailDivider" />

              <p className="assignmentDetailLabel">Title: {assignment.title}</p>
              <p className="assignmentDetailDesc">Description: {assignment.description}</p>

              {assignment.attachment && (
                <div>
                  <div
                    className="fileStrip"
                    onClick={() => window.open(assignment.attachment, "_blank")}
                  >
                    <div className="fileStripIcon">📄</div>
                    <div className="fileStripName">
                      {assignment.attachment.split("/").pop()}
                    </div>
                    <span className="fileStrip__hint">Click to preview</span>
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                    <button
                      className="openFileBtn"
                      onClick={() => window.open(assignment.attachment, "_blank")}
                    >
                      View
                    </button>
                    <a
                      href={assignment.attachment}
                      download
                      className="openFileBtn"
                      style={{ textAlign: "center", display: "inline-block" }}
                    >
                      Download
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isSubmitted ? (
            <div className="assignmentDetailRight">
              <div className="yourWorkTop">
                <h4 className="assignmentDetailWorkTitle">Your Work</h4>
              </div>

              {/* Drag & drop upload zone */}
              <div
                className={`ad-drop-zone ${dragOver ? "drag-over" : ""} ${uploadedFile ? "has-file" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <label className="ad-drop-label">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    hidden
                    onChange={handleInputChange}
                  />
                  {uploadedFile ? (
                    <div className="ad-file-preview">
                      <span className="ad-file-icon">📎</span>
                      <span className="ad-file-name">{uploadedFile.name}</span>
                      <span className="ad-file-size">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ) : (
                    <div className="ad-drop-empty">
                      <span className="ad-drop-icon">⬆</span>
                      <span className="ad-drop-text">Drop file or click to upload</span>
                      <span className="ad-drop-hint">PDF, DOC, DOCX</span>
                    </div>
                  )}
                </label>
              </div>

              {uploadedFile && (
                <button
                  className="ad-cancel-btn"
                  onClick={() => setUploadedFile(null)}
                >
                  ✕ Remove file
                </button>
              )}

              <button
                className={`assignmentDetailSubmitBtn ${submitSuccess ? "submit-success" : ""}`}
                onClick={() => setConfirmOpen(true)}
                disabled={!uploadedFile || submitting}
              >
                {submitting ? (
                  <span className="ad-btn-spinner" />
                ) : submitSuccess ? (
                  "✓ Submitted!"
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          ) : (
            <CompletedAssignment
              assignment={{
                title: assignment.title,
                subject: assignment.subject_name || "",
                chapter: assignment.chapter_name || "",
                teacher: assignment.teacher_name || "",
                description: assignment.description,
                assignedOn: assignment.assigned_on
                  ? new Date(assignment.assigned_on).toLocaleDateString("en-GB")
                  : "",
                dueDate: assignment.due_date
                  ? new Date(assignment.due_date).toLocaleDateString("en-GB")
                  : "",
                teacherFile: assignment.attachment
                  ? { name: assignment.attachment.split("/").pop(), size: "—", url: assignment.attachment }
                  : null,
                submittedOn: formatSmallDate(submittedAt),
                submissionStatus: assignment.submission_status_label || "",
                submittedFile: assignment.submitted_file
                  ? {
                      name: assignment.submitted_file.split("/").pop(),
                      size: "—",
                      type: assignment.submitted_file.split(".").pop().toUpperCase(),
                      url: assignment.submitted_file,
                    }
                  : null,
              }}
            />
          )}

        </div>
      </div>

      {/* Confirm submit modal */}
      {confirmOpen && (
        <div className="ad-modal-overlay" onClick={() => setConfirmOpen(false)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <p className="ad-modal-title">Submit assignment?</p>
            <p className="ad-modal-sub">
              You're submitting <strong>{uploadedFile?.name}</strong>. This cannot be undone.
            </p>
            <div className="ad-modal-actions">
              <button className="ad-modal-cancel" onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button className="ad-modal-confirm" onClick={handleSubmit}>Yes, submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}