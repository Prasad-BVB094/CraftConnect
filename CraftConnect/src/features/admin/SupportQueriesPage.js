import React, { useState, useEffect } from "react";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import apiService from "../../shared/services/api";
import { useAuth } from "../../shared/hooks/useAuth";
import { useNavigate } from "react-router-dom";

function SupportQueriesPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") {
      navigate("/login/admin", { replace: true });
      return;
    }
    fetchQueries();
  }, [user, authLoading, filter]);

  const fetchQueries = async () => {
    try {
      const filterParam = filter === "all" ? {} : { status: filter };
      const data = await apiService.getSupportQueries(filterParam);
      setQueries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch queries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedQuery) return;
    setReplying(true);
    try {
      await apiService.replyToSupportQuery(selectedQuery._id, replyText);
      setReplyText("");
      setSelectedQuery(null);
      fetchQueries();
    } catch (err) {
      alert("Failed to send reply");
    } finally {
      setReplying(false);
    }
  };

  const handleStatusChange = async (queryId, newStatus) => {
    try {
      await apiService.updateSupportQueryStatus(queryId, newStatus);
      fetchQueries();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (queryId) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    try {
      await apiService.deleteSupportQuery(queryId);
      fetchQueries();
    } catch (err) {
      alert("Failed to delete query");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: "#FFF3E0", text: "#E65100" },
      "in-progress": { bg: "#E3F2FD", text: "#1565C0" },
      resolved: { bg: "#E8F5E9", text: "#2E7D32" },
      closed: { bg: "#ECEFF1", text: "#546E7A" }
    };
    return colors[status] || colors.pending;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return React.createElement(
    "div",
    { style: { minHeight: "100vh", background: "linear-gradient(180deg, #FDFBF7 0%, #F8F4EF 100%)" } },
    React.createElement(Navbar),

    React.createElement(
      "div",
      { className: "container", style: { padding: "30px 20px", maxWidth: "1400px", margin: "0 auto" } },

      /* HEADER */
      React.createElement(
        "div",
        { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" } },
        React.createElement(
          "div",
          null,
          React.createElement("button", {
            onClick: () => navigate("/admin/dashboard"),
            style: { background: "transparent", border: "none", color: "#A68A64", cursor: "pointer", marginBottom: "8px", fontSize: "14px" }
          }, "← Back to Dashboard"),
          React.createElement("h1", {
            style: { fontFamily: "'Playfair Display', serif", fontSize: "32px", color: "#3E2723", margin: 0 }
          }, "💬 Support Queries")
        ),

        /* FILTERS */
        React.createElement(
          "div",
          { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
          ["all", "pending", "in-progress", "resolved", "closed"].map((f) =>
            React.createElement(
              "button",
              {
                key: f,
                onClick: () => setFilter(f),
                style: {
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: filter === f ? "2px solid #A68A64" : "1px solid rgba(166,138,100,0.3)",
                  background: filter === f ? "#A68A64" : "#fff",
                  color: filter === f ? "#fff" : "#5D4037",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "500",
                  textTransform: "capitalize"
                }
              },
              f === "all" ? "All Queries" : f.replace("-", " ")
            )
          )
        )
      ),

      /* QUERIES LIST */
      loading
        ? React.createElement("div", { style: { textAlign: "center", padding: "60px", color: "#8D6E63" } }, "Loading queries...")
        : queries.length === 0
        ? React.createElement(
            "div",
            {
              style: {
                textAlign: "center",
                padding: "80px 20px",
                background: "#fff",
                borderRadius: "20px",
                border: "1px solid rgba(166,138,100,0.15)"
              }
            },
            React.createElement("div", { style: { fontSize: "60px", marginBottom: "20px" } }, "📭"),
            React.createElement("h3", { style: { color: "#3E2723", marginBottom: "10px" } }, "No Queries Found"),
            React.createElement("p", { style: { color: "#8D6E63" } }, "There are no support queries matching your filter.")
          )
        : React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px" } },
            queries.map((query) =>
              React.createElement(
                "div",
                {
                  key: query._id,
                  style: {
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "24px",
                    border: "1px solid rgba(166,138,100,0.15)",
                    boxShadow: "0 4px 16px rgba(166,138,100,0.06)"
                  }
                },
                /* QUERY HEADER */
                React.createElement(
                  "div",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" } },
                  React.createElement(
                    "div",
                    null,
                    React.createElement("h4", { style: { margin: "0 0 8px", color: "#3E2723", fontSize: "18px" } }, query.subject),
                    React.createElement("div", { style: { fontSize: "13px", color: "#8D6E63" } },
                      `From: ${query.name} • ${query.email} ${query.phone ? `• ${query.phone}` : ""}`
                    ),
                    React.createElement("div", { style: { fontSize: "12px", color: "#A1887F", marginTop: "4px" } },
                      formatDate(query.createdAt)
                    )
                  ),
                  React.createElement(
                    "div",
                    { style: { display: "flex", gap: "8px", alignItems: "center" } },
                    React.createElement("span", {
                      style: {
                        background: getStatusColor(query.status).bg,
                        color: getStatusColor(query.status).text,
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "uppercase"
                      }
                    }, query.status.replace("-", " ")),
                    query.priority === "urgent" && React.createElement("span", {
                      style: { background: "#FFEBEE", color: "#C62828", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "600" }
                    }, "🚨 URGENT")
                  )
                ),

                /* MESSAGE */
                React.createElement(
                  "div",
                  {
                    style: {
                      background: "#FDFBF7",
                      padding: "16px",
                      borderRadius: "12px",
                      marginBottom: "16px",
                      border: "1px solid rgba(166,138,100,0.1)"
                    }
                  },
                  React.createElement("p", { style: { margin: 0, lineHeight: "1.6", color: "#5D4037" } }, query.message)
                ),

                /* ADMIN REPLY (if exists) */
                query.adminReply && React.createElement(
                  "div",
                  {
                    style: {
                      background: "#E8F5E9",
                      padding: "16px",
                      borderRadius: "12px",
                      marginBottom: "16px",
                      borderLeft: "4px solid #4CAF50"
                    }
                  },
                  React.createElement("div", { style: { fontSize: "12px", fontWeight: "600", color: "#2E7D32", marginBottom: "8px" } },
                    `Admin Reply • ${query.repliedAt ? formatDate(query.repliedAt) : ""}`
                  ),
                  React.createElement("p", { style: { margin: 0, color: "#33691E" } }, query.adminReply)
                ),

                /* ACTIONS */
                React.createElement(
                  "div",
                  { style: { display: "flex", gap: "10px", flexWrap: "wrap" } },
                  selectedQuery?._id === query._id
                    ? React.createElement(
                        "div",
                        { style: { flex: 1, display: "flex", gap: "10px", flexWrap: "wrap" } },
                        React.createElement("textarea", {
                          value: replyText,
                          onChange: (e) => setReplyText(e.target.value),
                          placeholder: "Type your reply...",
                          style: {
                            flex: 1,
                            minWidth: "200px",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1px solid rgba(166,138,100,0.3)",
                            resize: "vertical",
                            minHeight: "80px",
                            fontSize: "14px"
                          }
                        }),
                        React.createElement("button", {
                          onClick: handleReply,
                          disabled: replying,
                          style: {
                            background: "#4CAF50",
                            color: "#fff",
                            border: "none",
                            padding: "12px 24px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "500"
                          }
                        }, replying ? "Sending..." : "Send Reply"),
                        React.createElement("button", {
                          onClick: () => { setSelectedQuery(null); setReplyText(""); },
                          style: {
                            background: "#fff",
                            color: "#5D4037",
                            border: "1px solid rgba(166,138,100,0.3)",
                            padding: "12px 20px",
                            borderRadius: "10px",
                            cursor: "pointer"
                          }
                        }, "Cancel")
                      )
                    : React.createElement(
                        React.Fragment,
                        null,
                        React.createElement("button", {
                          onClick: () => setSelectedQuery(query),
                          style: {
                            background: "#A68A64",
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "500"
                          }
                        }, "💬 Reply"),
                        query.status !== "resolved" && React.createElement("button", {
                          onClick: () => handleStatusChange(query._id, "resolved"),
                          style: {
                            background: "#E8F5E9",
                            color: "#2E7D32",
                            border: "1px solid #A5D6A7",
                            padding: "10px 20px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "500"
                          }
                        }, "✓ Mark Resolved"),
                        query.status !== "closed" && React.createElement("button", {
                          onClick: () => handleStatusChange(query._id, "closed"),
                          style: {
                            background: "#ECEFF1",
                            color: "#546E7A",
                            border: "1px solid #B0BEC5",
                            padding: "10px 20px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "500"
                          }
                        }, "Close"),
                        React.createElement("button", {
                          onClick: () => handleDelete(query._id),
                          style: {
                            background: "#fff",
                            color: "#C62828",
                            border: "1px solid #EF9A9A",
                            padding: "10px 20px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "500"
                          }
                        }, "🗑️ Delete")
                      )
                )
              )
            )
          )
    ),

    React.createElement(Footer)
  );
}

export default SupportQueriesPage;
