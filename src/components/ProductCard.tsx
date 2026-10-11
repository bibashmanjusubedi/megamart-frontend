import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    // Calculate original price (assuming product.price is 80% of the original)
    const originalPrice = Math.round(product.price / 0.8);
    // Calculate exact savings amount
    const savings = originalPrice - product.price;
    return (
        <div className="card h-100 border rounded-3 shadow-sm position-relative overflow-hidden">
            {/* 56% OFF Badge */}
            <span className="badge bg-primary position-absolute top-0 start-0 m-2 px-2 py-1 rounded-pill">
                20% OFF
            </span>
            <img
                src={product.imageURL}
                alt={product.name}
                className="card-img-top p-3"
                style= {{height:'100px',objectFit:'contain'}}
            />
            
            <div className="card-body d-flex flex-column border-top bg-light">
                <h6 className="card-title text-truncate fw-bold mb-1 justify-content-center">{product.name}</h6>
                <div>
                    <span className="fw-bold fs-5 text-dark">₹{product.price.toLocaleString()}</span>
                </div>
                <small className="text-sucess fw-bold">Save ₹{savings.toLocaleString()}</small>
            </div>
        </div>
    );
};