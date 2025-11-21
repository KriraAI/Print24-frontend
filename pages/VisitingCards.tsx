import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Star, Sparkles } from 'lucide-react';

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
  options: {
    name: string;
    priceAdd: number;
    description: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const VisitingCards: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');

  // Fetch products based on category ID
  useEffect(() => {
  const fetchProducts = async () => {
    if (!categoryId) return;

    try {
      setLoading(true);

      const response = await fetch(
        `https://nonprohibitory-katheryn-unbewitched.ngrok-free.dev/api/products/category/${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);

      if (data.length > 0 && data[0].category) {
        setCategoryName(data[0].category.name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [categoryId]);


  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream-900 mb-4">
              Loading Products...
            </h1>
            <p className="text-cream-600">Please wait while we fetch the products.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream-900 mb-4">
              Error
            </h1>
            <p className="text-cream-600">{error}</p>
            <Link 
              to="/digital-print" 
              className="inline-block mt-4 bg-cream-900 text-white px-6 py-3 rounded-lg hover:bg-cream-800 transition-colors"
            >
              Back to Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      
      {/* Header with Breadcrumb feel */}
      <div className="bg-white border-b border-cream-200 pb-10 pt-8 mb-8 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium text-cream-500 uppercase tracking-widest">
              <Link to="/digital-print" className="hover:text-cream-900 transition-colors">Digital Print</Link>
              <ArrowRight size={14} />
              <span className="text-cream-900">{categoryName || 'Products'}</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream-900 mt-2">
              {categoryName || 'Select Product'}
            </h1>
            <p className="text-cream-600 mt-2 max-w-xl">
              Choose the perfect paper type and finish for your brand identity.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        
        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="font-serif text-2xl font-bold text-cream-900 mb-4">
              No Products Found
            </h2>
            <p className="text-cream-600 mb-6">There are no products available in this category yet.</p>
            <Link 
              to="/digital-print" 
              className="inline-block bg-cream-900 text-white px-6 py-3 rounded-lg hover:bg-cream-800 transition-colors"
            >
              Back to Categories
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, idx) => (
                <motion.div 
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link to={`/digital-print/${categoryId}/${product._id}`} className="group block h-full">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-cream-100 h-full flex flex-col hover:-translate-y-2">
                      
                      {/* Image Container */}
                      <div className="relative aspect-[1.6] overflow-hidden bg-cream-100">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Quick View Overlay */}
                        <div className="absolute inset-0 bg-cream-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                          <span className="bg-white text-cream-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                            Customize Now
                          </span>
                        </div>

                        {/* Badges */}
                        {product.basePrice <= 0.15 && (
                          <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Star size={12} fill="currentColor" /> Best Value
                          </div>
                        )}
                        {product.options && product.options.length > 2 && (
                          <div className="absolute top-4 left-4 bg-cream-900 text-cream-50 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Sparkles size={12} /> Premium Options
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="font-serif text-2xl font-bold text-cream-900 mb-2 group-hover:text-cream-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-cream-600 text-sm mb-6 flex-grow leading-relaxed">
                          {product.description}
                        </p>

                        {/* Options List */}
                        {product.options && product.options.length > 0 && (
                          <ul className="space-y-2 mb-6">
                            {product.options.slice(0, 3).map((option, i) => (
                              <li key={option._id} className="flex items-center text-xs text-cream-500 font-medium">
                                <div className="w-4 h-4 rounded-full bg-cream-100 flex items-center justify-center mr-2 shrink-0">
                                  <Check size={10} className="text-cream-900" />
                                </div>
                                {option.name} (+${option.priceAdd})
                              </li>
                            ))}
                            {product.options.length > 3 && (
                              <li className="text-xs text-cream-400 font-medium pl-6">
                                +{product.options.length - 3} more options
                              </li>
                            )}
                          </ul>
                        )}
                        
                        <div className="pt-4 border-t border-cream-100 flex justify-between items-center mt-auto">
                          <div className="text-xs text-cream-500">Starting from</div>
                          <div className="text-lg font-bold text-cream-900">
                            ${(product.basePrice * 100).toFixed(2)} 
                            <span className="text-xs font-normal text-cream-400">/ 100 qty</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Category Details Footer */}
            <div className="mt-20 bg-white p-10 rounded-3xl border border-cream-200 shadow-sm">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-bold text-cream-900 mb-4">
                    Why Choose Our {categoryName}?
                  </h3>
                  <p className="text-cream-700 leading-relaxed mb-6">
                    Your {categoryName?.toLowerCase()} are often the first interaction people have with your brand. 
                    We ensure that interaction counts. Using state-of-the-art digital printing technology, 
                    we deliver crisp text, vibrant colors, and premium finishes that leave a lasting impression.
                  </p>
                  <div className="flex gap-4">
                    <div className="text-center p-4 bg-cream-50 rounded-xl border border-cream-100">
                      <div className="font-bold text-2xl text-cream-900 mb-1">24h</div>
                      <div className="text-xs text-cream-500 uppercase tracking-wider">Production</div>
                    </div>
                    <div className="text-center p-4 bg-cream-50 rounded-xl border border-cream-100">
                      <div className="font-bold text-2xl text-cream-900 mb-1">300+</div>
                      <div className="text-xs text-cream-500 uppercase tracking-wider">GSM Paper</div>
                    </div>
                    <div className="text-center p-4 bg-cream-50 rounded-xl border border-cream-100">
                      <div className="font-bold text-2xl text-cream-900 mb-1">100%</div>
                      <div className="text-xs text-cream-500 uppercase tracking-wider">Satisfaction</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-cream-50 p-6 rounded-2xl border border-cream-100 w-full">
                  <h4 className="font-bold text-cream-900 mb-4">Available Upgrades</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Sparkles size={16} className="text-cream-600 mt-0.5" />
                      <span><strong>Spot UV:</strong> Glossy coating on specific areas.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles size={16} className="text-cream-600 mt-0.5" />
                      <span><strong>Gold Foil:</strong> Metallic finish for luxury.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles size={16} className="text-cream-600 mt-0.5" />
                      <span><strong>Round Corners:</strong> Soften the edges.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles size={16} className="text-cream-600 mt-0.5" />
                      <span><strong>Die Cut:</strong> Custom shapes for uniqueness.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VisitingCards;