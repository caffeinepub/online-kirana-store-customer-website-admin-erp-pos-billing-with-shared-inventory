import Array "mo:core/Array";
import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Char "mo:core/Char";
import Principal "mo:core/Principal";

import MixinStorage "blob-storage/Mixin";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    price : Nat;
    stock : Nat;
    imageUrl : Text;
  };

  public type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  public type Order = {
    id : Nat;
    userId : Principal;
    items : [CartItem];
    total : Nat;
    status : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    address : Text;
  };

  let products = Map.empty<Nat, Product>();
  let productStocks = Map.empty<Nat, Nat>();
  let stockThresholds = Map.empty<Nat, Nat>();
  let userCarts = Map.empty<Principal, [CartItem]>();
  let orders = Map.empty<Nat, Order>();
  var nextOrderId : Nat = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();

  let adminPublicKeys = Set.empty<Text>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let defaultAdminKeys = [
    "a25536229ee0fe395b3ed77f72f1b279972d8b4787ceebfad977784b62bede6b",
    "b66571589ee0fe395b3ed77f72f1b279972d8b4787ceebfad977784b"
  ];
  for (key in defaultAdminKeys.vals()) {
    adminPublicKeys.add(key);
  };

  var bootstrapAdminEmail : Text = "jogoshree@gmail.com";

  func normalizeEmail(email : Text) : Text {
    let trimmed = email.trim(#char(' '));
    trimmed.map(func(c : Char) : Char {
      if (c >= 'A' and c <= 'Z') {
        Char.fromNat32(c.toNat32() + 32);
      } else {
        c;
      };
    });
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);

    let normalizedProfileEmail = normalizeEmail(profile.email);
    let normalizedBootstrapEmail = normalizeEmail(bootstrapAdminEmail);

    if (Text.equal(normalizedProfileEmail, normalizedBootstrapEmail) and not AccessControl.isAdmin(accessControlState, caller)) {
      AccessControl.assignRole(accessControlState, caller, caller, #admin);
    };
  };

  public shared ({ caller }) func authenticateAdmin(providedPublicKey : Text) : async Bool {
    // SECURITY FIX: Only existing admins can use public keys to grant admin privileges to others
    // This prevents unauthorized privilege escalation
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only existing admins can authenticate with public keys");
    };
    
    if (adminPublicKeys.contains(providedPublicKey)) {
      true;
    } else {
      false;
    };
  };

  public shared ({ caller }) func addAdminKey(publicKey : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can grant admin privileges");
    };
    adminPublicKeys.add(publicKey);
  };

  public shared ({ caller }) func updateBootstrapAdminEmail(newEmail : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update bootstrap admin email");
    };
    bootstrapAdminEmail := normalizeEmail(newEmail);
  };

  public query ({ caller }) func getBootstrapAdminEmail() : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view bootstrap admin email");
    };
    bootstrapAdminEmail;
  };

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(productId);
  };

  public shared ({ caller }) func setStockThreshold(productId : Nat, threshold : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set stock thresholds");
    };
    stockThresholds.add(productId, threshold);
  };

  public shared ({ caller }) func setProductStock(productId : Nat, stock : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set product stock");
    };
    productStocks.add(productId, stock);
  };

  public query ({ caller }) func getProductStock(productId : Nat) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view product stock");
    };
    switch (productStocks.get(productId)) {
      case (?stock) { stock };
      case (null) { 0 };
    };
  };

  public query ({ caller }) func getLowStockProducts() : async [Nat] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view low stock products");
    };

    let lowStockList = List.empty<Nat>();

    for ((productId, threshold) in stockThresholds.entries()) {
      let stock = switch (productStocks.get(productId)) {
        case (?qty) { qty };
        case (null) { 0 };
      };

      if (stock <= threshold) {
        lowStockList.add(productId);
      };
    };

    lowStockList.toArray();
  };

  public query func getAllProducts() : async [Product] {
    let productsIter = products.values();
    productsIter.toArray();
  };

  public query func getProduct(productId : Nat) : async ?Product {
    products.get(productId);
  };

  public query func getProductsByCategory(category : Text) : async [Product] {
    let productsIter = products.entries();
    let filteredProducts = productsIter.filter(
      func((_, p)) { p.category == category }
    );
    filteredProducts.toArray().map(func((_, p)) { p });
  };

  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };

    let currentCart = switch (userCarts.get(caller)) {
      case (?cart) { cart };
      case (null) { [] };
    };

    let newItem : CartItem = { productId; quantity };
    let updatedCart = currentCart.concat([newItem]);
    userCarts.add(caller, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };

    let currentCart = switch (userCarts.get(caller)) {
      case (?cart) { cart };
      case (null) { [] };
    };

    let updatedCart = currentCart.filter(func(item : CartItem) : Bool {
      item.productId != productId;
    });
    userCarts.add(caller, updatedCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };

    switch (userCarts.get(caller)) {
      case (?cart) { cart };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };
    userCarts.add(caller, []);
  };

  public shared ({ caller }) func placeOrder(total : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    let cart = switch (userCarts.get(caller)) {
      case (?c) { c };
      case (null) { Runtime.trap("Cart is empty") };
    };

    if (cart.size() == 0) {
      Runtime.trap("Cart is empty");
    };

    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : Order = {
      id = orderId;
      userId = caller;
      items = cart;
      total;
      status = "pending";
      timestamp = Time.now();
    };

    orders.add(orderId, order);
    userCarts.add(caller, []);

    orderId;
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    switch (orders.get(orderId)) {
      case (?order) {
        if (order.userId == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?order;
        } else {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    let ordersIter = orders.entries();
    let filtered = ordersIter.filter(
      func((_, o)) {
        o.userId == caller;
      }
    ).toArray();

    filtered.map(func((_, o)) { o });
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };

    let ordersIter = orders.entries();
    let entriesArray = ordersIter.toArray();
    entriesArray.map(func((_, o)) { o });
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (?order) {
        let updatedOrder : Order = {
          id = order.id;
          userId = order.userId;
          items = order.items;
          total = order.total;
          status;
          timestamp = order.timestamp;
        };
        orders.add(orderId, updatedOrder);
      };
      case (null) {
        Runtime.trap("Order not found");
      };
    };
  };
};
