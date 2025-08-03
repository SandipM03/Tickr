import { useEffect, useState } from "react";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "tickets") {
      fetchTickets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);
  
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || data);
        setFilteredUsers(data.users || data);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("Error fetching users");
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setTickets(data.tickets || data);
      } else {
        setError(data.error || "Failed to fetch tickets");
      }
    } catch (err) {
      setError("Error fetching tickets");
      console.error("Error fetching tickets", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToModerator = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/admin/users/${userId}/promote`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("User promoted to moderator successfully!");
        fetchUsers();
      } else {
        alert(data.error || "Failed to promote user");
      }
    } catch (err) {
      alert("Error promoting user");
      console.error("Error promoting user", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSkills = async (userId, skills) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/admin/users/${userId}/skills`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean)
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("User skills updated successfully!");
        setEditingUser(null);
        setFormData({ role: "", skills: "" });
        fetchUsers();
      } else {
        alert(data.error || "Failed to update skills");
      }
    } catch (err) {
      alert("Error updating skills");
      console.error("Error updating skills", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setFormData({
      role: user.role,
      skills: user.skills?.join(", ") || "",
    });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter((user) => user.email.toLowerCase().includes(query))
    );
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'TODO': return 'badge-warning';
      case 'IN_PROGRESS': return 'badge-info';
      case 'RESOLVED': return 'badge-success';
      case 'CLOSED': return 'badge-neutral';
      case 'CANCELLED': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'badge-error';
      case 'moderator': return 'badge-warning';
      case 'user': return 'badge-info';
      default: return 'badge-ghost';
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <button 
          className={`tab ${activeTab === "users" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Manage Users
        </button>
        <button 
          className={`tab ${activeTab === "tickets" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("tickets")}
        >
          View All Tickets
        </button>
      </div>

      {loading && (
        <div className="flex justify-center mb-4">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>
          <input
            type="text"
            className="input input-bordered w-full mb-6"
            placeholder="Search by email"
            value={searchQuery}
            onChange={handleSearch}
          />
          
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-base-100 shadow rounded-lg p-6 border hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-lg font-semibold">{user.email}</p>
                      <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </div>
                    <p className="mb-2">
                      <strong>Skills:</strong>{" "}
                      {user.skills && user.skills.length > 0
                        ? user.skills.join(", ")
                        : "No skills assigned"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {user.role === "user" && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handlePromoteToModerator(user._id)}
                        disabled={loading}
                      >
                        Promote to Moderator
                      </button>
                    )}
                    {user.role !== "admin" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit Skills
                      </button>
                    )}
                  </div>
                </div>

                {editingUser === user._id && (
                  <div className="mt-4 p-4 bg-base-200 rounded">
                    <input
                      type="text"
                      placeholder="Comma-separated skills (e.g., JavaScript, React, Node.js)"
                      className="input input-bordered w-full mb-4"
                      value={formData.skills}
                      onChange={(e) =>
                        setFormData({ ...formData, skills: e.target.value })
                      }
                    />
                    <div className="flex gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleUpdateSkills(user._id, formData.skills)}
                        disabled={loading}
                      >
                        Save Skills
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setEditingUser(null);
                          setFormData({ role: "", skills: "" });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tickets Tab */}
      {activeTab === "tickets" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-base-100 shadow rounded-lg p-6 border hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{ticket.title}</h3>
                  <div className="flex gap-2">
                    <span className={`badge ${getStatusBadgeColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`badge ${ticket.isActive ? 'badge-success' : 'badge-neutral'}`}>
                      {ticket.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>
                
                <p className="mb-3 text-gray-600">{ticket.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Created By:</strong> {ticket.createdBy?.email || 'Unknown'}
                  </div>
                  <div>
                    <strong>Assigned To:</strong> {ticket.assignedTo?.email || 'Unassigned'}
                  </div>
                  <div>
                    <strong>Created:</strong> {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {ticket.relatedSkills && ticket.relatedSkills.length > 0 && (
                  <div className="mt-3">
                    <strong>Related Skills:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ticket.relatedSkills.map((skill, index) => (
                        <span key={index} className="badge badge-outline badge-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;