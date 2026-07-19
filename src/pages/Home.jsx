import React, { useState, useEffect } from "react";
// import { base44 } from "@/api/base44Client";  // COMMENTED OUT - File missing
import { Search, Plus, Bookmark as BookmarkIcon } from "lucide-react";
import { Sidebar, BookmarkCard, BookmarkModal } from "@/components/BookmarkUI";

export default function Home() {
  const [bookmarks, setBookmarks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    // COMMENTED OUT - base44 missing
    // const [bk, cats] = await Promise.all([
    //   base44.entities.Bookmark.list("-created_date"),
    //   base44.entities.Category.list("name"),
    // ]);
    // setBookmarks(bk);
    // setCategories(cats);
    // setLoading(false);
    
    // TEMPORARY: Use mock data instead
    setBookmarks([
      { id: 1, title: "Google", url: "https://google.com", description: "Search engine", category_id: null },
      { id: 2, title: "GitHub", url: "https://github.com", description: "Code hosting", category_id: null },
    ]);
    setCategories([
      { id: 1, name: "Work" },
      { id: 2, name: "Personal" },
    ]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = bookmarks.filter((b) => {
    if (activeCategory && b.category_id !== activeCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.title?.toLowerCase().includes(q) ||
        b.url?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  const handleSaveBookmark = async (data) => {
    // COMMENTED OUT - base44 missing
    // if (data.id) {
    //   await base44.entities.Bookmark.update(data.id, {
    //     title: data.title, url: data.url, description: data.description, category_id: data.category_id || null,
    //   });
    // } else {
    //   await base44.entities.Bookmark.create({
    //     title: data.title, url: data.url, description: data.description, category_id: data.category_id || null,
    //   });
    // }
    // setModalOpen(false);
    // setEditing(null);
    // load();
    
    // TEMPORARY: Just close modal
    setModalOpen(false);
    setEditing(null);
    alert('Bookmark saved (demo mode - base44 API not configured)');
  };

  const handleDeleteBookmark = async (id) => {
    // await base44.entities.Bookmark.delete(id);
    // load();
    alert('Delete bookmark (demo mode - base44 API not configured)');
  };

  const handleAddCategory = async (cat) => {
    // await base44.entities.Category.create(cat);
    // load();
    alert('Add category (demo mode - base44 API not configured)');
  };

  const handleDeleteCategory = async (id) => {
    // await base44.entities.Category.delete(id);
    // if (activeCategory === id) setActiveCategory(null);
    // load();
    alert('Delete category (demo mode - base44 API not configured)');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-[rgba(167,139,250,0.3)] border-t-[#A78BFA] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] p-6">
      <div className="max-w-6xl mx-auto flex gap-6">
        <Sidebar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />

        <div className="flex-1 min-w-0">
          {/* Search & Add */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.25)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bookmarks..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder:text-[rgba(255,255,255,0.3)] outline-none"
              />
            </div>
            <button
              onClick={() => { setEditing(null); setModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgba(167,139,250,0.15)] text-[#A78BFA] text-sm font-medium border border-[rgba(167,139,250,0.2)] hover:bg-[rgba(167,139,250,0.25)] transition-all duration-200 shrink-0"
            >
              <Plus size={15} />
              Add Bookmark
            </button>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <BookmarkIcon size={32} className="text-[rgba(255,255,255,0.15)] mb-3" />
              <p className="text-sm text-[rgba(255,255,255,0.4)]">
                {search ? "No bookmarks match your search." : "No bookmarks yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((b) => (
                <BookmarkCard
                  key={b.id}
                  bookmark={b}
                  category={catMap[b.category_id]}
                  onEdit={(bk) => { setEditing(bk); setModalOpen(true); }}
                  onDelete={handleDeleteBookmark}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BookmarkModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSaveBookmark}
        categories={categories}
        editingBookmark={editing}
      />
    </div>
  );
}
