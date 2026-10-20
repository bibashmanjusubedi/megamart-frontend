import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { CategoryNav } from "../components/CategoryNav";
import { Footer } from "../components/Footer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  updateQuantity,
  removeFromCart,
  setPaymentMethod,
  setDeliveryAddress,
  clearCart,
  updateCartItemQuantity,
  removeCartItemFromApi,
  checkoutOrder
} from "../store/slices/cartSlice";

import { fetchCart } from "../store/slices/cartSlice";
import { fetchProducts } from "../store/slices/productSlice";


export const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, deliveryAddress, paymentMethod, loading } = useAppSelector(
    (state) => state.cart,
  );
  const { categories } = useAppSelector((state) => state.categories);

  const { products } = useAppSelector((state) => state.products);

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(deliveryAddress);

    useEffect(() => {
        // 👈 This actually dispatches the thunk and triggers GET /api/Carts
        dispatch(fetchCart());
        dispatch(fetchProducts());
    }, [dispatch]);

  // Calculations
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
//   const subtotal = items.reduce(
//     (acc, item) => acc + item.product.price * item.quantity,
//     0,
//   );
const subtotal = items.reduce((acc, item) => acc + (item.unitPrice || 0) * (item.quantity || 0), 0);
  const discount = subtotal > 0 ? 2000 : 0;
  const shipping = 0; // FREE
  const total = Math.max(0, subtotal - discount + shipping);

  const handleRemoveItem = (productId:number, cartItemId:number) => {
    // Instantly update local Redux state for zero-delay UI responsiveness
    dispatch(removeFromCart(productId));

    // Silentlty trigger the backend delete API
    dispatch(removeCartItemFromApi(cartItemId));
  }

  const handleQuantityDelta = (
    productId: number,
    cartItemId: number,
    currentQty: number,
    delta: number,
    maxStock: number,
  ) => {
    const next = currentQty + delta;
    if (next >= 1 && next <= maxStock) {
      // dispatch(updateQuantity({ productId, quantity: next }));
      // dispatch(updateCartItemQuantity({ cartItemId, quantity:next }))
      // 1. Instantly update local Redux state so the UI changes smoothly with zero delay
      dispatch(updateQuantity({ productId, quantity: next }));
      
      // 2. Silently update the database in the background
      dispatch(updateCartItemQuantity({ cartItemId, quantity: next }));
    }
  };

  const handleSaveAddress = () => {
    if (addressInput.trim()) {
      dispatch(setDeliveryAddress(addressInput));
      setIsEditingAddress(false);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;


    try{
      // 1. Dispatch the backend checkout thunk, passing the chosen address & payment method
      const resultAction = await dispatch(
        checkoutOrder({
          deliveryAddress,
          paymentMethod
        })
      );

      // 2. Check if the backend successfully processed the order
      if (checkoutOrder.fulfilled.match(resultAction)){
        alert(
          `Order placed successfully!\n\n` +
          `💰 Total Amount: ₹${total.toLocaleString()}\n` +
          `📦 Delivery Address: ${deliveryAddress || "N/A"}\n` +
          `💳 Payment Method: ${paymentMethod.toUpperCase()}`
        );
        navigate("/");
        
      } else {
        // 3. Handle backend errors (e.g., insufficient stock)
        alert(`Checkout failed: ${resultAction.payload}`);
      }

    } catch(err){
      console.error("Checkout error:", err);
      alert("An unexpected error occurred during checkout.");
    }


    // alert(
    //   `Order placed successfully!\nTotal Amount: ₹${total.toLocaleString()}\nPayment: ${paymentMethod.toUpperCase()}`,
    // );
    // dispatch(clearCart());
    // navigate("/");
  };



  if (loading) {
    return <div className="text-center py-5">Loading your cart...</div>;
  }

  return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      <Header />
      <CategoryNav />
      <main className="container flex-grow-1 py-4">
        {/* Title */}
        <h4 className="fw-bold mb-4">
          My Cart{" "}
          <span className="text-muted fs-6 fw-normal">
            ({totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"})
          </span>
        </h4>

        {items.length === 0 || products.length === 0  ? (
          <div className="text-center py-5 border rounded bg-light my-3">
            <i className="bi bi-cart-x fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-semibold">Your cart is empty</h5>
            <p className="text-muted small mb-4">
              Looks like you haven't added any items to your cart.
            </p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Left Column: Items & Delivery Address */}
            <div className="col-12 col-lg-8">
              {/* Item Details Container */}
              <div className="border rounded bg-light p-3 mb-4">
                <h6 className="fw-bold border-bottom bg-light pb-2 mb-3 text-uppercase small text-muted">
                  Item Details
                </h6>

                <div className="d-flex flex-column gap-3">
                  {items.map((item) => {
                    const matchedProduct = products.find((p) => p.id === item.productId);
                    // const stockQuantity = matchedProduct!.stockQuantity;
                    // 🛡️ Safe optional chaining prevents white-screen crashes on refresh
                    const stockQuantity = matchedProduct?.stockQuantity ?? item.quantity;
                    const category = categories.find(
                      (c) => c.id === item.productId,
                    );

                    return (
                      <div
                        key={item.productId}
                        className="d-flex gap-3 bg-white p-3 rounded border align-items-center"
                      >
                        {/* [Img] Thumbnail */}
                        <div
                          className="border rounded p-1 bg-light d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: "85px", height: "85px" }}
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="img-fluid rounded"
                            style={{ maxHeight: "100%", objectFit: "contain" }}
                          />
                        </div>

                        {/* Product Meta */}
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-1 text-dark">
                            {item.productName}
                          </h6>
                          <div className="small text-muted mb-1">
                            Category:{" "}
                            <span className="fw-medium text-dark">
                              {category?.name || "Accessories"}
                            </span>
                          </div>
                          <div className="fw-bold text-dark mb-2">
                            Price:₹{item.unitPrice.toLocaleString()}
                          </div>
                          {/* Quantity Selector & Remove Action */}
                          <div className="d-flex align-items-center justify-content-center flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-2">
                              <span className="small text-muted">Qty:</span>
                              <div
                                className="input-group input-group-sm"
                                style={{ width: "105px" }}
                              >
                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() =>
                                    handleQuantityDelta(
                                      item.productId,
                                      item.id, // 👈 Pass cartItemId (item.id) here
                                      item.quantity,
                                      -1,
                                      stockQuantity,
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </button>
                                <input
                                  className="form-control text-center bg-white"
                                  type="text"
                                  value={item.quantity}
                                  readOnly
                                />
                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() =>
                                    handleQuantityDelta(
                                      item.productId,
                                       item.id, // 👈 Pass cartItemId (item.id) here
                                      item.quantity,
                                      1,
                                      stockQuantity,
                                    )
                                  }
                                  disabled={item.quantity >= stockQuantity}
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="btn btn-sm text-danger text-decoration-none d-flex align-items-center gap-1"
                              // onClick={() =>
                              //   dispatch(removeFromCart(item.productId))
                              onClick = {() => handleRemoveItem(item.productId,item.id)}
                            >
                              <i className="bi bi-trash"></i> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Address Container */}
              <div className="border rounded bg-light p-3">
                <h6 className="fw-bold border-bottom pb-2 mb-3 text-uppercase small text-muted">
                  Delivery Address
                </h6>
                {isEditingAddress ? (
                  <div className="d-flex flex-column gap-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                    />
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={handleSaveAddress}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setIsEditingAddress(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2 text-dark small fw-medium">
                      <i className="bi bi-geo-alt-fill text-primary"></i>
                      <span>{deliveryAddress}</span>
                    </div>
                    <button
                      className="btn btn-sm btn-link text-decoration-none p-0 fw-semibold"
                      onClick={() => setIsEditingAddress(true)}
                    >
                      [ Change Address ]
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary & Express Payment */}
            <div className="col-12 col-lg-4">
              {/* Order Summary */}
              <div className="border rounded bg-light p-3 mb-4">
                <h6 className="fw-bold border-bottom pb-2 mb-3 text-uppercase small text-muted">
                  Order Summary
                </h6>

                <div className="d-flex justify-content-between small mb-2">
                  <span className="text-muted">Subtotal:</span>
                  <span className="text-success">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="d-flex justify-content-between small mb-3">
                  <span className="text-muted">Shipping:</span>
                  <span className="text-success fw-semibold">FREE</span>
                </div>

                <div className="d-flex justify-content-between small mb-3">
                  <span className="text-muted">Discount:</span>
                  <span className="text-danger fw-semibold">
                    -₹{discount.toLocaleString()}
                  </span>
                </div>

                <hr className="my-2" />

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold text-dark">Total:</span>
                  <span className="fs-5 fw-bold text-dark">
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                <button
                  className="btn btn-primary w-100 fw-bold py-2 text-uppercase d-flex align-items-center justify-content-center gap-2"
                  onClick={handleCheckout}
                >
                  [ Proceed to Checkout ]
                </button>
              </div>

              {/* Express Payment */}
              <div className="border rounded bg-light p-3">
                <h6 className="fw-bold border-bottom pb-2 mb-3 text-uppercase small text-muted">
                  Express Payment
                </h6>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentOptions"
                    id="payCart"
                    checked={paymentMethod === "card"}
                    onChange={() => dispatch(setPaymentMethod("card"))}
                  />
                  <label
                    className="form-check-label small fw-medium text-dark"
                    htmlFor="payCard"
                  >
                    Credit / Debit Card
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentOptions"
                    id="payUpi"
                    checked={paymentMethod === "upi"}
                    onChange={() => dispatch(setPaymentMethod("upi"))}
                  />
                  <label
                    className="form-check-label small fw-medium text-dark"
                    htmlFor="payUpi"
                  >
                    UPI / Net Banking
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
