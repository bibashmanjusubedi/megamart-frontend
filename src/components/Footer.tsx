import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="fw-bold text-primary mb-3"> MegaMart Info</h5>
            <p className="text-secondary small">
              Your one-stop destination for groceries, tech essentials, and
              lifestyle products with lightning-fast delivery.
            </p>
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold mb-3">Most Popular Categories</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li>Smartphones and & Mobile</li>
              <li>Home & Kitchen Essentials</li>
              <li>Daily Groceries & Essentials</li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold mb-3">Customer Services</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
                <li>Track Order</li>
                <li>Return Policy</li>
                <li>Help & Support</li>
            </ul>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <p className="text-center text-secondary small m-0">© 2026 MegaMart. All Rights Reserved.</p>
      </div>
    </footer>
  );
};
