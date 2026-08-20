import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { CategoryNav } from "../components/CategoryNav";
import { Footer } from "../components/Footer";
import { useAppSelector } from "../store/hooks";

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Redux store access
  const products = useAppSelector((state) => state.products.products);
  const { categories } = useAppSelector((state) => state.categories);

  // Find product and corresponding category
  const product = products.find((p) => String(p.id) === String(id));
  const category = categories.find((c) => c.id === product?.categoryId);

  // Gallery array: default main image + secondary angle images
  const galleryImages: string[] = product
    ? [
        product.imageURL,
        ...(product.secondaryImages || []).map((img) =>
          typeof img === "string" ? img : img.imageURL,
        ),
      ]
    : [];

  // Persistent clicked primary image (persists until page reload)
  const [activePrimaryImage, setActivePrimaryImage] = useState<string>("");

  // Temporary hover preview state
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const [quantity, setQuantity] = useState<number>(1);

  // Sync state when product loads or route param changes
  useEffect(() => {
    if (product) {
      setActivePrimaryImage(product.imageURL);
      setHoveredImage(null);
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div>
        <Header />
        <CategoryNav />
        <div>
          <h3>Product Not Found</h3>
          <p>
            The item you are looking for does not exist or has been removed.
          </p>
          <Link to="/products">Back to Products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const originalPrice = Math.round(product.price * 1.25);
  const discountPercent = Math.round(
    ((originalPrice - product.price) / originalPrice) * 100,
  );
  const isOutOfStock = product.stockQuantity <= 0;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > product.stockQuantity) return product.stockQuantity;
      return next;
    });
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity}x "${product.name}" to cart!`);
  };

  const handleBuyNow = () => {
    alert(`Proceeding to checkout with ${quantity}x "${product.name}"!`);
    navigate("/cart");
  };

  // Image currently displayed on the main display card
  const displayedMainImage =
    hoveredImage || activePrimaryImage || product.imageURL;

  return (
    <div>
      <Header />
      <CategoryNav />

      <main>
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to={`/products?category=${category?.id}`}>
                Category: {category?.name || "Catalog"}
              </Link>
            </li>
            <li aria-current="page">{product.name}</li>
          </ol>
        </nav>

        {/* Product Visuals & Summary */}
        <div>
          {/* Left Column: Interactive Image Gallery */}
          <div>
            {/* Main Stage Image */}
            <div>
              <img
                src={displayedMainImage}
                alt={product.name}
              />
            </div>

            {/* Thumbnail Row with Hover Preview and Click-to-Replace */}
            <div
              onMouseLeave={() => setHoveredImage(null)} // 👈 Reverts preview back to clicked main image
            >
              {galleryImages.map((imgUrl, idx) => {
                const isSelected = activePrimaryImage === imgUrl;
                const isHovered = hoveredImage === imgUrl;

                return (
                  <button
                    key={idx}
                    type="button"
                    onMouseEnter={() => setHoveredImage(imgUrl)} // 👈 Hover preview
                    onClick={() => setActivePrimaryImage(imgUrl)} // 👈 Click permanently sets face image
                   
                  >
                    <img
                      src={imgUrl}
                      alt={`Angle ${idx + 1}`}
                      style={{ objectFit: "cover" }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Details and Checkout */}
          <div>
            <span>Category: {category?.name || "General"}</span>

            <h2>{product.name}</h2>

            <div>
              <span>₹{product.price.toLocaleString()}</span>
              <span>₹{originalPrice.toLocaleString()}</span>
              <span>({discountPercent}% OFF)</span>
            </div>
            <p>Inclusive of all taxes</p>

            <div>
              <span>Availability:</span>
              {isOutOfStock ? (
                <span>Out of Stock</span>
              ) : (
                <span>
                  <i></i> In Stock ({product.stockQuantity} units remaining)
                </span>
              )}
            </div>

            {!isOutOfStock && (
              <div>
                <label>Quantity:</label>
                <div style={{ maxWidth: "140px" }}>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input type="text" value={quantity} readOnly />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockQuantity}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div>
              <button onClick={handleAddToCart} disabled={isOutOfStock}>
                <i></i> Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={isOutOfStock}>
                <i></i> Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Specifications & Description */}
        <div>
          <h5>Product Description & Specifications</h5>
          <p>
            High-performance flagship device engineered with premium build
            materials, pro-grade optics, and long battery endurance for
            demanding workloads.
          </p>
          <ul>
            <li>
              <strong>Model:</strong> {product.name}
            </li>
            <li>
              <strong>Category:</strong> {category?.name || "Smartphones"}
            </li>
            <li>
              <strong>Warranty:</strong> 1 Year Comprehensive Brand Warranty
            </li>
            <li>
              <strong>Delivery:</strong> Free Standard Shipping available
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};
