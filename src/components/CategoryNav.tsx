import React from "react";
import { useAppSelector,useAppDispatch } from "../store/hooks";
import { setSelectedCategory } from "../store/slices/productSlice";
import { useNavigate } from "react-router-dom"; // Import router navigation

export const CategoryNav: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    // const { categories } = useAppSelector((state) => state.categories);
    // const { selectedCategoryId } = useAppSelector((state) => state.products);
    const { categories } = useAppSelector((state) => state.categories);
    const { selectedCategoryId } = useAppSelector((state) => state.products);

    const handleCategoryClick = (categoryId: number | null) => {
        dispatch(setSelectedCategory(categoryId));

        if (categoryId == null){
            navigate("/products");
        } else {
            navigate(`/products?category=${categoryId}`);
        }
        // navigate("/products");
    }

    return (
        <nav className="bg-light border-bottom py-2 mb-4">
            <div className="container d-flex align-items-center gap-2 overflow-auto">
                <button
                    className = {`btn btn-sm rounded-pill fw-semibold ${
                        selectedCategoryId === null ? 'btn-primary text-white': 'btn-outline-secondary'                        
                    }`}
                    onClick={() => handleCategoryClick(null)}
                >
                    All Categories
                </button>

                {categories.map((category) => (
                    <button
                        key={category.id}
                        className = {`btn btn-sm rounded-pill fw-semibold ${
                            selectedCategoryId === category.id ? 'btn-primary text-white':'btn-outline-secondary'
                        }`}
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </nav>
    );
};