// src/modules/store/services/cartService.js

const CART_KEY = "bellas_boutique_cart";

function getInitialCart() {
  return {
    userId: "guest", // aquí luego puedes poner el id real del usuario logueado
    createdAt: new Date().toISOString(),
    items: [],
  };
}

function loadCartRaw() {
  if (typeof window === "undefined") return getInitialCart();

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return getInitialCart();

    const parsed = JSON.parse(raw);
    // aseguramos que tenga estructura
    return {
      userId: parsed.userId || "guest",
      createdAt: parsed.createdAt || new Date().toISOString(),
      items: Array.isArray(parsed.items) ? parsed.items : [],
    };
  } catch (e) {
    console.error("Error leyendo carrito:", e);
    return getInitialCart();
  }
}

function saveCartRaw(cart) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Emit a global event so other parts of the app can react to cart changes
    try {
      const total = Array.isArray(cart.items)
        ? cart.items.reduce((s, it) => s + (it.quantity || 0), 0)
        : 0;
      window.dispatchEvent(
        new CustomEvent("cart:changed", { detail: { cart, total } })
      );
    } catch (_e) {
      // non-fatal
    }
  } catch (e) {
    console.error("Error guardando carrito:", e);
  }
}

function isSameItem(a, b) {
  return (
    a.id === b.id &&
    (a.color || null) === (b.color || null) &&
    (a.size || null) === (b.size || null)
  );
}

const cartService = {
  // 🔹 solo items (para Cart, Checkout, etc.)
  getCart() {
    const cart = loadCartRaw();
    return cart.items;
  },

  // 🔹 meta-datos de carrito (usuario + fecha de creación)
  getCartMeta() {
    const cart = loadCartRaw();
    return {
      userId: cart.userId,
      createdAt: cart.createdAt,
    };
  },

  // opcional: para cuando tengas login y quieras asociar el carrito a ese usuario
  setUser(userId) {
    const cart = loadCartRaw();
    cart.userId = userId || "guest";
    saveCartRaw(cart);
    return cart;
  },

  addItem(newItem) {
    const cart = loadCartRaw();
    const items = cart.items;
    const existingIndex = items.findIndex((it) => isSameItem(it, newItem));

    if (existingIndex >= 0) {
      items[existingIndex].quantity += newItem.quantity || 1;
    } else {
      items.push({
        ...newItem,
        quantity: newItem.quantity || 1,
      });
    }

    saveCartRaw({ ...cart, items });

    // Emit a product:added-to-cart event so UI can show a confirmation dialog
    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("product:added-to-cart", {
            detail: { product: newItem },
          })
        );
      }
    } catch (_e) {
      // non-fatal
    }

    return items;
  },

  updateQuantity(id, { color = null, size = null }, quantity) {
    const cart = loadCartRaw();
    const items = cart.items;

    const idx = items.findIndex(
      (it) =>
        it.id === id &&
        (it.color || null) === color &&
        (it.size || null) === size
    );

    if (idx >= 0) {
      items[idx].quantity = quantity;
      if (items[idx].quantity <= 0) {
        items.splice(idx, 1);
      }
    }

    saveCartRaw({ ...cart, items });
    return items;
  },

  removeItem(id, { color = null, size = null }) {
    const cart = loadCartRaw();
    let items = cart.items;

    items = items.filter(
      (it) =>
        !(
          it.id === id &&
          (it.color || null) === color &&
          (it.size || null) === size
        )
    );

    saveCartRaw({ ...cart, items });
    return items;
  },

  clearCart() {
    const fresh = getInitialCart();
    saveCartRaw(fresh);
    return fresh.items;
  },
};

export default cartService;
