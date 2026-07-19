import React, { useState, useEffect } from "react";
import { Bookmark, ChevronDown, ChevronRight, Plus, X, Pencil, Trash2, Globe } from "lucide-react";

const PRESET_COLORS = [
  "#A78BFA", "#6EE7B7", "#F472B6", "#38BDF8", "#FB923C", "#FACC15", "#F87171", "#34D399"
];

export function Sidebar({ categories, activeCategory, onSelectCategory, onAddCategory, onDeleteCategory }) {
  const [catOpen, setCatOpen] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddCategory({ name: newName.trim(), color: newColor });
    setNewName("");
    setNewColor(PRESET_COLORS[0]);
    setAdding(false);
  };

  return (
    <div className="w-52 shrink-0 glass-sidebar rounded-2xl p-4 flex flex-col gap-1 h-fit sticky top-6">
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          activeCategory === null
            ? "bg-[rgba(167,139,250,0.15)] text-[#A78BFA]"
            : "text-[rgba(255,255,255,0.7)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
        }`}
      >
        <Bookmark size={15} />
        All Bookmarks
      </button>

      <div className="mt-3">
        <button
          onClick={() => setCatOpen(!catOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.4)]"
        >
          Categories
          {catOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {catOpen && (
          <div className="flex flex-col gap-0.5 mt-1">
            {categories.map((cat) => (
              <div key={cat.id} className="group flex items-center">
                <button
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                    activeCategory === cat.id
                      ? "bg-[rgba(167,139,250,0.12)] text-white"
                      : "text-[rgba(255,255,255,0.55)] hover:text-white hover:bg-[rgba(255,255,255,0.04)]"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color || "#A78BFA" }} />
                  {cat.name}
                </button>
                <button
                  onClick={() => onDeleteCategory(cat.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-[rgba(255,255,255,0.3)] hover:text-red-400 transition-all"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {adding ? (
              <div className="px-2 py-2 flex flex-col gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="Category name"
                  autoFocus
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs glass-input text-white placeholder:text-[rgba(255,255,255,0.3)] outline-none"
                />
                <div className="flex gap-1.5 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewColor(c)}
                      className={`w-5 h-5 rounded-full transition-all ${newColor === c ? "ring-2 ring-white/30 scale-110" : "hover:scale-110"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <button onClick={handleAdd} className="flex-1 px-2 py-1 rounded-lg text-xs bg-[rgba(167,139,250,0.2)] text-[#A78BFA] hover:bg-[rgba(167,139,250,0.3)] transition-colors">
                    Add
                  </button>
                  <button onClick={() => setAdding(false)} className="px-2 py-1 rounded-lg text-xs text-[rgba(255,255,255,0.4)] hover:text-white transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAdding(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[rgba(255,255,255,0.35)] hover:text-[#A78BFA] transition-colors"
              >
                <Plus size={14} />
                New Category
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function BookmarkCard({ bookmark, category, onEdit, onDelete }) {
  const faviconUrl = (() => {
    try {
      const host = new URL(bookmark.url).hostname;
      return `https://www.google.com/s2/favicons?domain=${host}&sz=32`;
    } catch { return null; }
  })();

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[rgba(255,255,255,0.06)] flex items-center justify-center shrink-0">
            {faviconUrl ? (
              <img src={faviconUrl} alt="" className="w-5 h-5 rounded" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            ) : null}
            <Globe size={16} className="text-[rgba(255,255,255,0.4)]" style={{ display: faviconUrl ? 'none' : 'block' }} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">{bookmark.title}</h3>
            <p className="text-[11px] font-mono text-[rgba(255,255,255,0.3)] truncate">{bookmark.url?.replace(/^https?:\/\//, '')}</p>
          </div>
        </div>
        {category && (
          <span
            className="shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium"
            style={{
              backgroundColor: `${category.color || '#A78BFA'}20`,
              color: category.color || '#A78BFA',
            }}
          >
            {category.name}
          </span>
        )}
      </div>

      {bookmark.description && (
        <p className="text-xs text-[rgba(255,255,255,0.45)] leading-relaxed line-clamp-3">
          {bookmark.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-1">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-mono text-[#6EE7B7] hover:text-[#A78BFA] transition-colors truncate max-w-[70%]"
        >
          URL: {bookmark.url?.replace(/^https?:\/\//, '')}
        </a>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(bookmark)} className="p-1.5 rounded-lg text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-all">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(bookmark.id)} className="p-1.5 rounded-lg text-[rgba(255,255,255,0.4)] hover:text-red-400 hover:bg-[rgba(255,0,0,0.08)] transition-all">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function BookmarkModal({ open, onClose, onSave, categories, editingBookmark }) {
  const [form, setForm] = useState({ title: "", url: "", description: "", category_id: "" });

  useEffect(() => {
    if (editingBookmark) {
      setForm({
        title: editingBookmark.title || "",
        url: editingBookmark.url || "",
        description: editingBookmark.description || "",
        category_id: editingBookmark.category_id || "",
      });
    } else {
      setForm({ title: "", url: "", description: "", category_id: "" });
    }
  }, [editingBookmark, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return;
    onSave({ ...form, id: editingBookmark?.id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card rounded-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-heading font-semibold text-white">
            {editingBookmark ? "Edit Bookmark" : "Add Bookmark"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="text-[11px] font-medium text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-1.5 block">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Bookmark title"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder:text-[rgba(255,255,255,0.25)] outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-1.5 block">URL</label>
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://example.com"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white font-mono placeholder:text-[rgba(255,255,255,0.25)] outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description (optional)"
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder:text-[rgba(255,255,255,0.25)] outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-1.5 block">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white outline-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#12121a]">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#12121a]">{cat.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="mt-2 px-4 py-2.5 rounded-xl bg-[rgba(167,139,250,0.2)] text-[#A78BFA] font-medium text-sm hover:bg-[rgba(167,139,250,0.3)] border border-[rgba(167,139,250,0.2)] transition-all duration-200"
          >
            {editingBookmark ? "Save Changes" : "Add Bookmark"}
          </button>
        </form>
      </div>
    </div>
  );
}
