import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAppSelector } from '../store/hooks';
import type { Order } from '../types';

export const CustomerOrderHistoryPage: React.FC = () => {
  const { orders } = useAppSelector((state) => state.orders);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1">
            <span
              className="rounded-circle bg-success"
              style={{ width: '8px', height: '8px' }}
            ></span>
            Delivered
          </span>
        );
      case 'Processing':
        return (
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle d-inline-flex align-items-center gap-1">
            <span
              className="rounded-circle bg-primary"
              style={{ width: '8px', height: '8px' }}
            ></span>
            Processing
          </span>
        );
      case 'Pending':
        return (
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle d-inline-flex align-items-center gap-1">
            <span
              className="rounded-circle bg-warning"
              style={{ width: '8px', height: '8px' }}
            ></span>
            Pending
          </span>
        );
      case 'Cancelled':
        return (
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle d-inline-flex align-items-center gap-1">
            <span
              className="rounded-circle bg-danger"
              style={{ width: '8px', height: '8px' }}
            ></span>
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recent';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Header />

      <main className="container flex-grow-1 py-4" style={{ maxWidth: '900px' }}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small mb-1">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">
                My Account
              </Link>
            </li>
            <li className="breadcrumb-item active fw-semibold text-dark" aria-current="page">
              Order History
            </li>
          </ol>
        </nav>

        <h4 className="fw-bold text-dark mb-4">Order History</h4>

        {orders.length === 0 ? (
          <div className="card border-0 shadow-sm text-center py-5">
            <div className="card-body">
              <i className="bi bi-bag-x fs-1 text-muted mb-3 d-block"></i>
              <h5 className="fw-bold">No orders found</h5>
              <p className="text-muted small mb-4">
                You haven't placed any orders with MegaMart yet.
              </p>
              <Link to="/products" className="btn btn-primary btn-sm px-4">
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white"
              >
                {/* Order Top Bar */}
                <div className="card-header bg-white border-bottom p-3">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div>
                      <div className="fw-bold text-dark fs-6">
                        ORDER #ORD-{order.id}
                      </div>
                      <div className="small text-muted">
                        Placed: <span className="fw-medium text-dark">{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="mb-1">{getStatusBadge(order.status)}</div>
                      <div className="small text-muted">
                        Total: <span className="fw-bold text-dark">₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="card-body p-3">
                  <div className="d-flex flex-column gap-3">
                    {order.orderItems?.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex align-items-center gap-3 py-2 border-bottom"
                      >
                        {/* Thumbnail */}
                        <div
                          className="border rounded p-1 bg-light d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: '70px', height: '70px' }}
                        >
                          <img
                            src={item.product?.imageURL || 'https://via.placeholder.com/70'}
                            alt={item.product?.name || `Product ${item.productId}`}
                            className="img-fluid rounded"
                            style={{ maxHeight: '100%', objectFit: 'contain' }}
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-grow-1">
                          <div className="fw-semibold text-dark mb-1">
                            {item.product?.name || `Product #${item.productId}`}
                          </div>
                          <div className="small text-muted">
                            Qty: <span className="fw-medium text-dark">{item.quantity}</span>
                            <span className="mx-2 text-secondary">|</span>
                            UnitPrice: <span className="fw-medium text-dark">₹{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="card-footer bg-light border-0 px-3 py-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm fw-semibold"
                    onClick={() => alert(`Showing details for Order #ORD-${order.id}`)}
                  >
                    View Order Details
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => alert(`Downloading invoice for Order #ORD-${order.id}`)}
                  >
                    <i className="bi bi-file-earmark-arrow-down me-1"></i>
                    Download Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};