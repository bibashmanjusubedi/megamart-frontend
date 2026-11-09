import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateOrderStatus } from "../store/slices/orderSlice";
import { deleteProduct } from "../store/slices/productSlice";
import { logout } from "../store/slices/authSlice";
import type { Order } from "../types";
import { useEffect } from "react";
import { fetchAllOrders } from "../store/slices/orderSlice";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../store/slices/categorySlice";
import { fetchProducts } from "../store/slices/productSlice";
import { fetchAllUsers } from "../store/slices/authSlice";

export const AdminDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const { orders } = useAppSelector((state) => state.orders);
  const { products } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const { currentUser } = useAppSelector((state) => state.auth);
  const { users } = useAppSelector((state) => state.auth);

  const [newCategoryName, setNewCategoryName] = useState<string>("");

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "categories" | "orders" | "users"
  >("overview");
  // Order search query
  const [orderSearch, setOrderSearch] = useState<string>("");

  // --- Modal Visibility States ---
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);

  // --- New State for Viewing Product Details ---
  const [selectedProductToView, setSelectedProductToView] = useState<
    number | null
  >(null);

  const [selectedProductToEdit, setSelectedProductToEdit] = useState<
    number | null
  >(null);

  const [selectedCategoryToEdit, setSelectedCategoryToEdit] = useState<
    number | null
  >(null);

  const [selectedUserToEdit, setSelectedUserToEdit] = useState<number | null>(
    null,
  );

  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState<
    number | string | null
  >(null);

  // 1. Add a state variable for tracking deletion errors in your component
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Create a ref for the input element
  const inputRef = useRef<HTMLInputElement>(null);

  // Route Guard: Redirect non-admins or guests away from the admin panel
  useEffect(() => {
    if (!currentUser || currentUser.role?.toLowerCase() != "admin") {
      navigate("/signin", { replace: true });
    }
  }, [currentUser, navigate]);

  // If user state is still resolving or unauthorized, render nothing or a blank screen briefly
  if (!currentUser || currentUser.role?.toLowerCase() !== "admin") {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Mock emails map for orders
  const customerEmails: Record<number, string> = {
    9823: "user1@domain.com",
    9824: "alex@domain.com",
    9825: "sarah@domain.com",
  };

  // Filtered orders based on Search input
  const filteredOrders = orders.filter((ord) => {
    const email =
      ord.email || customerEmails[ord.id] || `customer${ord.userId}@domain.com`;
    const term = orderSearch.toLowerCase().trim();

    if (!term) return true;

    const idStr = ord.id.toString();
    const ordPrefix = `ord-${ord.id}`.toLowerCase();
    const hashPrefix = `#ord-${ord.id}`.toLowerCase();

    return (
      idStr.includes(term) ||
      ordPrefix.includes(term) ||
      hashPrefix.includes(term) ||
      email.toLowerCase().includes(term)
    );

    // return ord.id.toString().includes(term) || email.toLowerCase().includes(term);
  });

  const renderStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1">
            <span
              className="rounded-circle bg-success"
              style={{ width: "6px", height: "6px" }}
            ></span>
            Delivered
          </span>
        );
      case "Processing":
        return (
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle d-inline-flex align-items-center gap-1">
            <span
              className="rounded-circle bg-primary"
              style={{ width: "6px", height: "6px" }}
            ></span>
            Shipped
          </span>
        );
      case "Pending":
        return (
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle d-inline-flex align-items-center gap-1">
            <span
              className="rounded-circle bg-warning"
              style={{ width: "6px", height: "6px" }}
            ></span>
            Pending
          </span>
        );
      case "Cancelled":
        return (
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle d-inline-flex align-items-center gap-1">
            <span
              className="rounded-circle bg-danger"
              style={{ width: "6px", height: "6px" }}
            ></span>
            Cancelled
          </span>
        );
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  // --- TAB CONTENT RENDER HELPERS ---
  {
    /* SECTION 1: Order Fulfillment Management */
  }
  const renderOrdersSection = () => (
    <section className="card border rounded-3 mb-4 shadow-sm bg-white">
      <div className="card-header bg-white border-bottom py-3">
        <h6 className="fw-bold mb-2 text-dark">Order Fulfillment Management</h6>
        <div
          className="row g-2 align-items-center"
          style={{ maxWidth: "600px" }}
        >
          <div className="col-auto small text-muted">
            Search Order ID or Customer Email:
          </div>
          <div className="col">
            <div className="input-group input-group-sm">
              <input
                type="text"
                className="form-control font-monospace"
                placeholder="e.g. 9823 or user@domain.com"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setOrderSearch("")}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body p-0 table-responsive">
        <table className="table table-hover table-striped align-middle mb-0 small">
          <thead className="table-light">
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">Customer Email</th>
              <th scope="col">Total</th>
              <th scope="col">Status</th>
              <th scope="col" className="text-end">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
                  No matching orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => {
                const email =
                  ord.email ||
                  customerEmails[ord.id] ||
                  `customer${ord.userId}@domain.com`;
                return (
                  <tr key={ord.id}>
                    <td className="fw-bold text-primary">#ORD-{ord.id}</td>
                    <td>{email}</td>
                    <td className="fw-semibold">
                      ₹
                      {ord.totalAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td>{renderStatusBadge(ord.status)}</td>
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-1">
                        <span className="text-muted small">Change:</span>
                        <select
                          className="form-select form-select-sm d-inline-block w-auto py-0 font-monospace"
                          value={ord.status}
                          onChange={(e) =>
                            dispatch(
                              updateOrderStatus({
                                orderId: ord.id,
                                status: e.target.value as Order["status"],
                              }),
                            )
                          }
                        >
                          <option value="Pending">[Pending]</option>
                          <option value="Processing">[Shipped]</option>
                          <option value="Completed">[Delivered]</option>
                          <option value="Cancelled">[Cancelled]</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  {
    /* SECTION 2: Product Inventory Quick-Edit */
  }
  const renderProductsSection = () => (
    <section className="card border rounded-3 mb-4 shadow-sm bg-white">
      <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h6 className="fw-bold mb-0 text-dark">Product Inventory Quick-Edit</h6>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            // onClick={() => alert('Open "Add New Product" Modal')}
            onClick={() => setShowProductModal(true)}
          >
            + Add New Product
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            // onClick={() => alert('Open "Add New Category" Modal')}
            onClick={() => setShowCategoryModal(true)}
          >
            + Add New Category
          </button>
        </div>
      </div>

      <div className="card-body p-0 table-responsive">
        <table className="table table-hover align-middle mb-0 small">
          <thead className="table-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Product Name</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">Stock</th>
              <th scope="col" className="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">
                  No products available in inventory.
                </td>
              </tr>
            ) : (
              products.map((prod) => {
                const catName =
                  categories.find((c) => c.id === prod.categoryId)?.name ||
                  "Accessories";
                const isLowStock = prod.stockQuantity <= 5;

                return (
                  <tr key={prod.id}>
                    <td>{prod.id}</td>
                    <td className="fw-semibold text-dark">{prod.name}</td>
                    <td>{catName}</td>
                    <td>₹{prod.price.toLocaleString("en-IN")}</td>
                    <td>
                      <div className="d-inline-flex gap-4">
                        <span
                          className={`badge ${
                            isLowStock
                              ? "bg-danger-subtle text-danger"
                              : "bg-light text-dark border"
                          }`}
                        >
                          {prod.stockQuantity}
                        </span>
                        {isLowStock && (
                          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle d-inline-flex align-items-center me-1">
                            <i className="bi bi-exclamation-triangle me-1"></i>{" "}
                            [Low Stock]
                          </span>
                        )}
                      </div>
                      {/* <span
                        className={`badge ${
                          isLowStock
                            ? "bg-danger-subtle text-danger"
                            : "bg-light text-dark border"
                        }`}
                      >
                        {prod.stockQuantity}
                      </span> */}
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-1">
                        {/* {isLowStock && (
                          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle d-inline-flex align-items-center me-1">
                            <i className="bi bi-exclamation-triangle me-1"></i>{" "}
                            [Low Stock]
                          </span>
                        )} */}
                        <button
                          type="button"
                          className="btn btn-outline-info btn-sm py-0 px-2 me-2"
                          // onClick={() => alert(`View Product: ${prod.name}`)}
                          onClick={() => setSelectedProductToView(prod.id)}
                        >
                          <i className="bi bi-eye me-1"></i>[View]
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm py-0 px-2"
                          // onClick={() => alert(`Edit Product: ${prod.name}`)}
                          onClick={() => setSelectedProductToEdit(prod.id)}
                        >
                          <i className="bi bi-pencil me-1"></i>[Edit]
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm py-0 px-2"
                          onClick={() => {
                            if (window.confirm(`Delete "${prod.name}"?`)) {
                              dispatch(deleteProduct(prod.id));
                            }
                          }}
                        >
                          <i className="bi bi-trash me-1"></i>[Delete]
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderCategorySection = () => (
    // <div className="card border rounded-3 p-4 bg-white shadow-sm">
    //   <h5 className="fw-bold mb-3">Category Management</h5>
    //   <p className="text-muted">Manage product categories and classifications here.</p>
    // </div>
    <section className="card border rounded-3 mb-4 shadow-sm bg-white">
      <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h6 className="fw-bold mb-0 text-dark">Category Management</h6>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            // onClick={() => alert('Open "Add New Category" Modal')}
            onClick={() => setShowCategoryModal(true)}
          >
            + Add New Category
          </button>
        </div>
      </div>

      <div className="card-body p-0 table-responsive">
        <table className="table table-hover align-middle mb-0 small">
          <thead className="table-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Category Name</th>
              <th scope="col" className="text-end">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-muted">
                  No categories available in database.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td className="fw-semibold text-dark">{cat.name}</td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-1">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm py-0 px-2"
                        // onClick={() => alert(`Edit Category: ${cat.name}`)}
                        onClick={() => setSelectedCategoryToEdit(cat.id)}
                      >
                        <i className="bi bi-pencil me-1"></i>[Edit]
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm py-0 px-2"
                        // onClick={() => {
                        //   if (
                        //     window.confirm(`Delete category "${cat.name}"?`)
                        //   ) {
                        //     // Dispatch your delete category action here if available
                        //     alert(`Delete action for category ID: ${cat.id}`);
                        //   }
                        // }}
                        onClick={() => setSelectedCategoryToDelete(cat.id)} // Triggers custom popup modal
                      >
                        <i className="bi bi-trash me-1"></i>[Delete]
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderUserSection = () => (
    // <div className="card border rounded-3 p-4 bg-white shadow-sm">
    //   <h5 className="fw-bold mb-3">User Management</h5>
    //   <p className="text-muted">Manage customer roles and account details here.</p>
    // </div>
    <section className="card border rounded-3 mb-4 shadow-sm bg-white">
      <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h6 className="fw-bold mb-0 text-dark">User Management</h6>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => alert('Open "Add New User"  Modal')}
          >
            + Add New User
          </button>
        </div>
      </div>

      <div className="card-body p-0 table-responsive">
        <table className="table table-hover align-middle mb-0 small">
          <thead className="table-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col" className="text-end">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Replace `users` with your actual users state array from Redux if available */}
            {!users || users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
                  No users available in database.
                </td>
              </tr>
            ) : (
              users.map((usr: any) => (
                <tr key={usr.id}>
                  <td>{usr.id}</td>
                  <td className="fw-semibold text-dark">{usr.name}</td>
                  <td>{usr.email}</td>
                  <td>
                    <span
                      className={`badge ${usr.role?.toLowerCase() === "admin" ? "bg-primary-subtle text-primary border border-primary-subtle" : "bg-light text-dark border"}`}
                    >
                      {usr.role || "Customer"}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-1">
                      <button
                        type="button"
                        className="btn btn-outline-info btn-sm py-0 px-2 me-2"
                        onClick={() => alert(`View User: ${usr.name}`)}
                      >
                        <i className="bi bi-eye me-1"></i>[View]
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm py-0 px-2"
                        // onClick={() => alert(`Edit User: ${usr.name}`)}
                        onClick={() => setSelectedUserToEdit(usr.id)}
                      >
                        <i className="bi bi-pencil me-1"></i>[Edit]
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm py-0 px-2"
                        onClick={() => {
                          if (window.confirm(`Delete user "${usr.name}"?`)) {
                            alert(`Delete action for user ID: ${usr.id}`);
                          }
                        }}
                      >
                        <i className="bi bi-trash me-1"></i>[Delete]
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="min-vh-100 bg-light d-flex flex-column font-monospace">
      {/* Top Console Bar */}
      <header className="bg-dark text-white border-bottom border-secondary py-2 px-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="fw-bold fs-6">MegaMart Admin Console</span>
          <div className="d-flex align-items-center gap-3 small">
            <span>
              <i className="bi bi-person-circle me-1"></i>[
              {currentUser?.name || "Admin User"}]
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-outline-light btn-sm font-monospace py-0 px-2"
            >
              [Logout]
            </button>
          </div>
        </div>
      </header>

      {/* Admin Module Navigation Tabs */}
      <nav className="bg-secondary bg-opacity-10 border-bottom px-3 py-2">
        <div className="container-fluid d-flex flex-wrap gap-2">
          {[
            { id: "overview", icon: "bi-speedometer2", label: "Overview" },
            { id: "products", icon: "bi-box-seam", label: "Products" },
            { id: "categories", icon: "bi-tag", label: "Categories" },
            { id: "orders", icon: "bi-cart-check", label: "Orders" },
            { id: "users", icon: "bi-people", label: "Users" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`btn btn-sm ${
                activeTab === tab.id
                  ? "btn-primary"
                  : "btn-outline-secondary bg-white"
              }`}
            >
              <i className={`bi ${tab.icon} me-1`}></i>[{tab.label}]
            </button>
          ))}
          <Link to="/" className="btn btn-sm btn-outline-dark ms-auto">
            &larr; Back to Storefront
          </Link>
        </div>
      </nav>

      <main className="container-fluid flex-grow-1 p-3 p-md-4">
        {activeTab === "overview" && (
          <>
            {renderOrdersSection()}
            {renderProductsSection()}
          </>
        )}

        {activeTab === "orders" && renderOrdersSection()}

        {activeTab === "products" && renderProductsSection()}

        {activeTab === "categories" && renderCategorySection()}

        {activeTab === "users" && renderUserSection()}
      </main>

      {/* 0. View Product Details Modal */}
      {selectedProductToView !== null &&
        (() => {
          const product = products.find((p) => p.id === selectedProductToView);
          if (!product) return null;

          return (
            <div
              className="modal show d-block"
              tabIndex={-1}
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">Product Details</h5>
                    <button
                      onClick={() => setSelectedProductToView(null)}
                      className="btn-close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-2 d-flex align-items-center gap-2">
                      <label className="fw-bold text-muted small mb-0">
                        Product ID:
                      </label>
                      <span className="text-dark">{product.id}</span>
                    </div>
                    <div className="mb-2 d-flex align-items-center gap-2">
                      <label className="fw-bold text-muted small">
                        Product Name
                      </label>
                      <span className="text-dark">{product.name}</span>
                    </div>

                    <div className="mb-2 d-flex align-items-center gap-2">
                      <label className="fw-bold text-muted small">
                        Category:{" "}
                      </label>
                      <span className="text-dark">
                        {categories.find((c) => c.id === product.categoryId)
                          ?.name || "Uncategorized"}
                      </span>
                    </div>

                    <div className="mb-2 d-flex align-items-center gap-2">
                      <label className="fw-bold text-muted small">Price:</label>
                      <span className="text-dark">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="mb-2 d-flex align-items-center gap-2">
                      <label className="fw-bold text-muted small">
                        Stock Quantity:
                      </label>
                      <span className="text-dark">{product.stockQuantity}</span>
                    </div>

                    <div className="mb-2 d-flex align-items-center gap-2">
                      <label className="fw-bold text-muted small">
                        Description:
                      </label>
                      <span className="text-dark">{product.description}</span>
                    </div>

                    <div className="mb-2">
                      <label className="fw-bold text-muted small d-block mb-1">
                        Specifications:
                      </label>
                      <ul className="text-dark list-unstyled ms-4 mb-0 d-flex flex-column gap-1">
                        <li>
                          <strong>Model:</strong>
                          {product.specifications?.model}
                        </li>
                        <li>
                          <strong>Delivery:</strong>
                          {product.specifications?.delivery}
                        </li>
                        <li>
                          <strong>Warranty:</strong>
                          {product.specifications?.warranty}
                        </li>
                      </ul>
                    </div>

                    <div className="mb-2">
                      <label className="fw-bold text-muted small">
                        Primary Image:
                      </label>
                      <div className="text-center">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                              maxHeight: "300px",
                              objectFit: "cover",
                              width: "100%",
                            }}
                          />
                        ) : (
                          <p>No image available</p>
                        )}
                      </div>

                      <div className="mb-2 mt-3">
                        <label className="fw-bold text-muted small">
                          Secondary Images:
                        </label>
                        <div>
                          {product.secondaryImages &&
                          product.secondaryImages.length > 0 ? (
                            <div className="d-flex flex-row flex-wrap gap-2">
                              {product.secondaryImages.map(
                                (secondaryImage, index) => (
                                  <img
                                    key={index}
                                    src={secondaryImage.imageUrl}
                                    alt={`${product.name} Secondary ${index + 1}`}
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      objectFit: "cover",
                                    }}
                                  />
                                ),
                              )}
                            </div>
                          ) : (
                            <p className="text-muted small">
                              No secondary images available
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {selectedProductToEdit !== null &&
        (() => {
          const product = products.find((p) => p.id === selectedProductToEdit);

          if (!product) return null;

          return (
            <div
              className="modal show d-block"
              tabIndex={-1}
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">Edit Product</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSelectedProductToEdit(null)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="col-form-label">Product Name</label>
                        <input
                          type="text"
                          className="form-control w-50"
                          defaultValue={product.name}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="col-form-label">Category</label>
                        <select
                          className="form-select w-50"
                          defaultValue={product.categoryId}
                        >
                          <option value="" disabled>
                            Select a Category
                          </option>
                          {categories &&
                            categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="col-form-label">Price</label>
                        <input
                          type="text"
                          className="form-control w-50"
                          defaultValue={product.price}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="col-form-label">Stock Quantity</label>
                        <input
                          type="text"
                          className="form-control w-50"
                          defaultValue={product.stockQuantity}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="col-form-label">Description</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={product.description}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="col-form-label">Specifications</label>
                        <div className="ps-3 d-flex flex-column gap-2">
                          <div className="mb-2 d-flex align-items-center gap-2">
                            <label
                              className="col-form-label small text-muted"
                              style={{ width: "80px", flexShrink: 0 }}
                            >
                              Model:
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={product.specifications.model}
                            />
                          </div>
                          <div className="mb-2 d-flex align-items-center gap-2">
                            <label
                              className="col-form-label small text-muted"
                              style={{ width: "80px", flexShrink: 0 }}
                            >
                              Warranty:
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={product.specifications.warranty}
                            />
                          </div>

                          <div className="mb-2 d-flex align-items-center gap-2">
                            <label
                              className="col-form-label small text-muted"
                              style={{ width: "80px", flexShrink: 0 }}
                            >
                              Delivery:
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={product.specifications.delivery}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Primary Image Section */}
                      <div className="mb-3">
                        <label className="col-form-label">Primary Image</label>

                        <div className="text-center">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              style={{
                                maxHeight: "300px",
                                objectFit: "cover",
                                width: "100%",
                              }}
                            />
                          ) : (
                            <p className="text-muted small">
                              No primary image available
                            </p>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <label
                            className="col-form-label small"
                            style={{ width: "160px", flexShrink: 0 }}
                          >
                            <strong>Primary Image URL:</strong>
                          </label>
                          <input
                            type="text"
                            className="form-control mt-2"
                            defaultValue={product.imageUrl}
                            placeholder="Update Primary Image URL"
                          />
                        </div>
                      </div>

                      {/* Secondary Images Section */}
                      <div className="mb-3">
                        <label className="col-form-label d-block mb-1">
                          Secondary Images
                        </label>
                        <div>
                          {product.secondaryImages &&
                          product.secondaryImages.length > 0 ? (
                            <div className="d-flex flex-column gap-3 mb-2">
                              {product.secondaryImages.map(
                                (secondaryImage: any, index: number) => {
                                  const imgUrl =
                                    typeof secondaryImage === "string"
                                      ? secondaryImage
                                      : secondaryImage?.imageUrl;

                                  return (
                                    <div
                                      key={index}
                                      className="d-flex align-items-center gap-3 p-2"
                                    >
                                      {/* Thumbnail Preview */}
                                      <img
                                        src={imgUrl}
                                        alt={`${product.name} Secondary ${index + 1}`}
                                        className="flex-shrink-0"
                                        style={{
                                          width: "100px",
                                          height: "100px",
                                          objectFit: "cover",
                                        }}
                                      />

                                      {/* Editable URL Input */}
                                      <div className="flex-grow-1">
                                        <label className="form-label small text-muted mb-1">
                                          Secondary Image #{index + 1} URL
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          defaultValue={imgUrl || ""}
                                          placeholder="Enter secondary image URL"
                                        />
                                      </div>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          ) : (
                            <p className="text-muted small">
                              No secondary images available
                            </p>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        alert(`Updated changes for: ${product.name}`);
                        setSelectedProductToEdit(null);
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setSelectedProductToEdit(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ===================== MODALS ===================== */}
      {/* 1. Add New Product Modal */}
      {showProductModal && (
        <div
          className="modal show d-block "
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add New Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowProductModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="col-form-label ">Product Name</label>
                    <input type="text" className="form-control w-50" />
                  </div>
                  <div className="mb-3">
                    <label className="col-form-label ">Category</label>
                    <select className="form-select w-50" defaultValue="">
                      <option value="" disabled>
                        Select a Category
                      </option>
                      {/* Dynamically render categories from Redux state */}
                      {categories &&
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      {/* <option value="1">Category One</option>
                      <option value="2">Category Two</option>
                      <option value="3">Category Three</option> */}
                    </select>
                    {/* <input type="text" className="form-control w-50"/> */}
                  </div>
                  <div className="mb-3">
                    <label className="col-form-label ">Price</label>
                    <input type="text" className="form-control w-50" />
                  </div>
                  <div className="mb-3">
                    <label className="col-form-label ">Stock Quantity</label>
                    <input type="text" className="form-control w-50" />
                  </div>

                  <div className="mb-3">
                    <label className="col-form-label ">Description</label>
                    <input type="text" className="form-control" />
                  </div>

                  {/* Specifications Section (Model, Warranty, Delivery) */}
                  <div className="mb-3">
                    <label className="col-form-label">Specifications</label>

                    <div className="ms-3">
                      {/* Model */}
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <label
                          className="col-form-label small text-muted"
                          style={{ width: "80px", flexShrink: 0 }}
                        >
                          Model:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter model"
                        />
                      </div>

                      {/* Warranty */}
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <label
                          className="col-form-label small text-muted"
                          style={{ width: "80px", flexShrink: 0 }}
                        >
                          Warranty:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter warranty details"
                        />
                      </div>

                      {/* Delivery */}
                      <div className="d-flex align-items-center gap-2">
                        <label
                          className="col-form-label small text-muted"
                          style={{ width: "80px", flexShrink: 0 }}
                        >
                          Delivery:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter delivery info"
                        />
                      </div>
                    </div>
                  </div>
                  {/* <div className="mb-3">
                    <label className="col-form-label ">Specifications</label>
                    <input type="text" className="form-control" />
                  </div> */}

                  {/* <div className="mb-3">
                    <label className="col-form-label ss">
                      Secondary Images
                    </label>
                    <textarea rows={3} className="form-control" />
                  </div> */}

                  <div className="mb-3">
                    <label className="col-form-label ">Primary Image URL</label>
                    <input type="text" className="form-control" />
                  </div>

                  {/* Secondary Images Section (#1, #2, #3) */}
                  <div className="mb-3">
                    <label className="col-form-label">Secondary Images</label>

                    <div className="ms-3">
                      {/* Secondary Image #1 */}
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <label
                          className="col-form-label small text-muted"
                          style={{ width: "160px", flexShrink: 0 }}
                        >
                          Secondary Image #1 URL:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter secondary image #1 URL"
                        />
                      </div>

                      {/* Secondary Image #2 */}
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <label
                          className="col-form-label small text-muted"
                          style={{ width: "160px", flexShrink: 0 }}
                        >
                          Secondary Image #2 URL:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter secondary image #2 URL"
                        />
                      </div>

                      {/* Secondary Image #3 */}
                      <div className="d-flex align-items-center gap-2">
                        <label
                          className="col-form-label small text-muted"
                          style={{ width: "160px", flexShrink: 0 }}
                        >
                          Secondary Image #3 URL:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter secondary image #3 URL"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-primary">
                  Save Product
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. Add New Product Modal */}
      {showCategoryModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add New Category</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNewCategoryName("");
                  }}
                ></button>
              </div>

              {/* Form wrapping the entire body and footer */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newCategoryName.trim()) return;

                  try {
                    await dispatch(
                      createCategory({ name: newCategoryName.trim() }),
                    ).unwrap();
                    setNewCategoryName("");
                    setShowCategoryModal(false);
                  } catch (error) {
                    console.error("Failed to create category:", error);
                  }
                }}
              >
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="col-form-label">Category Name</label>
                    <input
                      type="text"
                      className="form-control w-50"
                      placeholder="Enter category name"
                      value={newCategoryName || ""}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save Category
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setShowCategoryModal(false);
                      setNewCategoryName("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedCategoryToEdit !== null &&
        (() => {
          const category = categories.find(
            (c) => c.id === selectedCategoryToEdit,
          );
          if (!category) return null;

          return (
            <div
              className="modal show d-block"
              tabIndex={-1}
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">Edit Category</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSelectedCategoryToEdit(null)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    {/* 1. Put your submit logic right here in onSubmit */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault(); // Prevents page reload & handles HTML validation
                        const updatedName = inputRef.current?.value.trim();
                        if (updatedName) {
                          dispatch(
                            updateCategory({
                              id: category.id,
                              name: updatedName,
                            }),
                          );
                          setSelectedCategoryToEdit(null);
                        }
                      }}
                    >
                      <div className="mb-3">
                        <label className="col-form-label small text-muted fw-bold">
                          Category Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={category.name}
                          placeholder="Enter category name"
                          ref={inputRef}
                          required
                        />
                      </div>

                      <div className="modal-footer border-0 px-0 pb-0">
                        <button
                          type="submit" // 2. Triggers HTML5 validation & form onSubmit when clicked
                          className="btn btn-primary btn-sm"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedCategoryToEdit(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {selectedUserToEdit !== null &&
        (() => {
          const user = users.find((u) => u.id === selectedUserToEdit);

          if (!user) return null;

          return (
            <div
              className="modal show d-block"
              tabIndex={-1}
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">Edit User</h5>

                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSelectedUserToEdit(null)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="col-form-label small text-muted fw-bold">
                          Username
                        </label>

                        <input
                          type="text"
                          className="form-control bg-light"
                          value={user.name}
                          disabled
                        />
                      </div>

                      <div className="mb-3">
                        <label className="col-form-label small text-muted fw-bold">
                          Email
                        </label>

                        <input
                          type="email"
                          className="form-control bg-light"
                          value={user.email}
                          disabled
                        />
                      </div>

                      <div className="mb-3">
                        <label className="col-form-label small text-muted fw-bold">
                          Role
                        </label>

                        <select
                          className="form-select"
                          defaultValue={user.role}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Customer">Customer</option>
                        </select>
                      </div>
                    </form>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        alert(`Updated role for: ${user.name}`);
                        setSelectedUserToEdit(null);
                      }}
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedUserToEdit(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/*{selectedCategoryToDelete !== null &&
        (() => {
          const category = categories.find(
            (c) => c.id === selectedCategoryToDelete,
          );
          if (!category) return null;

          return (
            <div
              className="modal show d-block"
              tabIndex={-1}
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold text-danger">
                      Confirm Delete
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setSelectedCategoryToDelete(null);
                        setDeleteError(null); // Clear error on close
                      }}
                    ></button>
                  </div>

                  <div className="modal-body">
            
                    {deleteError && (
                      <div
                        className="alert alert-danger py-2 px-3 small mb-3"
                        role="alert"
                      >
                        {deleteError}
                      </div>
                    )}

                    <p className="small text-muted mb-0">
                      Are you sure you want to delete the category{" "}
                      <strong className="text-dark">{category.name}</strong>?
                      This action cannot be undone.
                    </p>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={async () => {
                        setDeleteError(null);

                          await dispatch(deleteCategory(category.id)).unwrap();

                          setSelectedCategoryToDelete(null);
                        } catch (errMessage: any) {
          
                          setDeleteError(
                            errMessage || "Failed to delete category",
                          );
                        }
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedCategoryToDelete(null);
                        setDeleteError(null); 
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()} */}

      {selectedCategoryToDelete !== null &&
        (() => {
          const category = categories.find(
            (c) => c.id === selectedCategoryToDelete,
          );
          if (!category) return null;

          return (
            <div
              className="modal show d-block"
              tabIndex={-1}
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5
                      className={`modal-title fw-bold ${deleteError ? "text-danger" : ""}`}
                    >
                      {deleteError
                        ? "Cannot Delete Category"
                        : "Confirm Delete"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setSelectedCategoryToDelete(null);
                        setDeleteError(null);
                      }}
                    ></button>
                  </div>

                  <div className="modal-body">
                    {/* Show error alert if an error occurred */}
                    {deleteError ? (
                      <div>
                        <div
                          className="alert alert-danger py-2 px-3 small mb-3"
                          role="alert"
                        >
                          {deleteError}
                        </div>
                        <p className="small text-muted mb-0">
                          To delete{" "}
                          <strong className="text-dark">{category.name}</strong>
                          , please first remove or reassign all products
                          associated with it.
                        </p>
                      </div>
                    ) : (
                      /* Standard confirmation text shown normally */
                      <p className="small text-muted mb-0">
                        Are you sure you want to delete the category{" "}
                        <strong className="text-dark">{category.name}</strong>?
                        This action cannot be undone.
                      </p>
                    )}
                  </div>

                  <div className="modal-footer">
                    {/* If there is an error, hide the Delete button completely and just show Close */}
                    {!deleteError ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={async () => {
                            setDeleteError(null);
                            try {
                              await dispatch(
                                deleteCategory(category.id),
                              ).unwrap();
                              setSelectedCategoryToDelete(null);
                            } catch (errMessage: any) {
                              setDeleteError(
                                errMessage || "Failed to delete category",
                              );
                            }
                          }}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedCategoryToDelete(null);
                            setDeleteError(null);
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedCategoryToDelete(null);
                          setDeleteError(null);
                        }}
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};
