import { useState, useMemo, FormEvent } from 'react';
import { X, Plus, Minus, Send } from 'lucide-react';
import { generateWhatsAppMessage } from '../utils/whatsapp';

interface CartItem {
  product: any;
  variant: any;
  quantity: number;
}

interface CartModalProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  updateQuantity: (item: CartItem, delta: number) => void;
  removeFromCart: (item: CartItem) => void;
}

export default function CartModal({ cart, isOpen, onClose, updateQuantity, removeFromCart }: CartModalProps) {
  const [userDetails, setUserDetails] = useState({ name: '', address: '', slot: 'Morning (8AM - 12PM)' });

  const finalTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.variant.price * item.quantity), 0);
  }, [cart]);

  const handleCheckout = (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty!");
    generateWhatsAppMessage(cart, userDetails);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        <div className="p-4 bg-brand-blue text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Smart Cart</h2>
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded cursor-pointer"><X size={24}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.variant.id}`} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{item.product.name}</h4>
                    <p className="text-xs text-gray-500">{item.variant.name} - Rs. {item.variant.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item, -1)} className="p-1 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"><Minus size={14}/></button>
                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item, 1)} className="p-1 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"><Plus size={14}/></button>
                    <button onClick={() => removeFromCart(item)} className="ml-2 text-red-500 p-1 cursor-pointer"><X size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between text-lg font-bold mb-4 text-brand-blue">
            <span>Final Total:</span>
            <span>Rs. {finalTotal}</span>
          </div>

          <form onSubmit={handleCheckout} className="space-y-3">
            <input 
              required type="text" placeholder="Full Name" 
              className="w-full p-2 border rounded focus:outline-none focus:border-brand-blue"
              value={userDetails.name} onChange={e => setUserDetails({...userDetails, name: e.target.value})}
            />
            <textarea 
              required placeholder="Delivery Address" rows={2}
              className="w-full p-2 border rounded focus:outline-none focus:border-brand-blue"
              value={userDetails.address} onChange={e => setUserDetails({...userDetails, address: e.target.value})}
            ></textarea>
            <select 
              className="w-full p-2 border rounded focus:outline-none focus:border-brand-blue"
              value={userDetails.slot} onChange={e => setUserDetails({...userDetails, slot: e.target.value})}
            >
              <option>Morning (8AM - 12PM)</option>
              <option>Evening (3PM - 7PM)</option>
            </select>
            <button 
              type="submit" 
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 rounded flex justify-center items-center gap-2 transition-colors cursor-pointer"
            >
              <Send size={20} /> Confirm via WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
