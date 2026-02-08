import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductUnit {
    id: bigint;
    stockQty: bigint;
    expiryDate?: Time;
    createdAt: Time;
    productId: bigint;
    minStock: bigint;
    price: bigint;
    costPrice: bigint;
    unitName: string;
}
export interface InventoryEntry {
    qty: bigint;
    expiryDate?: Time;
    unitId: bigint;
    minStock: bigint;
    supplierId: bigint;
}
export type Time = bigint;
export interface CustomerAccount {
    id: bigint;
    name: string;
    email?: string;
    mobile: string;
}
export interface Supplier {
    id: bigint;
    contact: string;
    name: string;
}
export interface StaffAccount {
    id: bigint;
    contact: string;
    name: string;
    role: StaffRole;
}
export interface UserProfile {
    userType: Variant_customer_staff;
    accountId?: bigint;
    name: string;
}
export enum StaffRole {
    manager = "manager",
    deliveryBoy = "deliveryBoy",
    cashier = "cashier"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_customer_staff {
    customer = "customer",
    staff = "staff"
}
export interface backendInterface {
    addInventoryEntry(entry: InventoryEntry): Promise<void>;
    addProductUnit(productUnit: ProductUnit): Promise<void>;
    addSupplier(supplier: Supplier): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomerAccounts(): Promise<Array<CustomerAccount>>;
    getInventory(): Promise<Array<InventoryEntry>>;
    getMyCustomerAccount(): Promise<CustomerAccount | null>;
    getProductUnits(): Promise<Array<ProductUnit>>;
    getStaffAccounts(): Promise<Array<StaffAccount>>;
    getSuppliers(): Promise<Array<Supplier>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerCustomer(customer: CustomerAccount): Promise<void>;
    registerStaff(staff: StaffAccount, principal: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
