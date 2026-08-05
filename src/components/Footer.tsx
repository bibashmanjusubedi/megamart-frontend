import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer>
      <div>
        <div>
          <div>
            <h5> MegaMart Info</h5>
            <p>
              Your one-stop destination for groceries, tech essentials, and
              lifestyle products with lightning-fast delivery.
            </p>
          </div>
          <div>
            <h6>Most Popular Categories</h6>
            <ul>
              <li>Smartphones and & Mobile</li>
              <li>Home & Kitchen Essentials</li>
              <li>Daily Groceries & Essentials</li>
            </ul>
          </div>
          <div>
            <h6>Customer Services</h6>
            <ul>
                <li>Track Order</li>
                <li>Return Policy</li>
                <li>Help & Support</li>
            </ul>
          </div>
        </div>
        <hr />
        <p>© 2026 MegaMart. All Rights Reserved.</p>
      </div>
    </footer>
  );
};
