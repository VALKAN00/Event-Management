import { useState, useEffect } from "react";
import CategoryCard from "../components/EventCategories/CategoryCard";
import CategoryModal from "../components/EventCategories/CategoryModal";
import CategoryFilters from "../components/EventCategories/CategoryFilters";
import CategoryTable from "../components/EventCategories/CategoryTable";
import DeleteConfirmModal from "../components/EventCategories/DeleteConfirmModal";

export default function EventCategories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
    sortBy: "name",
  });

  useEffect(() => {
    // Demo data for categories
    const demoCategories = [
      {
        id: 1,
        name: "Live Music",
        description:
          "Live concerts and musical performances featuring local and international artists.",
        eventCount: 15,
        totalBookings: 342,
        isActive: true,
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: 2,
        name: "EDM Music",
        description:
          "Electronic dance music events, DJ sets, and electronic music festivals.",
        eventCount: 12,
        totalBookings: 289,
        isActive: true,
        createdAt: "2024-01-20T14:15:00Z",
      },
      {
        id: 3,
        name: "Innovation",
        description:
          "Technology showcases, startup pitches, and innovation conferences.",
        eventCount: 8,
        totalBookings: 156,
        isActive: true,
        createdAt: "2024-02-01T09:00:00Z",
      },
      {
        id: 4,
        name: "Food Festivals",
        description:
          "Culinary events, food tastings, and cooking competitions.",
        eventCount: 6,
        totalBookings: 198,
        isActive: false,
        createdAt: "2024-02-10T16:45:00Z",
      },
      {
        id: 5,
        name: "Sports",
        description:
          "Athletic competitions, sports tournaments, and fitness events.",
        eventCount: 10,
        totalBookings: 275,
        isActive: true,
        createdAt: "2024-02-15T11:20:00Z",
      },
      {
        id: 6,
        name: "Art",
        description:
          "Art exhibitions, gallery openings, and creative workshops.",
        eventCount: 4,
        totalBookings: 89,
        isActive: true,
        createdAt: "2024-02-20T13:30:00Z",
      },
      {
        id: 7,
        name: "Technology",
        description:
          "Tech conferences, coding bootcamps, and digital innovation events.",
        eventCount: 9,
        totalBookings: 234,
        isActive: false,
        createdAt: "2024-02-25T15:10:00Z",
      },
    ];

    // Simulate API call
    const loadCategories = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        setCategories(demoCategories);
      } catch {
        console.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    let filtered = [...categories];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm) ||
          category.description.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (category) => category.name === filters.category
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((category) =>
        filters.status === "active" ? category.isActive : !category.isActive
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "events_desc":
          return b.eventCount - a.eventCount;
        case "events_asc":
          return a.eventCount - b.eventCount;
        case "created_desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "created_asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    setFilteredCategories(filtered);
  }, [categories, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      status: "all",
      sortBy: "name",
    });
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleSaveCategory = async (formData) => {
    try {
      if (selectedCategory) {
        // Update existing category
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === selectedCategory.id ? { ...cat, ...formData } : cat
          )
        );
      } else {
        // Add new category
        const newCategory = {
          id: Date.now(),
          ...formData,
          eventCount: 0,
          totalBookings: 0,
          createdAt: new Date().toISOString(),
        };
        setCategories((prev) => [...prev, newCategory]);
      }
    } catch {
      throw new Error("Failed to save category");
    }
  };

  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (categoryId) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleToggleStatus = (categoryId) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-[#111111] p-6 rounded-2xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 bg-[#1a1a1a]">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Event Categories
            </h1>
            <p className="text-gray-400">
              Manage and organize your event categories. Total:{" "}
              {categories.length} categories
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            {/* View Mode Toggle */}
            <div className="flex bg-[#1a1a1a] rounded-xl p-1 border border-gray-700">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "cards"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4 inline-block mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Cards
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "table"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4 inline-block mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                Table
              </button>
            </div>

            {/* Add Category Button */}
            <button
              onClick={handleAddCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Category
            </button>
          </div>
        </div>

        {/* Filters */}
        <CategoryFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Categories Display */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                onToggleStatus={handleToggleStatus}
              />
            ))}

            {filteredCategories.length === 0 && (
              <div className="col-span-full bg-[#1a1a1a] rounded-2xl p-12 border border-gray-700 text-center">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Categories Found
                </h3>
                <p className="text-gray-400 mb-6">
                  {filters.search ||
                  filters.category !== "all" ||
                  filters.status !== "all"
                    ? "No categories match your current filters."
                    : "Get started by creating your first event category."}
                </p>
                {!filters.search &&
                  filters.category === "all" &&
                  filters.status === "all" && (
                    <button
                      onClick={handleAddCategory}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      Create First Category
                    </button>
                  )}
              </div>
            )}
          </div>
        ) : (
          <CategoryTable
            categories={filteredCategories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {/* Modals */}
        <CategoryModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          category={selectedCategory}
          onSave={handleSaveCategory}
        />

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          category={categoryToDelete}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
}
