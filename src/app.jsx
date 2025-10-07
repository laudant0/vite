import React, { useState, useEffect } from "react";

// ORDER - Single-file React starter (App.jsx)
// - Tailwind CSS classes used for styling (requires Tailwind set up in the project)
// - Drop this file into a fresh Vite + React + Tailwind project as src/App.jsx
// - Default export is the main component

const sampleProducts = [
  {
    id: "p1",
    title: "CAMO Minimal Tee",
    price: 24.0,
    currency: "USD",
    img: "https://picsum.photos/seed/camo1/400/300",
    vendor: "CAMO",
  },
  {
    id: "p2",
    title: "Studio Kojo Kusi Bucket Hat",
    price: 18.5,
    currency: "USD",
    img: "https://picsum.photos/seed/hat2/400/300",
    vendor: "Studio Kojo Kusi",
  },
  {
    id: "p3",
    title: "Free The Youth Trainer",
    price: 79.99,
    currency: "USD",
    img: "https://picsum.photos/seed/shoe3/400/300",
    vendor: "Free The Youth",
  },
  {
    id: "p4",
    title: "African Pattern Scarf",
    price: 12.0,
    currency: "USD",
    img: "https://picsum.photos/seed/scarf4/400/300",
    vendor: "CAMO",
  },
];

function currencyFormat(n, cur = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(n);
}

export default function App() {
  const [products] = useState(sampleProducts);
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("order_cart_v1");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });
  const [isCartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("order_cart_v1", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product, qty = 1) {
    setCart(prev => {
      const copy = { ...prev };
      if (!copy[product.id]) copy[product.id] = { ...product, qty: 0 };
      copy[product.id].qty += qty;
      return copy;
    });
    setCartOpen(true);
  }

  function updateQty(productId, qty) {
    setCart(prev => {
      const copy = { ...prev };
      if (!copy[productId]) return prev;
      if (qty <= 0) delete copy[productId];
      else copy[productId].qty = qty;
      return copy;
    });
  }

  function clearCart() {
    setCart({});
  }

  const items = Object.values(cart);
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 8.5;
  const total = subtotal + shipping;

  const filtered = products.filter(p => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return p.title.toLowerCase().includes(q) || p.vendor.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-pink-500 rounded flex items-center justify-center text-white font-bold">O</div>
            <div>
              <div className="font-semibold">ORDER</div>
              <div className="text-xs text-slate-500">Local marketplace</div>
            </div>
          </div>

          <div className="flex-1 px-4">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products, brands..."
              className="w-full max-w-xl bg-slate-100 border border-transparent rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(v => !v)}
              className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
              </svg>
              <span className="font-medium">Cart</span>
              <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-sm bg-white text-indigo-600 rounded-full">{items.length}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-6">
          <h1 className="text-2xl font-bold">Featured Products</h1>
          <p className="text-sm text-slate-500">A simple starter for ORDER — local marketplace for African brands.</p>
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <article key={p.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img src={p.img} alt={p.title} className="w-full h-44 object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{p.title}</h3>
                    <div className="text-sm text-slate-500">{p.vendor}</div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-lg font-bold">{currencyFormat(p.price, p.currency)}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="px-3 py-1 rounded-md border border-slate-200 text-sm hover:bg-slate-50"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => addToCart(p, 3)}
                        title="Add 3"
                        className="px-2 py-1 rounded-md border border-slate-200 text-sm hover:bg-slate-50"
                      >
                        +3
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Cart drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 z-30 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => clearCart()} className="text-sm text-red-600">Clear</button>
            <button onClick={() => setCartOpen(false)} className="px-2 py-1 rounded bg-slate-100">Close</button>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-auto" style={{ maxHeight: "60vh" }}>
          {items.length === 0 ? (
            <div className="text-slate-500">Your cart is empty. Add something nice.</div>
          ) : (
            <div className="space-y-4">
              {items.map(it => (
                <div key={it.id} className="flex items-center gap-3">
                  <img src={it.img} alt={it.title} className="w-16 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-medium">{it.title}</div>
                    <div className="text-sm text-slate-500">{it.vendor}</div>
                    <div className="text-sm mt-1">{currencyFormat(it.price, it.currency)} x {it.qty}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(it.id, it.qty - 1)} className="px-2 py-1 rounded border">-</button>
                      <div className="px-3">{it.qty}</div>
                      <button onClick={() => updateQty(it.id, it.qty + 1)} className="px-2 py-1 rounded border">+</button>
                    </div>
                    <div className="text-sm font-semibold">{currencyFormat(it.price * it.qty, it.currency)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div>Subtotal</div>
            <div>{currencyFormat(subtotal, "USD")}</div>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600 mt-2">
            <div>Shipping</div>
            <div>{shipping === 0 ? "Free" : currencyFormat(shipping, "USD")}</div>
          </div>
          <div className="flex items-center justify-between font-bold text-lg mt-3">
            <div>Total</div>
            <div>{currencyFormat(total, "USD")}</div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                // Placeholder checkout flow
                if (items.length === 0) return alert("Cart is empty");
                alert("Checkout stub — implement payment gateway or order API.");
                clearCart();
                setCartOpen(false);
              }}
              className="col-span-2 px-4 py-3 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* small footer */}
      <footer className="mt-12 py-6 text-center text-sm text-slate-500">
        Built with ❤️ for African brands — ORDER starter
      </footer>
    </div>
  );
}
