// ProductSearchAndCatalogListingPage
import React,{ useState } from 'react';
import { Header } from '../components/Header';
import { CategoryNav } from '../components/CategoryNav';
import { ProductCard } from '../components/ProductCard';
import { Footer } from '../components/Footer';
import { useAppSelector,useAppDispatch } from '../store/hooks';
import { setSelectedCategory } from '../store/slices/productSlice';

export const ProductListingPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { products,searchQuery, selectedCategoryId } = useAppSelector(
        (state) => state.products
    );
    const { categories } = useAppSelector((state) => state.categories);

    // Local filter states
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice,setMaxPrice] = useState<string>('');
    const [inStockOnly, setInStockOnly] = useState<boolean>(true);
    const [sortBy,setSortBy] = useState<string>('featured');


    // Filter logic
    const filteredProducts = products.filter((product) => {
        // Search Query
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        // Category Filter
        const matchesCategory = selectedCategoryId
            ? product.categoryId === selectedCategoryId
            : true;  
            
        // Price Filter
        const matchesMinPrice = minPrice ? product.price >= Number(minPrice) : true;
        const matchesMaxPrice = maxPrice ? product.price >= Number(maxPrice) : true;

        // Stock Availability
        const matchesStock = inStockOnly ? product.stockQuantity > 0 : true;

        return ( 
            matchesSearch &&
            matchesCategory &&
            matchesMinPrice &&
            matchesMaxPrice &&
            matchesStock
        );
    });


    // Sorting Logic
    const sortedProducts = [...filteredProducts].sort((a,b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0; // Default/Featured
    });

    return (
        <div>
            <Header />
            <CategoryNav />
            <main>

            </main>
            <Footer />
        </div>
    );
};
