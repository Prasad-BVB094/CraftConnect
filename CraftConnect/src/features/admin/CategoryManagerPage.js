import React, { useEffect, useState } from "react";
import Navbar from "../../shared/components/Navbar";
import apiService from "../../shared/services/api";


function CategoryManagerPage() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };
  fetchCategories();
}, []);


  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

 async function addCategory() {
  if (!newCategory.trim()) return;

  try {
    const created = await apiService.createCategory({
      name: newCategory.trim(),
      description: newCategory.trim(),
    });

    setCategories([...categories, created]);
    setNewCategory("");
  } catch (err) {
    alert("Failed to add category");
  }
}


async function deleteCategory(id) {
  if (!window.confirm("Delete this category?")) return;

  try {
    await apiService.deleteCategory(id);
    setCategories(categories.filter(c => c._id !== id));
  } catch {
    alert("Delete failed");
  }
}


async function renameCategory(id) {
  const name = prompt("Enter new name");
  if (!name) return;

  try {
    const updated = await apiService.updateCategory(id, { name });
    setCategories(categories.map(c => c._id === id ? updated : c));
  } catch {
    alert("Rename failed");
  }
}


  return React.createElement(
    "div",
    { className: "container" },

    React.createElement(Navbar),

    /* TITLE */
    React.createElement(
      "h2",
      {
        style: {
          marginTop: "30px",
          marginBottom: "15px",
          fontFamily: "'Playfair Display', serif",
          color: "var(--accent)",
        },
      },
      "Category Manager"
    ),

    /* ADD CATEGORY INPUT */
    React.createElement(
      "div",
      { style: { display: "flex", gap: "12px", marginBottom: "20px" } },

      React.createElement("input", {
        type: "text",
        placeholder: "Add new category…",
        value: newCategory,
        onChange: (e) => setNewCategory(e.target.value),
        style: {
          flex: 1,
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid rgba(62,44,32,0.1)",
          fontSize: "15px",
        },
      }),

      React.createElement(
        "button",
        { className: "cta", onClick: addCategory },
        "Add"
      )
    ),

    /* SEARCH */
    React.createElement("input", {
      type: "text",
      placeholder: "Search categories…",
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
    }),

    /* CATEGORY LIST CARD */
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

        /* HEADER */
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            header("ID"),
            header("Category Name"),
            header("Actions")
          )
        ),

        /* BODY */
        React.createElement(
          "tbody",
          null,
          filtered.map((cat) =>
            React.createElement(
              "tr",
              {
                key: cat._id,
                style: {
                  borderBottom: "1px solid rgba(62,44,32,0.08)",
                },
              },

              cell(cat._id),
              cell(cat.name),

              React.createElement(
                "td",
                {
                  style: {
                    padding: "12px 0",
                    display: "flex",
                    gap: "10px",
                  },
                },

                React.createElement(
                  "button",
                  {
                    className: "cta",
                    style: { padding: "6px 10px", fontSize: "12px" },
                    onClick: () => renameCategory(cat._id),
                  },
                  "Rename"
                ),

                React.createElement(
                  "button",
                  {
                    className: "cta secondary-cta",
                    style: { padding: "6px 10px", fontSize: "12px" },
                    onClick: () => deleteCategory(cat._id),
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

/* Helpers */
function header(text) {
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

export default CategoryManagerPage;
