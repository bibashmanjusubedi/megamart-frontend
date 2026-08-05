import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div>
            {/* 56% OFF Badge */}
            <span>
                56% OFF
            </span>
            <img
                src={product.imageURL}
                alt={product.name}
            />
            
            <div>
                <h6>{product.name}</h6>
                <div>
                    <span>₹{product.price.toLocaleString()}</span>
                </div>
                <small>Save ₹3,000</small>
            </div>
        </div>
    );
};