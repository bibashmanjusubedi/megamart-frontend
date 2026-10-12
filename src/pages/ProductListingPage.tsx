// ProductSearchAndCatalogListingPage
import React, { useState } from "react";
import { Header } from "../components/Header";
import { CategoryNav } from "../components/CategoryNav";
import { ProductCard } from "../components/ProductCard";
import { Footer } from "../components/Footer";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setSelectedCategory } from "../store/slices/productSlice";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom"
import { useEffect } from "react"; 
import { fetchProducts } from "../store/slices/productSlice";

export const ProductListingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, searchQuery, selectedCategoryId } = useAppSelector(
    (state) => state.products,
  );
  const { categories } = useAppSelector((state) => state.categories);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  // ADD IT HERE: This fetches your products from your .NET API when the page loads
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);


  // 4. Sync URL query parameter (?category=7) into Redux state on load or change
  useEffect(() => {
    if (categoryParam) {
      dispatch(setSelectedCategory(Number(categoryParam)));
    } else {
      dispatch(setSelectedCategory(null));
    }
  }, [categoryParam,dispatch])

  // Add pagination state near your other useState hooks
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerpage = 6; // Change this to how many products you want per page

  // Local filter states
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("featured");


  // Cleaned Filter logic with strict numeric conversions
  const minNum = minPrice.trim() !== ""? Number(minPrice) : null;
  const maxNum = maxPrice.trim() !== ""? Number(maxPrice) : null;
  const query = (searchQuery ||  "").trim().toLowerCase();


  // Filter logic
  const filteredProducts = products.filter((product) => {
    // Search Query
    // const matchesSearch = product.name
    //   .toLowerCase()
    //   .includes(searchQuery.toLowerCase());

    const productCategory = categories.find((c) => c.id === product.categoryId);
    const categoryName = productCategory ? productCategory.name.toLowerCase() : "";

    const matchesSearch = 
      query === ""
      ? true
      : product.name.toLowerCase().includes(query) || categoryName.includes(query);

    // Category Filter
    // const matchesCategory = selectedCategoryId
    //   ? product.categoryId === selectedCategoryId
    //   : true;
    const matchesCategory =
      selectedCategoryId !== null  && selectedCategoryId !==undefined
      ? Number(product.categoryId) === Number(selectedCategoryId)
      :true;

    // Price Filter
    const currentPrice = Number(product.price);
    const matchesMinPrice = minNum !== null ? currentPrice >= minNum: true;
    const matchesMaxPrice = maxNum !== null ? currentPrice <= maxNum: true;
    // const matchesMinPrice = minPrice ? product.price >= Number(minPrice) : true;
    // const matchesMaxPrice = maxPrice ? product.price >= Number(maxPrice) : true;

    // Stock Availability
    const matchesStock = inStockOnly ? Number(product.stockQuantity) > 0 : true;

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
    if (sortBy === "price-low") return Number(a.price) - Number(b.price);
    if (sortBy === "price-high") return Number(b.price) - Number(a.price);
    return 0; // Default/Featured
  });

  // Pagination math
  const indexOfLastItem = currentPage * itemsPerpage;
  const indexOfFirstItem = indexOfLastItem - itemsPerpage;
  const currentProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem); 
  const totalPages = Math.ceil(sortedProducts.length / itemsPerpage);

  // Calculate dynamic display range for current page
  const totalFilteredItems = sortedProducts.length;
  const startItemIndex = totalFilteredItems === 0 ? 0: (currentPage -1) * itemsPerpage + 1;
  const endItemIndex = Math.min(currentPage * itemsPerpage, totalFilteredItems);

  // Add them here right before your component returns its JSX
  console.log("All Products from Redux:", products);
  console.log("Selected Category ID from URL/Redux:", selectedCategoryId)

  return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      <Header />
      <CategoryNav />
      <main className="container flex-grow-1 py-3">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small text-muted">
            <li className="breadcrumb-item">
              <a href="/" className="text-decoration-none text-muted">Home</a>
            </li>
            <li className="breadcrumb-item">Category</li>
            <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
              {selectedCategoryId
                ? categories.find((c) => c.id === selectedCategoryId)?.name
                : "All Products"}
            </li>
          </ol>
        </nav>

        <div className="row g-4">
            {/* Sidebar Filters */}
            <aside className="col-12 col-md-3">
                <div className="border rounded p-3 bg-light">
                    <h6 className="fw-bold text-uppercase border-bottom pb-2 mb-3">
                        Filters
                    </h6>

                    {/* Category Filter */}
                    <div className="mb-4">
                        <p className="fw-semibold mb-2 small text-uppercase">
                            Categories
                        </p>
                        <div className="form-check mb-1">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="categorySelect"
                                id="cat-all"
                                checked={selectedCategoryId === null}
                                onChange={() => dispatch(setSelectedCategory(null))}
                            />
                            <label className="form-check-label small" htmlFor="cat-all">
                                All Categories
                            </label> 
                            {categories.map((category) => (
                                <div key={category.id}>
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="categorySelect"
                                        id = {`cat-${category.id}`}
                                        checked = {selectedCategoryId === category.id}
                                        onChange = { () => dispatch(setSelectedCategory(category.id))}
                                    />
                                    <label
                                      className="form-check-label small"
                                      htmlFor = {`cat-${category.id}`}           
                                    >
                                        {category.name}
                                    </label>
                                </div>    
                            ))}
                        </div>

                        {/* Price Range Filter */}
                        <div className="mb-4">
                            <p className="fw-semibold mb-2 small text-uppercase">
                                Price Range
                            </p>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <input
                                    className="form-control form-control-sm"
                                    type="number"
                                    placeholder = "Min"
                                    value={minPrice}
                                    onChange = {(e) => setMinPrice(e.target.value)}
                                />

                                <span>-</span>
                                <input
                                    className="form-control form-control-sm"
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Availability Filter */}
                        <div className="mb-2">
                          <p className="fw-semibold mb-2 small ">
                            Availability
                          </p>

                          <div className="form-check mb-1">
                            <input
                              className="form-check-input"
                              type = "radio"
                              name = "stockFilter"
                              id = "inStock"
                              checked = {inStockOnly}
                              onChange = {() => setInStockOnly(true)}
                            />                            
                            

                            <label  className="form-check-label" htmlFor="inStock">
                              In Stock Only
                            </label>
                          </div>

                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="stockFilter"
                              id="allStock"
                              checked={!inStockOnly}
                              onChange = {() => setInStockOnly(false)}
                            />

                            <label className="form-check-label" htmlFor="allStock">
                              Include out of stock
                            </label>
                          </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Catalog Listing Area */}
            <section className="col-12 col-md-9">
              {/* Catalog Header & Sorting */}
              <div className="d-flex flex-wrap align-items-center justify-content-between border-bottom pb-2 mb-3 gap-2">
                <h6 className="m-0 fw-bold">
                  {selectedCategoryId
                  ? categories.find((c) => c.id === selectedCategoryId)?.name
                  : 'All Products'}{' '}
                  <span className="text-muted fw-normal fs-7">
                    (Showing {startItemIndex}-{endItemIndex} of {totalFilteredItems} items)
                  </span>
                </h6>

                <div className="d-flex align-items-center gap-2">
                  <label className="small fw-semibold text-nowrap">
                    Sort By:
                  </label>

                  <select
                    className="form-select form-select-sm"
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
              {currentProducts.length > 0 ? (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 mb-4">
                  {currentProducts.map((product) => (
                    <div key={product.id} className="col" style = {{ cursor:"pointer"}} onClick={() => navigate(`/products/${product.id}`)}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 border rounded bg-light my-3">
                  <p className="text-muted mb-0">
                    No products found matching your search or filters.
                  </p>
                </div>
              )}

              {/* Pagination Controls */}
              <nav aria-label="Catalog Page Navigation" className="d-flex justify-content-center mt-4">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled": ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage((prev) => Math.max(prev-1,1))}>
                      Previous
                    </button>
                  </li>

                  {Array.from({length: totalPages},(_,index) =>(
                    <li key= {index + 1} className= {`page-item ${currentPage === index + 1 ? 'active': ""}`}>
                      <button className = "page-link"  onClick ={() => setCurrentPage(index + 1)}>
                        { index + 1}
                      </button>
                    </li>
                  ))}

                    <li className={`page-item ${currentPage === totalPages || totalPages  === 0 ? "disabled" : ""}`}>
                      <button className="page-link" onClick = {() => setCurrentPage((prev) => Math.min(prev+1, totalPages))}>
                        Next
                      </button>
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
