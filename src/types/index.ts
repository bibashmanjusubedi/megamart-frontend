// ==========================================
// 1. DATABASE ENTITY MODELS
// ==========================================

export interface Category{
    id: number;
    name: string;
}

export interface ProductImageItem{
    imageURL: string;
    imagePublicId:string;
}

export interface Product{
    id: number;
    categoryId: number;// FK -> Category.id
    name: string;
    price: number;
    stockQuantity: number;
    imageURL: string;
    imagePublicId?: string;
    secondaryImages?: ProductImageItem[];
}


export interface User{
    id: number;
    name: string; // Included for user personalization
    email: string;
    role: 'Admin' | 'Customer';
}

export interface Order{
    id: number;
    userId: number;
    totalAmount: number;
    status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
    createdAt?: string;
    orderItems?: OrderItem[]; // Optional property to hold related order items
}

export interface OrderItem{
    id: number;
    orderId: number; // FK -> Order.id
    productId: number; // FK -> Product.id
    quantity: number;
    unitPrice: number; // Price at the time of order
    product?: Product; // Optional property to hold related product details
}


// ==========================================
// 2. AUTHENTICATION & FORM DTOs
// ==========================================

export interface LoginCredentials{
    email: string;
    password: string;
}

// 1. Used by the API service / Redux async actions (Payload sent to server)
export interface RegisterCredentials{
    name:string;
    email:string;
    password:string;
}

// 2. Used locally in your React Register Form state (UI Validation)
export interface RegisterFormData extends RegisterCredentials{
    confirmPassword: string;// 👈 Extended for UI matching check
}


export interface AuthResponse{
    user: User;
    token: string;
}


// ==========================================
// 3. CART & UI HELPERS
// ==========================================

export interface CartItem{
    product: Product;
    quantity: number;
}