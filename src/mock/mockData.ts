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
    secondaryImages: [
      {
        imageURL: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        imagePublicId: "sample1_sec1",
      },
      {
        imageURL: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
        imagePublicId: "sample1_sec2",
      },
      {
        imageURL: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=80",
        imagePublicId: "sample1_sec3",
      },
    ],
  },
  {
    id: 102,
    categoryId: 2,
    name: 'Wireless Noise Canceling Headphones',
    price: 14999,
    stockQuantity: 5,
    imageURL: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    imagePublicId: 'sample2',
    secondaryImages: [
      {
        imageURL: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
        imagePublicId: "sample2_sec1",
      },
      {
        imageURL: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80",
        imagePublicId: "sample2_sec2",
      },
      {
        imageURL: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80",
        imagePublicId: "sample2_sec3",
      },
    ],
  },
  {
    id: 103,
    categoryId: 3,
    name: 'Hydrating Face Serum',
    price: 1299,
    stockQuantity: 40,
    imageURL: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
    imagePublicId: 'sample3',
    secondaryImages: [
      {
        imageURL: "https://images.unsplash.com/photo-1608248597359-00109673898f?w=500&q=80",
        imagePublicId: "sample3_sec1",
      },
      {
        imageURL: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&q=80",
        imagePublicId: "sample3_sec2",
      },
      {
        imageURL: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80",
        imagePublicId: "sample3_sec3",
      },
    ],
  },

   {
    id: 104,
    categoryId: 1,
    name: 'iPhone',
    price: 100000,
    stockQuantity: 40,
    imageURL: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80',
    imagePublicId: 'sample3',
    secondaryImages: [
      {
        imageURL: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80",
        imagePublicId: "sample4_sec1",
      },
      {
        imageURL: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=500&q=80",
        imagePublicId: "sample4_sec2",
      },
      {
        imageURL: "https://images.unsplash.com/photo-1530319067432-f2a729c03db5?w=500&q=80",
        imagePublicId: "sample4_sec3",
      },
    ],
  },
];