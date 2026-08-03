import type { Category, Product } from "../types";

export const mockCategories: Category[] = [
    {id: 1, name: "Smartphones"},
    {id:2, name:"Electronics" },
    {id:3, name:"Cosmetics" },
];

export const mockProducts: Product[] = [
    {
    id: 101,
    categoryId: 1,
    name: 'Galaxy S22 Ultra 5G',
    price: 67999,
    stockQuantity: 18,
    imageURL: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80',
    imagePublicId: 'sample1',
  },
  {
    id: 102,
    categoryId: 2,
    name: 'Wireless Noise Canceling Headphones',
    price: 14999,
    stockQuantity: 5,
    imageURL: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    imagePublicId: 'sample2',
  },
  {
    id: 103,
    categoryId: 3,
    name: 'Hydrating Face Serum',
    price: 1299,
    stockQuantity: 40,
    imageURL: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
    imagePublicId: 'sample3',
  },
];