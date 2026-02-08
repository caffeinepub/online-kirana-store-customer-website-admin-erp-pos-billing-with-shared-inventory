import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Set "mo:core/Set";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type ProductUnit = {
    id : Nat;
    productId : Nat;
    unitName : Text;
    price : Nat;
    costPrice : Nat;
    stockQty : Nat;
    minStock : Nat;
    expiryDate : ?Time.Time;
    createdAt : Time.Time;
  };

  module ProductUnit {
    public func compare(p1 : ProductUnit, p2 : ProductUnit) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  public type Supplier = {
    id : Nat;
    name : Text;
    contact : Text;
  };

  public type InventoryEntry = {
    unitId : Nat;
    qty : Nat;
    minStock : Nat;
    expiryDate : ?Time.Time;
    supplierId : Nat;
  };

  public type StaffRole = {
    #cashier;
    #deliveryBoy;
    #manager;
  };

  public type StaffAccount = {
    id : Nat;
    name : Text;
    role : StaffRole;
    contact : Text;
  };

  public type CustomerAccount = {
    id : Nat;
    name : Text;
    mobile : Text;
    email : ?Text;
  };

  public type UserProfile = {
    name : Text;
    userType : { #customer; #staff };
    accountId : ?Nat;
  };

  module CustomerAccount {
    public func compareByName(a1 : CustomerAccount, a2 : CustomerAccount) : Order.Order {
      Text.compare(a1.name, a2.name);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let productUnits = Map.empty<Nat, ProductUnit>();
  let suppliers = Map.empty<Nat, Supplier>();
  let inventory = Map.empty<Nat, InventoryEntry>();
  let staffAccounts = Map.empty<Nat, StaffAccount>();
  let customerAccounts = Map.empty<Nat, CustomerAccount>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let principalToCustomerId = Map.empty<Principal, Nat>();
  let principalToStaffId = Map.empty<Principal, Nat>();

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management - Admin only
  public shared ({ caller }) func addProductUnit(productUnit : ProductUnit) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    productUnits.add(productUnit.id, productUnit);
  };

  // Supplier Management - Admin only
  public shared ({ caller }) func addSupplier(supplier : Supplier) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add suppliers");
    };
    suppliers.add(supplier.id, supplier);
  };

  // Inventory Management - Admin only
  public shared ({ caller }) func addInventoryEntry(entry : InventoryEntry) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add inventory");
    };
    inventory.add(entry.unitId, entry);
  };

  // Customer Registration - Self-registration for authenticated users
  public shared ({ caller }) func registerCustomer(customer : CustomerAccount) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can register as customers");
    };
    
    // Prevent duplicate registration
    switch (principalToCustomerId.get(caller)) {
      case (?existingId) {
        Runtime.trap("Already registered as customer");
      };
      case null {
        customerAccounts.add(customer.id, customer);
        principalToCustomerId.add(caller, customer.id);
        
        // Update user profile
        let profile : UserProfile = {
          name = customer.name;
          userType = #customer;
          accountId = ?customer.id;
        };
        userProfiles.add(caller, profile);
      };
    };
  };

  // Staff Registration - Admin only
  public shared ({ caller }) func registerStaff(staff : StaffAccount, principal : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add staff");
    };
    
    staffAccounts.add(staff.id, staff);
    principalToStaffId.add(principal, staff.id);
    
    // Update user profile for staff
    let profile : UserProfile = {
      name = staff.name;
      userType = #staff;
      accountId = ?staff.id;
    };
    userProfiles.add(principal, profile);
  };

  // Query Functions with Authorization

  // Products - Admin and staff can view
  public query ({ caller }) func getProductUnits() : async [ProductUnit] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view products");
    };
    
    // Check if user is admin or staff
    let isStaff = switch (principalToStaffId.get(caller)) {
      case (?_) true;
      case null false;
    };
    
    if (not (AccessControl.isAdmin(accessControlState, caller) or isStaff)) {
      Runtime.trap("Unauthorized: Only admins and staff can view product details");
    };
    
    productUnits.values().toArray().sort();
  };

  // Suppliers - Admin only
  public query ({ caller }) func getSuppliers() : async [Supplier] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view suppliers");
    };
    suppliers.values().toArray();
  };

  // Inventory - Admin and staff can view
  public query ({ caller }) func getInventory() : async [InventoryEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view inventory");
    };
    
    // Check if user is admin or staff
    let isStaff = switch (principalToStaffId.get(caller)) {
      case (?_) true;
      case null false;
    };
    
    if (not (AccessControl.isAdmin(accessControlState, caller) or isStaff)) {
      Runtime.trap("Unauthorized: Only admins and staff can view inventory");
    };
    
    inventory.values().toArray();
  };

  // Staff Accounts - Admin only
  public query ({ caller }) func getStaffAccounts() : async [StaffAccount] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view staff accounts");
    };
    staffAccounts.values().toArray();
  };

  // Customer Accounts - Admin only (privacy protection)
  public query ({ caller }) func getCustomerAccounts() : async [CustomerAccount] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all customer accounts");
    };
    customerAccounts.values().toArray().sort(CustomerAccount.compareByName);
  };

  // Get own customer account
  public query ({ caller }) func getMyCustomerAccount() : async ?CustomerAccount {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view their account");
    };
    
    switch (principalToCustomerId.get(caller)) {
      case (?customerId) {
        customerAccounts.get(customerId);
      };
      case null null;
    };
  };

  // Helper function to check if caller is staff with specific role
  private func isStaffWithRole(caller : Principal, requiredRole : StaffRole) : Bool {
    switch (principalToStaffId.get(caller)) {
      case (?staffId) {
        switch (staffAccounts.get(staffId)) {
          case (?staff) {
            switch (staff.role, requiredRole) {
              case (#cashier, #cashier) true;
              case (#deliveryBoy, #deliveryBoy) true;
              case (#manager, #manager) true;
              case (#manager, _) true; // Managers have all staff permissions
              case _ false;
            };
          };
          case null false;
        };
      };
      case null false;
    };
  };

  // Helper function to check if caller is any staff member
  private func isStaff(caller : Principal) : Bool {
    switch (principalToStaffId.get(caller)) {
      case (?_) true;
      case null false;
    };
  };
};
