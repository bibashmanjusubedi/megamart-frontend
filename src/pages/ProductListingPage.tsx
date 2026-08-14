// ProductSearchAndCatalogListingPage
import React, { useState } from "react";
import { Header } from "../components/Header";
import { CategoryNav } from "../components/CategoryNav";
import { ProductCard } from "../components/ProductCard";
import { Footer } from "../components/Footer";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setSelectedCategory } from "../store/slices/productSlice";

export const ProductListingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, searchQuery, selectedCategoryId } = useAppSelector(
    (state) => state.products,
  );
  const { categories } = useAppSelector((state) => state.categories);

  // Local filter states
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("featured");

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
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0; // Default/Featured
  });

  return (
    <div>
      <Header />
      <CategoryNav />
      <main>
        <nav>
          <ol>
            <li>
              <a href="/">Home</a>
            </li>
            <li>Category</li>
            <li>
              {selectedCategoryId
                ? categories.find((c) => c.id === selectedCategoryId)?.name
                : "All Products"}
            </li>
          </ol>
        </nav>

        <div>
            {/* Sidebar Filters */}
            <aside>
                <div>
                    <h6>
                        Filters
                    </h6>

                    {/* Category Filter */}
                    <div>
                        <p>
                            Categories
                        </p>
                        <div>
                            <input
                                type="radio"
                                name="categorySelect"
                                id="cat-all"
                                checked={selectedCategoryId === null}
                                onChange={() => dispatch(setSelectedCategory(null))}
                            />
                            <label htmlFor="cat-all">
                                All Categories
                            </label> 
                            {categories.map((category) => (
                                <div key={category.id}>
                                    <input
                                        type="radio"
                                        name="categorySelect"
                                        id = {`cat-${category.id}`}
                                        checked = {selectedCategoryId === category.id}
                                        onChange = { () => dispatch(setSelectedCategory(category.id))}
                                    />
                                    <label
                                        htmlFor = {`cat-${category.id}`}           
                                    >
                                        {category.name}
                                    </label>
                                </div>    
                            ))}
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <p>
                                Price Range
                            </p>
                            <div>
                                <input
                                    type="number"
                                    placeholder = "Min"
                                    value={minPrice}
                                    onChange = {(e) => setMinPrice(e.target.value)}
                                />

                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Availability Filter */}
                        <div>
                          <p>
                            Availability
                          </p>

                          <div>
                            <input
                              type = "radio"
                              name = "stockFilter"
                              id = "inStock"
                              checked = {inStockOnly}
                              onChange = {() => setInStockOnly(true)}                            >
                            </input>

                            <label htmlFor="inStock">
                              In Stock Only
                            </label>
                          </div>

                          <div>
                            <input
                              type="radio"
                              name="stockFilter"
                              id="allStock"
                              checked={!inStockOnly}
                              onChange = {() => setInStockOnly(false)}
                            />

                            <label htmlFor="allStock">
                              Include out of stock
                            </label>
                          </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Catalog Listing Area */}
            <section>
              {/* Catalog Header & Sorting */}
              <div>
                <h6>
                  {selectedCategoryId
                  ? categories.find((c) => c.id === selectedCategoryId)?.name
                  : 'All Products'}{' '}
                  <span>
                    (Showing 1-{sortedProducts.length} of {sortedProducts.length} items)
                  </span>
                </h6>

                <div>
                  <label>
                    Sort By:
                  </label>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              {sortedProducts.length > 0 ? (
                <div>
                  {sortedProducts.map((product) => (
                    <div key={product.id}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p>
                    No products found matching your search or filters.
                  </p>
                </div>
              )}

              {/* Pagination Controls */}
              <nav>
                <ul>
                  <li>
                    <span>Previous</span>
                  </li>

                  <li>
                    <span>1</span>
                  </li>

                  <li>
                    <a href="#">
                      2
                    </a>
                  </li>

                  <li>
                    <a href="#">
                      3
                    </a>
                  </li>

                  <li>
                    <a href="#">
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
