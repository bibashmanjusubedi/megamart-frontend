import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateOrderStatus } from '../store/slices/orderSlice';
import { deleteProduct } from '../store/slices/productSlice';
import { logout } from '../store/slices/authSlice';
import type { Order } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { orders } = useAppSelector((state) => state.orders);
  const { products } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const { currentUser } = useAppSelector((state) => state.auth);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'users'>('overview');
  // Order search query
  const [orderSearch, setOrderSearch] = useState<string>('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Mock emails map for orders
  const customerEmails: Record<number, string> = {
    9823: 'user1@domain.com',
    9824: 'alex@domain.com',
    9825: 'sarah@domain.com',
  };

  // Filtered orders based on Search input
  const filteredOrders = orders.filter((ord) => {
    const email = customerEmails[ord.id] || `customer${ord.userId}@domain.com`;
    const term = orderSearch.toLowerCase().trim();
    return ord.id.toString().includes(term) || email.toLowerCase().includes(term);
  });

  const renderStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1">
            <span className="rounded-circle bg-success" style={{ width: '6px', height: '6px' }}></span>
            Delivered
          </span>
        );
      case 'Processing':
        return (
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle d-inline-flex align-items-center gap-1">
            <span className="rounded-circle bg-primary" style={{ width: '6px', height: '6px' }}></span>
            Shipped
          </span>
        );
      case 'Pending':
        return (
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle d-inline-flex align-items-center gap-1">
            <span className="rounded-circle bg-warning" style={{ width: '6px', height: '6px' }}></span>
            Pending
          </span>
        );
      case 'Cancelled':
        return (
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle d-inline-flex align-items-center gap-1">
            <span className="rounded-circle bg-danger" style={{ width: '6px', height: '6px' }}></span>
            Cancelled
          </span>
        );
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column font-monospace">
      {/* Top Console Bar */}
      <header className="bg-dark text-white border-bottom border-secondary py-2 px-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="fw-bold fs-6">MegaMart Admin Console</span>
          <div className="d-flex align-items-center gap-3 small">
            <span>
              <i className="bi bi-person-circle me-1"></i>
              [{currentUser?.name || 'Admin User'}]
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
            { id: 'overview', icon: 'bi-speedometer2', label: 'Overview' },
            { id: 'products', icon: 'bi-box-seam', label: 'Products' },
            { id: 'categories', icon: 'bi-tag', label: 'Categories' },
            { id: 'orders', icon: 'bi-cart-check', label: 'Orders' },
            { id: 'users', icon: 'bi-people', label: 'Users' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`btn btn-sm ${
                activeTab === tab.id ? 'btn-primary' : 'btn-outline-secondary bg-white'
              }`}
            >
              <i className={`bi ${tab.icon} me-1`}></i>
              [{tab.label}]
            </button>
          ))}
          <Link to="/" className="btn btn-sm btn-outline-dark ms-auto">
            &larr; Back to Storefront
          </Link>
        </div>
      </nav>

      <main className="container-fluid flex-grow-1 p-3 p-md-4">
        {/* SECTION 1: Order Fulfillment Management */}
        <section className="card border rounded-3 mb-4 shadow-sm bg-white">
          <div className="card-header bg-white border-bottom py-3">
            <h6 className="fw-bold mb-2 text-dark">Order Fulfillment Management</h6>
            <div className="row g-2 align-items-center" style={{ maxWidth: '600px' }}>
              <div className="col-auto small text-muted">Search Order ID or Customer Email:</div>
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
                    onClick={() => setOrderSearch('')}
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
                  <th scope="col" className="text-end">Action</th>
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
                    const email = customerEmails[ord.id] || `customer${ord.userId}@domain.com`;
                    return (
                      <tr key={ord.id}>
                        <td className="fw-bold text-primary">#ORD-{ord.id}</td>
                        <td>{email}</td>
                        <td className="fw-semibold">
                          ₹{ord.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
                                    status: e.target.value as Order['status'],
                                  })
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

        {/* SECTION 2: Product Inventory Quick-Edit */}
        <section className="card border rounded-3 mb-4 shadow-sm bg-white">
          <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h6 className="fw-bold mb-0 text-dark">Product Inventory Quick-Edit</h6>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => alert('Open "Add New Product" Modal')}
              >
                + Add New Product
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => alert('Open "Add New Category" Modal')}
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
                  <th scope="col" className="text-end">Actions</th>
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
                      categories.find((c) => c.id === prod.categoryId)?.name || 'Accessories';
                    const isLowStock = prod.stockQuantity <= 5;

                    return (
                      <tr key={prod.id}>
                        <td>{prod.id}</td>
                        <td className="fw-semibold text-dark">{prod.name}</td>
                        <td>{catName}</td>
                        <td>₹{prod.price.toLocaleString('en-IN')}</td>
                        <td>
                          <span
                            className={`badge ${
                              isLowStock ? 'bg-danger-subtle text-danger' : 'bg-light text-dark border'
                            }`}
                          >
                            {prod.stockQuantity}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-inline-flex gap-1">
                            {isLowStock && (
                              <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle d-inline-flex align-items-center me-1">
                                <i className="bi bi-exclamation-triangle me-1"></i> [Low Stock]
                              </span>
                            )}
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm py-0 px-2"
                              onClick={() => alert(`Edit Product: ${prod.name}`)}
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
      </main>
    </div>
  );
};