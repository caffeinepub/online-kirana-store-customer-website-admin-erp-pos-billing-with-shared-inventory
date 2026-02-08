import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface Order {
    id: bigint;
    status: string;
    total: bigint;
    userId: Principal;
    timestamp: Time;
    items: Array<CartItem>;
}
export interface UserProfile {
    name: string;
    email: string;
    address: string;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: string;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAdminKey(publicKey: string): Promise<void>;
    addProduct(product: Product): Promise<void>;
    addToCart(productId: bigint, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    authenticateAdmin(providedPublicKey: string): Promise<boolean>;
    clearCart(): Promise<void>;
    deleteProduct(productId: bigint): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getBootstrapAdminEmail(): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getLowStockProducts(): Promise<Array<bigint>>;
    getMyOrders(): Promise<Array<Order>>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getProduct(productId: bigint): Promise<Product | null>;
    getProductStock(productId: bigint): Promise<bigint>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(total: bigint): Promise<bigint>;
    removeFromCart(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setProductStock(productId: bigint, stock: bigint): Promise<void>;
    setStockThreshold(productId: bigint, threshold: bigint): Promise<void>;
    updateBootstrapAdminEmail(newEmail: string): Promise<void>;
    updateOrderStatus(orderId: bigint, status: string): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
