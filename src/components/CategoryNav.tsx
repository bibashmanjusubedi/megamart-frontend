import React from "react";
import { useAppSelector,useAppDispatch } from "../store/hooks";
import { setSelectedCategory } from "../store/slices/productSlice";

export const CategoryNav: React.FC = () => {
    const dispatch = useAppDispatch();
    // const { categories } = useAppSelector((state) => state.categories);
    // const { selectedCategoryId } = useAppSelector((state) => state.products);
    const { categories,selectedCategoryId } = useAppSelector((state) => state.products);

    return (
        <nav>
            <div>
                <button
                    onClick={() => dispatch(setSelectedCategory(null))}
                >
                    All Categories
                </button>

                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => dispatch(setSelectedCategory(category.id))}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </nav>
    );
};