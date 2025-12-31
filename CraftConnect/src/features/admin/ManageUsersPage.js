import React, { useState } from "react";
import Navbar from "../../shared/components/Navbar";

function ManageUsersPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Rohit Sharma",
      email: "rohit@example.com",
      joined: "2024-02-10",
      status: "Active",
    },
    {
      id: 2,
      name: "Priya Menon",
      email: "priya@example.com",
      joined: "2024-01-20",
      status: "Blocked",
    },
    {
      id: 3,
      name: "Anil Kumar",
      email: "anil@example.com",
      joined: "2024-02-14",
      status: "Active",
    },
  ]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  const statusColors = {
    Active: "green",
    Blocked: "crimson",
  };

  const handleBlockUnblock = (id) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === "Active" ? "Blocked" : "Active" }
        : user
    ));
    alert(`User ${id} ${users.find(u => u.id === id)?.status === "Active" ? "blocked" : "unblocked"}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== id));
      alert(`User ${id} deleted`);
    }
  };

  const handleEdit = (id) => {
    const user = users.find(u => u.id === id);
    if (user) {
      const newName = prompt("Enter new name:", user.name);
      const newEmail = prompt("Enter new email:", user.email);
      
      if (newName !== null && newEmail !== null) {
        setUsers(users.map(u => 
          u.id === id 
            ? { ...u, name: newName || u.name, email: newEmail || u.email }
            : u
        ));
        alert(`User ${id} updated`);
      }
    }
  };

  const handleAddUser = () => {
    const name = prompt("Enter user name:");
    const email = prompt("Enter user email:");
    
    if (name && email) {
      const newUser = {
        id: Date.now(),
        name,
        email,
        joined: new Date().toISOString().split('T')[0],
        status: "Active"
      };
      setUsers([...users, newUser]);
      alert(`User added successfully`);
    }
  };

  return React.createElement(
    "div",
    { className: "container" },
    React.createElement(Navbar),

    /* TITLE AND ADD BUTTON */
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "30px",
          marginBottom: "20px",
        },
      },
      React.createElement(
        "h2",
        {
          style: {
            fontFamily: "'Playfair Display', serif",
            color: "var(--accent)",
            margin: 0,
          },
        },
        "Manage Users"
      ),
      React.createElement(
        "button",
        {
          className: "cta",
          onClick: handleAddUser,
        },
        "Add User"
      )
    ),

    /* SEARCH BAR */
    React.createElement(
      "input",
      {
        type: "text",
        placeholder: "Search users by name or email...",
        value: query,
        onChange: (e) => setQuery(e.target.value),
        style: {
          width: "100%",
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid rgba(62,44,32,0.1)",
          marginBottom: "20px",
          fontSize: "15px",
        },
      }
    ),

    /* USERS TABLE */
    React.createElement(
      "div",
      {
        style: {
          background: "linear-gradient(180deg,#fff,rgba(248,244,239,0.9))",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid rgba(62,44,32,0.08)",
          boxShadow: "0 6px 20px rgba(62,44,32,0.05)",
        },
      },

      React.createElement(
        "table",
        { style: { width: "100%", borderCollapse: "collapse" } },

        /* TABLE HEADER */
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            head("User ID"),
            head("Name"),
            head("Email"),
            head("Joined"),
            head("Status"),
            head("Actions")
          )
        ),

        /* TABLE BODY */
        React.createElement(
          "tbody",
          null,
          filtered.map((u) =>
            React.createElement(
              "tr",
              { key: u.id, style: { borderBottom: "1px solid rgba(62,44,32,0.08)" } },

              cell(u.id),
              cell(u.name),
              cell(u.email),
              cell(u.joined),

              /* STATUS BADGE */
              React.createElement(
                "td",
                null,
                React.createElement(
                  "span",
                  {
                    style: {
                      padding: "6px 10px",
                      color: "#fff",
                      borderRadius: "8px",
                      background: statusColors[u.status],
                      fontSize: "13px",
                    },
                  },
                  u.status
                )
              ),

              /* ACTION BUTTONS */
              React.createElement(
                "td",
                {
                  style: {
                    padding: "10px 0",
                    display: "flex",
                    gap: "10px",
                  },
                },

                /* EDIT BUTTON */
                React.createElement(
                  "button",
                  {
                    className: "cta",
                    style: {
                      padding: "6px 10px",
                      fontSize: "12px",
                    },
                    onClick: () => handleEdit(u.id),
                  },
                  "Edit"
                ),

                /* BLOCK / UNBLOCK */
                React.createElement(
                  "button",
                  {
                    className: "cta",
                    style: {
                      padding: "6px 10px",
                      fontSize: "12px",
                      marginLeft: "8px",
                    },
                    onClick: () => handleBlockUnblock(u.id),
                  },
                  u.status === "Active" ? "Block" : "Unblock"
                ),

                /* DELETE BUTTON */
                React.createElement(
                  "button",
                  {
                    className: "cta secondary-cta",
                    style: {
                      padding: "6px 10px",
                      fontSize: "12px",
                      marginLeft: "8px",
                    },
                    onClick: () => handleDelete(u.id),
                  },
                  "Delete"
                )
              )
            )
          )
        )
      )
    ),

    /* FOOTER */
    React.createElement(
      "footer",
      { style: { marginTop: "40px" } },
      React.createElement("div", null, "© CraftConnect — handcrafted community"),
      React.createElement("div", null, "Made with ❤️ | Beige & brown theme")
    )
  );
}

function head(text) {
  return React.createElement(
    "th",
    {
      style: {
        textAlign: "left",
        paddingBottom: "10px",
        borderBottom: "2px solid rgba(62,44,32,0.1)",
        color: "var(--secondary)",
      },
    },
    text
  );
}

function cell(text) {
  return React.createElement(
    "td",
    {
      style: {
        padding: "10px 0",
        fontSize: "14px",
        color: "var(--text)",
      },
    },
    text
  );
}

export default ManageUsersPage;
