import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const BASE_URL = import.meta.env.VITE_API_URL;
const SERIES = [
  "Fabula Series",
  "Endless Surface",
  "Endless Collection",
  "PGVT Series (Glossy)",
  "Matt Series",
  "Shine Finish",
  "Colorica Series (Glossy)",
  "Fabula Series Plain"
];

const CATEGORIES = [
  "Polished Surface",
  "HI Surface",
  "Marble Surface",
  "Porce Surface",
  "GHR Surface"
];

// Quick reply templates
const QUICK_REPLIES = [
  "Thank you for your enquiry! We have received your details and will reach you shortly.",
  "We have noted your enquiry. Our team will call you within 24 hours.",
  "Thank you for your interest in our tiles. We will get back to you shortly with more details.",
  "We have received your request. Our showroom executive will call you soon to assist you further.",
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filterCategory, setFilterCategory] = useState("");
  const [filterSeries, setFilterSeries] = useState("");

  const [form, setForm] = useState({ name: "", series: "", category: "" });

  const [tileFile, setTileFile] = useState(null);
  const [hoverFile, setHoverFile] = useState(null);
  const [previewFiles, setPreviewFiles] = useState([]);

  const [tilePreview, setTilePreview] = useState("");
  const [hoverPreview, setHoverPreview] = useState("");
  const [previewPreviews, setPreviewPreviews] = useState([]);

  const [profileForm, setProfileForm] = useState({ email: "", password: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Reply state — keyed by enquiry id
  const [replyOpen, setReplyOpen] = useState({});     // { [id]: true/false }
  const [replyText, setReplyText] = useState({});      // { [id]: string }
  const [replySending, setReplySending] = useState({}); // { [id]: true/false }
  const [replySent, setReplySent] = useState({});      // { [id]: true/false }

  const fetchProducts = async () => {
    const res = await fetch(`${BASE_URL}/api/products`);
    const data = await res.json();
    setProducts(data);
  };

  const fetchEnquiries = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/contact/all`);
      const data = await res.json();
      setEnquiries(data);
    } catch (err) {
      console.error("Failed to fetch enquiries", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchEnquiries();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleTile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setTileFile(f);
    setTilePreview(URL.createObjectURL(f));
  };

  const handleHover = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setHoverFile(f);
    setHoverPreview(URL.createObjectURL(f));
  };

  const handlePreviews = (e) => {
    const files = Array.from(e.target.files);
    setPreviewFiles(files);
    setPreviewPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const resetForm = () => {
    setForm({ name: "", series: "", category: "" });
    setTileFile(null);
    setHoverFile(null);
    setPreviewFiles([]);
    setTilePreview("");
    setHoverPreview("");
    setPreviewPreviews([]);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("series", form.series);
    fd.append("category", form.series === "Endless Surface" ? form.category : "");
    if (tileFile) fd.append("tileImage", tileFile);
    if (hoverFile) fd.append("hoverImage", hoverFile);
    previewFiles.forEach(f => fd.append("previewImages", f));
    const url = editingId
      ? `${BASE_URL}/api/products/${editingId}`
      : `${BASE_URL}/api/products`;
    const method = editingId ? "PUT" : "POST";
    await fetch(url, { method, body: fd });
    resetForm();
    fetchProducts();
    setLoading(false);
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, series: p.series, category: p.category || "" });
    setTilePreview(`${BASE_URL}${p.tileImage}`);
    setHoverPreview(p.hoverImage ? `${BASE_URL}${p.hoverImage}` : "");
    setPreviewPreviews((p.previewImages || []).map(i => `${BASE_URL}${i}`));
    setEditingId(p._id);
    setActiveTab("add-product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`${BASE_URL}/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const filteredProducts = products.filter((p) => {
    if (filterSeries && p.series !== filterSeries) return false;
    if (filterSeries === "Endless Surface" && filterCategory) {
      return p.category === filterCategory;
    }
    return true;
  });

  const handleProfileChange = (e) =>
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg("");
    try {
      await fetch(`${BASE_URL}/api/admin/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm)
      });
      setProfileMsg("Profile updated successfully!");
    } catch {
      setProfileMsg("Failed to update profile.");
    }
    setProfileLoading(false);
  };

  // ── REPLY HANDLERS ──
  const toggleReply = (id) => {
    setReplyOpen(prev => ({ ...prev, [id]: !prev[id] }));
    // Pre-fill with first quick reply if empty
    if (!replyText[id]) {
      setReplyText(prev => ({ ...prev, [id]: QUICK_REPLIES[0] }));
    }
  };

  const handleQuickReply = (id, text) => {
    setReplyText(prev => ({ ...prev, [id]: text }));
  };

  const handleSendReply = (enquiry) => {
    const id = enquiry._id;
    const message = replyText[id];
    if (!message?.trim()) return;

    if (!enquiry.phone) {
      alert("No phone number found for this customer.");
      return;
    }

    // Normalise to international format 91XXXXXXXXXX (no + needed for wa.me)
    const digits = enquiry.phone.replace(/\D/g, "");
    const intlPhone = digits.startsWith("91") ? digits : `91${digits}`;

    // Opens WhatsApp Web in a new tab with number + message pre-filled
    // Admin just clicks Send inside WhatsApp Web — zero API needed
    const waLink = `https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`;
    window.open(waLink, "_blank");

    // Mark as sent in UI
    setReplySent(prev => ({ ...prev, [id]: true }));
    setReplyOpen(prev => ({ ...prev, [id]: false }));
    setTimeout(() => setReplySent(prev => ({ ...prev, [id]: false })), 4000);
  };

  const NAV_TABS = [
    { key: "profile", label: "Admin Profile" },
    { key: "products", label: "Products", count: products.length },
    { key: "add-product", label: "Add Product" },
    { key: "enquiries", label: "Enquiries", count: enquiries.length }
  ];

  return (
    <div className="admin-wrapper">

      {/* ── TOP NAV ── */}
      <header className="admin-topbar">
        <div className="admin-brand">Admin Panel</div>
        <nav className="admin-nav">
          {NAV_TABS.map(tab => (
            <button
              key={tab.key}
              className={`nav-tab${activeTab === tab.key ? " active" : ""}`}
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.key !== "add-product") resetForm();
              }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="nav-badge">{tab.count}</span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="admin-content">

        {/* ── ADMIN PROFILE ── */}
        {activeTab === "profile" && (
          <div className="card">
            <div className="card-header">
              <h2>Admin Profile</h2>
              <p className="card-sub">Update your login credentials</p>
            </div>
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-grid-2">
                <div className="field-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <div className="field-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={profileForm.password}
                    onChange={handleProfileChange}
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </div>
              {profileMsg && (
                <p className={`profile-msg ${profileMsg.includes("success") ? "success" : "error"}`}>
                  {profileMsg}
                </p>
              )}
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={profileLoading}>
                  {profileLoading ? "Updating…" : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── PRODUCTS LIST ── */}
        {activeTab === "products" && (
          <div className="card">
            <div className="card-header row-between">
              <div>
                <h2>
                  Products
                  <span className="count-pill">{filteredProducts.length}</span>
                </h2>
                <p className="card-sub">Manage your product catalogue</p>
              </div>
              <button className="btn-primary" onClick={() => setActiveTab("add-product")}>
                + Add Product
              </button>
            </div>

            <div className="filter-row">
              <select
                value={filterSeries}
                onChange={(e) => { setFilterSeries(e.target.value); setFilterCategory(""); }}
              >
                <option value="">All Series</option>
                {SERIES.map(s => <option key={s}>{s}</option>)}
              </select>
              {filterSeries === "Endless Surface" && (
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="empty-state">No products found.</div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map(p => (
                  <div className="product-card" key={p._id}>
                    <div className="product-img-wrap">
                      <img
                        src={`${BASE_URL}${p.tileImage}`}
                        alt={p.name}
                        className="product-img"
                      />
                      {p.previewImages?.length > 0 && (
                        <span className="preview-badge">
                          {p.previewImages.length} previews
                        </span>
                      )}
                    </div>
                    <div className="product-info">
                      <p className="product-name">{p.name}</p>
                      <p className="product-series">{p.series}</p>
                      {p.category && (
                        <p className="product-cat">{p.category}</p>
                      )}
                    </div>
                    <div className="product-actions">
                      <button className="btn-edit" onClick={() => handleEdit(p)}>
                        Edit
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(p._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ADD / EDIT PRODUCT ── */}
        {activeTab === "add-product" && (
          <div className="card">
            <div className="card-header">
              <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
              <p className="card-sub">
                {editingId ? "Update product details below" : "Fill in the details to add a product"}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid-3">
                <div className="field-group">
                  <label>Product Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="field-group">
                  <label>Series</label>
                  <select name="series" value={form.series} onChange={handleChange} required>
                    <option value="">Select Series</option>
                    {SERIES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                {form.series === "Endless Surface" && (
                  <div className="field-group">
                    <label>Category</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                      <option value="">Select Category</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="section-divider"><span>Image Uploads</span></div>

              <div className="upload-grid">
                <div className="field-group">
                  <label>Tile Image</label>
                  <input type="file" accept="image/*" onChange={handleTile} />
                  {tilePreview && (
                    <img className="preview-img" src={tilePreview} alt="tile preview" />
                  )}
                </div>
                <div className="field-group">
                  <label>Hover Image</label>
                  <input type="file" accept="image/*" onChange={handleHover} />
                  {hoverPreview && (
                    <img className="preview-img" src={hoverPreview} alt="hover preview" />
                  )}
                </div>
              </div>

              <div className="field-group" style={{ marginTop: "20px" }}>
                <label>
                  Preview Images <span className="label-hint">(select multiple)</span>
                </label>
                <input type="file" multiple accept="image/*" onChange={handlePreviews} />
                {previewPreviews.length > 0 && (
                  <div className="preview-strip">
                    {previewPreviews.map((p, i) => (
                      <img key={i} src={p} alt={`preview-${i}`} />
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => { resetForm(); setActiveTab("products"); }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Saving…" : editingId ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── ENQUIRIES ── */}
        {activeTab === "enquiries" && (
          <div className="card">
            <div className="card-header">
              <h2>
                Enquiry Details
                <span className="count-pill">{enquiries.length}</span>
              </h2>
              <p className="card-sub">View and reply to customer enquiries</p>
            </div>

            {enquiries.length === 0 ? (
              <div className="empty-state">No enquiries received yet.</div>
            ) : (
              <div className="enquiry-grid">
                {enquiries.map((e, i) => {
                  const id = e._id || i;
                  const isOpen = replyOpen[id];
                  const isSent = replySent[id];
                  const isSending = replySending[id];

                  return (
                    <div className={`enquiry-card ${isOpen ? "reply-expanded" : ""}`} key={id}>

                      {/* Tile image */}
                      <div className="enquiry-img-wrap">
                        {e.tileImage ? (
                          <img
                            src={`${BASE_URL}${e.tileImage}`}
                            alt={e.tileName || "Tile"}
                            className="enquiry-img"
                          />
                        ) : (
                          <div className="enquiry-no-img">No Image</div>
                        )}
                      </div>

                      {/* Body */}
                      <div className="enquiry-body">
                        <div className="enquiry-top-row">
                          <span className="enquiry-name">{e.name}</span>
                          <span className="enquiry-date">
                            {e.createdAt ? new Date(e.createdAt).toLocaleDateString() : "—"}
                          </span>
                        </div>
                        {e.phone && <p className="enquiry-phone">📞 {e.phone}</p>}
                        {e.email && <p className="enquiry-email">✉️ {e.email}</p>}
                        {e.tileName && <p className="enquiry-tile-name">🪟 {e.tileName}</p>}
                        {e.message && <p className="enquiry-message">{e.message}</p>}

                        {/* Reply success banner */}
                        {isSent && (
                          <div className="reply-sent-banner">
                            ✓ Reply sent successfully
                          </div>
                        )}

                        {/* Reply toggle button */}
                        <button
                          className={`btn-reply-toggle ${isOpen ? "open" : ""}`}
                          onClick={() => toggleReply(id)}
                        >
                          {isOpen ? "✕ Close Reply" : "↩ Reply to Customer"}
                        </button>
                      </div>

                      {/* Reply panel — slides open */}
                      {isOpen && (
                        <div className="reply-panel">
                          <div className="reply-panel-head">
                            <span className="reply-to-label">
                              Replying to: <strong>{e.name}</strong>
                              {e.phone
                                ? <span className="reply-to-phone"> · 📱 {e.phone}</span>
                                : <span style={{color:"#e53e3e"}}> · ⚠ No phone number</span>
                              }
                            </span>
                            <p style={{fontSize:"12px",color:"#888",marginTop:"6px",fontStyle:"italic"}}>
                              WhatsApp Web opens in a new tab with this message pre-filled — just press Send.
                            </p>
                          </div>

                          {/* Quick reply chips */}
                          <div className="quick-reply-chips">
                            <span className="chips-label">Quick Replies:</span>
                            {QUICK_REPLIES.map((qr, qi) => (
                              <button
                                key={qi}
                                className={`chip ${replyText[id] === qr ? "chip-active" : ""}`}
                                onClick={() => handleQuickReply(id, qr)}
                              >
                                {qi + 1}. {qr.slice(0, 40)}…
                              </button>
                            ))}
                          </div>

                          {/* Message textarea */}
                          <textarea
                            className="reply-textarea"
                            rows={4}
                            placeholder="Type your reply here…"
                            value={replyText[id] || ""}
                            onChange={(ev) =>
                              setReplyText(prev => ({ ...prev, [id]: ev.target.value }))
                            }
                          />

                          <div className="reply-actions">
                            <button
                              className="btn-secondary"
                              onClick={() => toggleReply(id)}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn-send-reply"
                              disabled={!replyText[id]?.trim() || !e.phone}
                              onClick={() => handleSendReply(e)}
                            >
                              💬 Send on WhatsApp
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;