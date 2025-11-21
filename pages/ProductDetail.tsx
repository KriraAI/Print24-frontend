import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Truck, ShieldCheck, Star, Info, Plus, Minus } from 'lucide-react';
import { CardFinish, CardShape } from '../types';

const finishes: { id: CardFinish; label: string; priceMultiplier: number; color: string }[] = [
  { id: 'Glossy', label: 'Glossy', priceMultiplier: 1.0, color: 'bg-gradient-to-br from-white to-gray-100' },
  { id: 'Matte', label: 'Matte', priceMultiplier: 1.1, color: 'bg-gray-100' },
  { id: 'Velvet', label: 'Velvet', priceMultiplier: 1.3, color: 'bg-stone-800 text-white' },
  { id: 'Foil Gold', label: 'Foil Gold', priceMultiplier: 1.5, color: 'bg-yellow-200 border-yellow-400' },
  { id: 'Foil Silver', label: 'Foil Silver', priceMultiplier: 1.5, color: 'bg-gray-300 border-gray-400' },
  { id: 'Spot UV', label: 'Spot UV', priceMultiplier: 1.4, color: 'bg-gray-900 text-white' },
  { id: 'Plastic', label: 'Plastic', priceMultiplier: 2.0, color: 'bg-blue-50' },
  { id: 'Kraft', label: 'Kraft', priceMultiplier: 1.2, color: 'bg-amber-200' },
];

const shapes: { id: CardShape; label: string; priceMultiplier: number; class: string }[] = [
  { id: 'Standard', label: 'Standard (3.5" x 2")', priceMultiplier: 1.0, class: 'rounded-sm aspect-[1.75/1]' },
  { id: 'Square', label: 'Square (2.5" x 2.5")', priceMultiplier: 1.1, class: 'rounded-sm aspect-square max-w-[300px]' },
  { id: 'Round', label: 'Round', priceMultiplier: 1.2, class: 'rounded-full aspect-square max-w-[300px]' },
  { id: 'Custom', label: 'Custom Shape', priceMultiplier: 1.4, class: 'rounded-tl-3xl rounded-br-3xl aspect-[1.75/1]' },
];

const presetQuantities = [25, 50, 100, 250, 500, 1000, 2000, 5000];

interface ProductOption {
  name: string;
  priceAdd: number;
  description: string;
  _id: string;
}

