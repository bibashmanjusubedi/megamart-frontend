import React from "react";
import { Header } from "../components/Header";
import { CategoryNav } from "../components/CategoryNav";
import { ProductCard } from "../components/ProductCard";
import { Footer } from "../components/Footer";
import { useAppSelector } from "../store/hooks";

export const HomePage: React.FC = () => {
  const products = useAppSelector((state) => state.products.products);
  const categories = useAppSelector((state) => state.products.categories);

  return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      {/* 1. Header Navbar */}
      <Header />

      {/* 2. Key Category Navigation */}
      <CategoryNav />

      <main className="container flex-grow-1">
        {/* Section A: Smartphone Deals */}
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h5 className="fw-bold text-dark m-0">Grab the best deal on Smartphones</h5>
            <a href="products?category=1" className="text-primary text-decoration-none fw-semibold small">
              View All <i className="bi bi-chevron-right"></i>
            </a>
          </div>

          <div className="row row-cols-1  row-cols-sm-2 row-cols-md-4 g-3">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* Section B: Shop From Top Categories */}
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h5 className="fw-bold text-dark m-0">Shop From Top Categories</h5>
            <a href="/products" className="text-primary text-decoration-none fw-semibold small">
              View All <i className="bi bi-chevron-right"></i>
            </a>
          </div>

          <div className="d-flex align-items-center justify-content-between text-center overflow-auto py-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="d-flex flex-column align-items-center"
                style={{ minWidth:'90px'}}
              >
                <div
                  className="rounded-circle bg-light border d-flex align-items-center justify-content-center shadow-sm mb-2"
                  style={{ width: '70px', height:'70px'}}
                >
                  <i className="bi bi-shop fs-3 text-primary"></i>
                </div>
                <span className="small fw-semibold text-dark">{category.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section C: Daily Essentials */}
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h5 className="fw-bold text-dark m-0">Daily Essentials</h5>
            <a href="/products?category=groceries" className="text-primary text-decoration-none fw-semibold small">
              View All <i className="bi bi-chevron-right"></i>
            </a>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
            {products.slice(0, 4).map((product) => (
              <div key={`daily-${product.id}`} className="col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 3. Site Footer */}
      <Footer />
    </div>
  );
};
