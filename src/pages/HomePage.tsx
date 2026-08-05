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
    <div>
      {/* 1. Header Navbar */}
      <Header />

      {/* 2. Key Category Navigation */}
      <CategoryNav />

      <main>
        {/* Section A: Smartphone Deals */}
        <section>
          <div>
            <h5>Grab the best deal on Smartphones</h5>
            <a href="products?category=1">View All</a>
          </div>

          <div>
            {products.slice(0, 4).map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* Section B: Shop From Top Categories */}
        <section>
          <div>
            <h5>Shop From Top Categories</h5>
            <a href="/products">View All</a>
          </div>

          <div>
            {categories.map((category) => (
              <div
                key={category.id}
              >
                <div
                >
                  <i></i>
                </div>
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section C: Daily Essentials */}
        <section>
          <div>
            <h5>Daily Essentials</h5>
            <a href="/products?category=groceries">
              View All <i></i>
            </a>
          </div>

          <div>
            {products.slice(0, 4).map((product) => (
              <div>
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
