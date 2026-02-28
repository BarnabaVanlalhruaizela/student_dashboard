import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/apiClient";
import "../styles/subjectDetails.css";

export default function SubjectDetails() {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [subjectDetails, setSubjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjectDetails() {
      try {
        const res = await api.get(
          `/courses/subjects/${subjectId}/dashboard/`
        );
        setSubjectDetails(res.data);
      } catch (err) {
        console.error("Failed to load subject details", err);
        setSubjectDetails(null);
      } finally {
        setLoading(false);
      }
    }

    if (subjectId) {
      fetchSubjectDetails();
    }
  }, [subjectId]);

  if (loading) {
    return (
      <div className="subjectDetailsPage">
        <div className="subjectDetailsBox">
          <p>Loading subject...</p>
        </div>
      </div>
    );
  }

  if (!subjectDetails) {
    return (
      <div className="subjectDetailsPage">
        <div className="subjectDetailsBox">
          <p>Subject not found.</p>
        </div>
      </div>
    );
  }

  const teachers = subjectDetails.teachers || [];

  return (
    <div className="subjectDetailsPage">
      <div className="subjectDetailsBox">
        <div className="subjectDetailsTop">
          <button className="backBtn" onClick={() => navigate(-1)}>
            &larr; Back
          </button>
        </div>

        <h1 className="subjectNameTitle">
          {subjectDetails.name}
        </h1>

        {/* ================= TEACHERS ================= */}
        {teachers.length === 0 ? (
          <p>No teachers assigned.</p>
        ) : (
          <div className="teachersScrollWrapper">
            {teachers.map((teacher) => (
              <div
                className="teacherDetailsCard"
                key={teacher.id}
              >
                <div className="teacherLeft">
                  <h3 className="teacherName">
                    {teacher.name}
                  </h3>

                  <div className="teacherRoleBadge">
                    {teacher.display_role}
                  </div>

                  <div className="teacherInfoGrid">
                    <div className="teacherInfoRow">
                      <span className="label">
                        Qualification:
                      </span>
                      <span className="value">
                        {teacher.qualification || "—"}
                      </span>
                    </div>

                    <div className="teacherInfoRow">
                      <span className="label">
                        Rating:
                      </span>
                      <span className="value">
                        {teacher.rating ?? "—"}
                      </span>
                    </div>

                    <div className="teacherInfoRow">
                      <span className="label">
                        About:
                      </span>
                      <span className="value">
                        {teacher.bio || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="teacherRight">
                  <img
                    src={
                      teacher.photo ||
                      "/default-teacher.png"
                    }
                    alt={teacher.name}
                    className="teacherPhoto"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= OPTIONAL STATS (SAFE) ================= */}
        {subjectDetails.assignments &&
          subjectDetails.quizzes && (
            <div className="bottomGrid">
              <div className="assignQuizCard">
                <h2>Assignments</h2>
                <div className="metricsRow">
                  <div>
                    {subjectDetails.assignments.pending}
                  </div>
                  <div>
                    {subjectDetails.assignments.completed}
                  </div>
                  <div>
                    {subjectDetails.assignments.total}
                  </div>
                </div>
              </div>

              <div className="assignQuizCard">
                <h2>Quiz</h2>
                <div className="metricsRow">
                  <div>
                    {subjectDetails.quizzes.pending}
                  </div>
                  <div>
                    {subjectDetails.quizzes.completed}
                  </div>
                  <div>
                    {subjectDetails.quizzes.total}
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}