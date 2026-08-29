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
      <div className="min-vh-100 d-flex flex-column bg-white">
        <Header />
        <CategoryNav />
        <div className="container flex-grow-1 text-center py-5">
          <h3 className="fw-bold mb-3">Product Not Found</h3>
          <p className="text-muted mb-3">
            The item you are looking for does not exist or has been removed.
          </p>
          <Link to="/products" className="btn btn-primary">Back to Products</Link>
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
    <div className="min-vh-100 d-flex flex-column bg-white">
      <Header />
      <CategoryNav />

      <main className="container flex-grow-1 py-4">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/products?category=${category?.id}`}>
                Category: {category?.name || "Catalog"}
              </Link>
            </li>
            <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        {/* Product Visuals & Summary */}
        <div className="row g-4 mb-5">
          {/* Left Column: Interactive Image Gallery */}
          <div className="col-12 col-md-6">
            {/* Main Stage Image */}
            <div
              className="border rounded-3 p-3 bg-light text-center mb-3 d-flex align-items-center justify-content-center"
              style={{ minHeight:'380px',backgroundColor:'#fcfcfc'}}  
            >
              <img
                src={displayedMainImage}
                alt={product.name}
                className="img-fluid rounded"
                style={{ maxHeight:'340px',objectFit:'contain', transition:'all 0.2s ease-in-out' }}
              />
            </div>

            {/* Thumbnail Row with Hover Preview and Click-to-Replace */}
            <div
              className="d-flex gap-2 justify-content-center flex-wrap"
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
                    className={`btn p-1 border rounded-2 bg-white ${
                      isSelected
                      ? 'border-primary border-2 shadow-sm'
                      : isHovered
                      ? 'border-dark'
                      : 'border-secondary-subtle opacity-75'
                    }`}
                    style = {{
                      width:'74px',
                      height:'74px',
                      cursor:'pointer',
                      transform: isHovered ? 'scale(1.05)': 'scale(1)',
                      transition:'transform 0.15s ease, border-color 0.15s ease',
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Angle ${idx + 1}`}
                      className="w-100 h-100 rounded-1"
                      style={{ objectFit: "cover" }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Details and Checkout */}
          <div className="col-12 col-md-6 d-flex flex-column">
            <span className="badge bg-light text-secondary border align-self-start mb-2 px-2 py-1">
              Category: {category?.name || "General"}
            </span>

            <h2 className="fw-bold text-dark mb-3">{product.name}</h2>

            <div className="d-flex align-items-baseline gap-2 mb-1">
              <span className="fs-3 fw-bold text-dark">₹{product.price.toLocaleString()}</span>
              <span className="fs-6 text-muted text-decoration-line-through">₹{originalPrice.toLocaleString()}</span>
              <span className="badge bg-danger-subtle text-danger fw-bold fs-7">
                ({discountPercent}% OFF)
              </span>
            </div>
            <p className="text-muted small mb-3">Inclusive of all taxes</p>

            <div className="mb-3">
              <span className="fw-semibold small text-muted d-block mb-1">Availability:</span>
              {isOutOfStock ? (
                <span className="badge bg-secondary px-3 py-2">Out of Stock</span>
              ) : (
                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
                  <i className="bi bi-check-circle me-1"></i> In Stock ({product.stockQuantity} units remaining)
                </span>
              )}
            </div>

            {!isOutOfStock && (
              <div className="mb-4">
                <label className="fw-semibold small text-muted d-block mb-2">Quantity:</label>
                <div className="input-group" style={{ maxWidth: "140px" }}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    className="form-control text-center bg-white"
                    type="text"
                    value={quantity}
                    readOnly />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockQuantity}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="d-flex flex-wrap gap-3 mt-auto pt-3">
              <button
                className="btn btn-primary btn-lg flex-grow-1 fw-semibold d-flex align-items-center justify-content-center gap-2"
                onClick={handleAddToCart} disabled={isOutOfStock}>
                <i className="bi bi-cart-plus"></i> Add to Cart
              </button>
              <button
                className="btn btn-warning btn-lg flex-grow-1 fw-semibold d-flex align-items-center justify-content-center gap-2"
                onClick={handleBuyNow} disabled={isOutOfStock}>
                <i className="bi bi-lightning-fill"></i> Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Specifications & Description */}
        <div className="border rounded-3 p-4 bg-light">
          <h5 className="fw-bold border-bottom pb-2 mb-3">Product Description & Specifications</h5>
          <p className="text-secondary leading-relaxed mb-3">
           {product.description}
          </p>
          <ul className="list-unstyled text-muted small mb-0 d-flex flex-column gap-2">
            <li>
              <strong>Model:</strong> {product.specifications?.model || product.name}
            </li>
            <li>
              <strong>Category:</strong> {category?.name || "General"}
            </li>
            <li>
              <strong>Warranty:</strong> {product.specifications?.warranty} 
            </li>
            <li>
              <strong>Delivery:</strong> {product.specifications?.delivery}
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};