interface Product {
  _id: string;
  category: {
    _id: string;
    name: string;
    description: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  name: string;
  description: string;
  image: string;
  basePrice: number;
  options: ProductOption[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ProductDetail: React.FC = () => {
  const { productId, categoryId } = useParams<{ productId: string; categoryId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFinish, setSelectedFinish] = useState<CardFinish>('Glossy');
  const [selectedShape, setSelectedShape] = useState<CardShape>('Standard');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(100);
  const [customQuantity, setCustomQuantity] = useState<string>('100');
  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [price, setPrice] = useState(0);

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        setProduct(data);
        
        // Initialize selected options with the first option if available
        if (data.options && data.options.length > 0) {
          setSelectedOptions([data.options[0]._id]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle quantity changes
  const handleQuantityChange = (value: string) => {
    setCustomQuantity(value);
    const numValue = parseInt(value) || 0;
    if (numValue >= 25) {
      setQuantity(numValue);
    }
  };

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setCustomQuantity(newQuantity.toString());
  };

  const decrementQuantity = () => {
    if (quantity > 25) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setCustomQuantity(newQuantity.toString());
    }
  };

  const handlePresetQuantity = (q: number) => {
    setQuantity(q);
    setCustomQuantity(q.toString());
  };

  // Calculate Price
  useEffect(() => {
    if (!product) return;

    const finishMult = finishes.find(f => f.id === selectedFinish)?.priceMultiplier || 1;
    const shapeMult = shapes.find(s => s.id === selectedShape)?.priceMultiplier || 1;
    
    // Calculate additional price from selected options
    let optionsPrice = 0;
    if (product.options && selectedOptions.length > 0) {
      selectedOptions.forEach(optionId => {
        const option = product.options.find(opt => opt._id === optionId);
        if (option) {
          optionsPrice += option.priceAdd;
        }
      });
    }

    // Simple quantity discount logic
    let quantityDiscount = 1;
    if (quantity >= 500) quantityDiscount = 0.9;
    if (quantity >= 1000) quantityDiscount = 0.8;
    if (quantity >= 5000) quantityDiscount = 0.7;

    const baseTotal = product.basePrice * quantity;
    const optionsTotal = optionsPrice * quantity;
    const total = (baseTotal + optionsTotal) * finishMult * shapeMult * quantityDiscount;
    
    setPrice(total);
  }, [product, selectedFinish, selectedShape, selectedOptions, quantity]);

  const handleCheckPincode = () => {
    if (pincode.length < 5) return;
    setIsCheckingPin(true);
    
    // Simulate API call
    setTimeout(() => {
      const date = new Date();
      date.setDate(date.getDate() + 4); // 4 days from now
      setDeliveryDate(date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
      setIsCheckingPin(false);
    }, 1000);
  };

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream-900 mb-4">
              Loading Product...
            </h1>
            <p className="text-cream-600">Please wait while we fetch the product details.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-cream-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream-900 mb-4">
              {error ? 'Error' : 'Product Not Found'}
            </h1>
            <p className="text-cream-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Link 
              to={`/digital-print/${categoryId}`} 
              className="inline-block mt-4 bg-cream-900 text-white px-6 py-3 rounded-lg hover:bg-cream-800 transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentShapeClass = shapes.find(s => s.id === selectedShape)?.class || '';

  return (
    <div className="min-h-screen bg-cream-50 py-8">
       <div className="container mx-auto px-4">
          
          {/* Back Link */}
          <Link to={`/digital-print/${categoryId}`} className="inline-flex items-center text-cream-600 hover:text-cream-900 mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Products
          </Link>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column: Visual Preview */}
            <div className="lg:w-1/2">
              <div className="sticky top-24">
                <motion.div 
                  layout
                  className="bg-white p-8 md:p-16 rounded-3xl shadow-sm border border-cream-100 flex items-center justify-center min-h-[400px] bg-cream-100/50"
                >
                   {/* Dynamic Shape Preview */}
                   <motion.div 
                     initial={false}
                     animate={{ 
                       borderRadius: selectedShape === 'Round' ? '50%' : selectedShape === 'Custom' ? '2rem 0 2rem 0' : selectedShape === 'Square' ? '0.5rem' : '0.25rem',
                       aspectRatio: selectedShape === 'Square' || selectedShape === 'Round' ? '1/1' : '1.75/1'
                     }}
                     transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                     className={`relative w-full max-w-md shadow-2xl overflow-hidden ${selectedShape === 'Square' || selectedShape === 'Round' ? 'max-w-xs' : ''}`}
                   >
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Finish Overlay Simulation */}
                      {selectedFinish === 'Glossy' && <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-60 pointer-events-none" />}
                      {selectedFinish === 'Matte' && <div className="absolute inset-0 bg-black/5 pointer-events-none" />}
                      {selectedFinish === 'Velvet' && <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay pointer-events-none" />}
                      {(selectedFinish === 'Foil Gold' || selectedFinish === 'Foil Silver') && (
                        <div className="absolute inset-0 border-4 border-white/50 flex items-center justify-center">
                           <span className={`text-4xl font-serif font-bold ${selectedFinish === 'Foil Gold' ? 'text-yellow-500' : 'text-gray-300'} opacity-80`}>
                             FOIL EFFECT
                           </span>
                        </div>
                      )}
                   </motion.div>
                </motion.div>

                <div className="mt-6 flex gap-4 justify-center overflow-x-auto py-2">
                  <img src={product.image} className="w-20 h-20 object-cover rounded-lg border-2 border-cream-900 cursor-pointer" />
                  <img src="https://picsum.photos/200/200?random=10" className="w-20 h-20 object-cover rounded-lg border border-cream-200 cursor-pointer hover:border-cream-400" />
                  <img src="https://picsum.photos/200/200?random=11" className="w-20 h-20 object-cover rounded-lg border border-cream-200 cursor-pointer hover:border-cream-400" />
                </div>
              </div>
            </div>

            {/* Right Column: Configuration */}
            <div className="lg:w-1/2">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-cream-100">
                <div className="mb-8 border-b border-cream-100 pb-6">
                   <div className="flex justify-between items-start">
                      <div>
                        <h1 className="font-serif text-3xl font-bold text-cream-900 mb-2">{product.name}</h1>
                        <p className="text-cream-600">{product.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-cream-500">Total Price</p>
                        <div className="text-3xl font-bold text-cream-900">${price.toFixed(2)}</div>
                      </div>
                   </div>
                </div>

                {/* 1. Options Selection (from API) */}
                {product.options && product.options.length > 0 && (
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-cream-900 mb-3 uppercase tracking-wider">1. Select Options</label>
                    <div className="space-y-3">
                      {product.options.map((option) => (
                        <button
                          key={option._id}
                          onClick={() => toggleOption(option._id)}
                          className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                            selectedOptions.includes(option._id)
                              ? 'border-cream-900 bg-cream-50 text-cream-900 ring-1 ring-cream-900'
                              : 'border-cream-200 text-cream-600 hover:border-cream-400 hover:bg-cream-50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-bold text-lg mb-1">{option.name}</div>
                              <div className="text-sm text-cream-500 mb-2">{option.description}</div>
                              <div className="text-sm font-semibold text-cream-700">
                                +${option.priceAdd} per 100 cards
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-4 ${
                              selectedOptions.includes(option._id)
                                ? 'bg-cream-900 border-cream-900'
                                : 'border-cream-300'
                            }`}>
                              {selectedOptions.includes(option._id) && (
                                <Check size={14} className="text-white" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Finish Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-cream-900 mb-3 uppercase tracking-wider">2. Select Finish</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {finishes.map((finish) => (
                      <button
                        key={finish.id}
                        onClick={() => setSelectedFinish(finish.id)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 flex flex-col items-center gap-2 ${
                          selectedFinish === finish.id
                            ? 'border-cream-900 bg-cream-50 text-cream-900 ring-1 ring-cream-900'
                            : 'border-cream-200 text-cream-600 hover:border-cream-400 hover:bg-cream-50'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full border border-black/10 shadow-sm ${finish.color}`}></span>
                        {finish.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Shape Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-cream-900 mb-3 uppercase tracking-wider">3. Select Shape</label>
                  <div className="grid grid-cols-2 gap-3">
                    {shapes.map((shape) => (
                      <button
                        key={shape.id}
                        onClick={() => setSelectedShape(shape.id)}
                        className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                          selectedShape === shape.id
                            ? 'border-cream-900 bg-cream-50 text-cream-900 ring-1 ring-cream-900'
                            : 'border-cream-200 text-cream-600 hover:border-cream-400'
                        }`}
                      >
                        <div className="font-bold">{shape.id}</div>
                        <div className="text-xs opacity-70">{shape.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Quantity Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-cream-900 mb-3 uppercase tracking-wider">4. Select Quantity</label>
                  
                  {/* Manual Quantity Input */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-cream-600">Enter custom quantity (min. 25)</span>
                      <span className="text-xs text-cream-500 bg-cream-100 px-2 py-1 rounded-full">
                        Current: {quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 25}
                        className="p-3 rounded-xl border border-cream-300 text-cream-700 hover:bg-cream-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      
                      <div className="flex-1 relative">
                        <input
                          type="number"
                          min="25"
                          value={customQuantity}
                          onChange={(e) => handleQuantityChange(e.target.value)}
                          onBlur={(e) => {
                            const value = parseInt(e.target.value) || 25;
                            if (value < 25) {
                              setQuantity(25);
                              setCustomQuantity('25');
                            }
                          }}
                          className="w-full p-3 rounded-xl border border-cream-300 text-center font-medium text-cream-900 focus:ring-2 focus:ring-cream-900 focus:border-transparent outline-none"
                        />
                        <div className="absolute inset-y-0 left-3 flex items-center text-cream-400">
                          <span className="text-sm">Qty</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={incrementQuantity}
                        className="p-3 rounded-xl border border-cream-300 text-cream-700 hover:bg-cream-50 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Preset Quantities */}
                  <div>
                    <div className="text-sm text-cream-600 mb-2">Or choose from popular quantities:</div>
                    <div className="flex flex-wrap gap-2">
                      {presetQuantities.map((q) => (
                        <button
                          key={q}
                          onClick={() => handlePresetQuantity(q)}
                          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                            quantity === q
                              ? 'bg-cream-900 text-cream-50 border-cream-900 shadow-sm'
                              : 'bg-white text-cream-700 border-cream-200 hover:border-cream-900 hover:bg-cream-50'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pincode & Delivery */}
                <div className="mb-8 bg-cream-50 p-6 rounded-xl border border-cream-200">
                   <h3 className="font-bold text-cream-900 mb-4 flex items-center gap-2">
                     <Truck size={18} /> Delivery Estimate
                   </h3>
                   <div className="flex gap-2 mb-4">
                     <input 
                        type="text" 
                        placeholder="Enter Pincode" 
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="flex-1 p-3 rounded-lg border border-cream-300 focus:ring-2 focus:ring-cream-900 focus:border-transparent outline-none text-sm"
                     />
                     <button 
                       onClick={handleCheckPincode}
                       disabled={pincode.length < 3}
                       className="bg-cream-900 text-cream-50 px-6 py-3 rounded-lg font-medium text-sm hover:bg-cream-800 disabled:opacity-50 transition-colors"
                     >
                       {isCheckingPin ? 'Checking...' : 'Check'}
                     </button>
                   </div>
                   
                   <AnimatePresence>
                     {deliveryDate && (
                       <motion.div 
                         initial={{ opacity: 0, height: 0 }} 
                         animate={{ opacity: 1, height: 'auto' }}
                         className="text-green-700 text-sm flex items-center gap-2 bg-green-50 p-3 rounded-lg border border-green-100"
                       >
                         <Check size={14} />
                         Estimated Delivery by <strong>{deliveryDate}</strong>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button className="flex-1 bg-cream-900 text-cream-50 py-4 rounded-xl font-bold text-lg hover:bg-cream-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                    Upload Design & Checkout
                  </button>
                  <button className="px-6 py-4 border border-cream-300 rounded-xl hover:bg-cream-50 transition-colors">
                     <Info size={24} className="text-cream-700" />
                  </button>
                </div>
                
                <div className="mt-4 text-center text-xs text-cream-500 flex items-center justify-center gap-2">
                  <ShieldCheck size={14} /> Secure Payment & Data Protection
                </div>

              </div>
            </div>
          </div>
       </div>
    </div>
  );
};

export default ProductDetail;