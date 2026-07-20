import React, { useState, useEffect } from "react";
import { Search, Plus, Bookmark as BookmarkIcon } from "lucide-react";
import { Sidebar, BookmarkCard, BookmarkModal } from "@/components/BookmarkUI";
import { storage } from '@/lib/storage';

const BOOKMARKS_KEY = 'bookmarks';
const CATEGORIES_KEY = 'categories';

export default function Home() {
  const [bookmarks, setBookmarks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [bookmarks, categories] = await Promise.all([
      storage.get(BOOKMARKS_KEY),
      storage.get(CATEGORIES_KEY),
    ]);
    setBookmarks(bookmarks || []);
    setCategories(categories || []);
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
    const bookmarks = await storage.get(BOOKMARKS_KEY) || [];
    if (data.id) {
      const idx = bookmarks.findIndex(b => b.id === data.id);
      if (idx >= 0) bookmarks[idx] = data;
    } else {
      bookmarks.unshift({ 
        ...data, 
        id: Date.now(), 
        created_date: new Date().toISOString() 
      });
    }
    await storage.set(BOOKMARKS_KEY, bookmarks);
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const handleDeleteBookmark = async (id) => {
    const bookmarks = (await storage.get(BOOKMARKS_KEY) || []).filter(b => b.id !== id);
    await storage.set(BOOKMARKS_KEY, bookmarks);
    load();
  };

  const handleAddCategory = async (cat) => {
    const categories = await storage.get(CATEGORIES_KEY) || [];
    categories.push({ ...cat, id: Date.now() });
    await storage.set(CATEGORIES_KEY, categories);
    load();
  };

  const handleDeleteCategory = async (id) => {
    const categories = (await storage.get(CATEGORIES_KEY) || []).filter(c => c.id !== id);
    await storage.set(CATEGORIES_KEY, categories);
    if (activeCategory === id) setActiveCategory(null);
    load();
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
