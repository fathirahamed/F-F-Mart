/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, ShoppingBag, ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import { products } from './data/products';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fuzzy Search Implementation
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      (p.aiTag && p.aiTag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Cart Management Logic
  const addToCart = (product: any, variant: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.variant.id === variant.id);
      if (existing) {
        return prev.map(item => 
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
  };

  const updateQuantity = (cartItem: any, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === cartItem.product.id && item.variant.id === cartItem.variant.id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (cartItem: any) => {
    setCart(prev => prev.filter(item => !(item.product.id === cartItem.product.id && item.variant.id === cartItem.variant.id)));
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-brand-blue text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={28} className="text-brand-sky" />
            <h1 className="text-2xl font-bold tracking-tight">F&F Mart</h1>
          </div>
          
          <div className="relative w-full sm:w-96">
            <input 
              type="text" 
              placeholder="Search products, categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-full text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-sky"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-brand-sky text-brand-blue px-4 py-2 rounded-full font-semibold hover:bg-white transition-colors cursor-pointer"
          >
            <ShoppingCartIcon size={20} />
            <span>Cart ({totalCartItems})</span>
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {searchQuery ? `Search Results (${filteredProducts.length})` : 'Fresh Produce & Groceries'}
          </h2>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No products found matching "{searchQuery}"</p>
          </div>
        )}
      </main>

      {/* Mobile Sticky View Cart Button */}
      {totalCartItems > 0 && (
        <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-brand-blue text-white shadow-xl py-3 rounded-full font-bold flex justify-center items-center gap-2 active:scale-95 transition-transform cursor-pointer"
          >
            <ShoppingCartIcon size={20} /> View Cart ({totalCartItems})
          </button>
        </div>
      )}

      {/* Cart Modal */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />
    </div>
  );
}

