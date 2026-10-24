import React from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setSelectedCategory } from "../store/slices/productSlice";
import { useNavigate, Link } from "react-router-dom"; // Import router navigation
import { useEffect } from "react";
import { fetchCategories } from "../store/slices/categorySlice";

export const CategoryNav: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const { categories } = useAppSelector((state) => state.categories);
  // const { selectedCategoryId } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const { selectedCategoryId } = useAppSelector((state) => state.products);

  // 1. Get the current logged-in user from Redux auth slice
  const { currentUser } = useAppSelector((state) => state.auth);

  // Check if user is logged in and is an admin
  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  // 3. Added useEffect to fetch categories automatically when this component mounts
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (categoryId: number | null) => {
    dispatch(setSelectedCategory(categoryId));

    if (categoryId == null) {
      navigate("/products");
    } else {
      navigate(`/products?category=${categoryId}`);
    }
    // navigate("/products");
  };

  return (
    <nav className="bg-light border-bottom py-2 mb-4">
      {/* Matching the exact container class and padding structure of the Header */}
      <div className="container d-flex align-items-center gap-2">
        {/* Inner scrollable container for categories, keeping your original gap-2 */}
        <div
          className="d-flex align-items-center gap-2 overflow-auto py-1 flex-grow-1"
          style={{ scrollbarWidth: "none" }}
        >
          <button
            className={`btn btn-sm rounded-pill fw-semibold text-nowrap ${
              selectedCategoryId === null
                ? "btn-primary text-white"
                : "btn-outline-secondary"
            }`}
            onClick={() => handleCategoryClick(null)}
          >
            All Categories
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              className={`btn btn-sm rounded-pill fw-semibold text-nowrap ${
                selectedCategoryId === category.id
                  ? "btn-primary text-white"
                  : "btn-outline-secondary"
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Right side: Conditionally show 'Back to Admin Page' button if user is an Admin */}
        {/* Bottom Row: Admin Button aligned flush to the right edge of Cart */}
        {/* Right side: 'Back to Admin Page' button aligned to the exact container margin as the Cart above */}
        {isAdmin && (
          <div className="flex-shrink-0">
            <Link
              to="/admin"
              className="btn btn-sm btn-dark fw-semibold d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            >
              <span>&larr; Back to Admin Page</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
