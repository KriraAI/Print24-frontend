import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  FileText, 
  Sticker, 
  Mail, 
  Image as ImageIcon, 
  Printer, 
  ArrowRight, 
  BadgeCheck,
  UserPlus,
  Compass
} from 'lucide-react';
import { ServiceItem } from '../types';

const services: ServiceItem[] = [
  { id: 'cards', title: 'Visiting Cards', description: 'Premium matte, gloss, and textured business cards.', icon: CreditCard },
  { id: 'flyers', title: 'Flyers & Brochures', description: 'High-quality marketing materials for your business.', icon: FileText },
  { id: 'idcards', title: 'ID Cards', description: 'Durable employee and student identification cards.', icon: BadgeCheck },
  { id: 'letterhead', title: 'Letterhead', description: 'Professional official stationary.', icon: FileText },
  { id: 'stickers', title: 'Stickers', description: 'Custom shapes and sizes for branding.', icon: Sticker },
  { id: 'invites', title: 'Invitations', description: 'Elegant cards for weddings and events.', icon: Mail },
  { id: 'banners', title: 'Flex & Banners', description: 'Large format printing for maximum visibility.', icon: ImageIcon },
  { id: 'more', title: 'Digital Printing', description: 'Custom solutions for all your printing needs.', icon: Printer },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

// Hero Slider Images
const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=1920&q=80",
    alt: "Professional Printing Press"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1920&q=80",
    alt: "Premium Business Cards"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1626785774573-4b7993143d2d?auto=format&fit=crop&w=1920&q=80",
    alt: "Creative Design Workspace"
  }
];

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      
      {/* Hero Section - Smaller Slider with Top Margin */}
      <section className="relative mt-8 h-[70vh] min-h-[500px] max-h-[600px] w-full overflow-hidden bg-cream-900 rounded-2xl mx-4">
        
        {/* Background Image Slider */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img 
              src={heroSlides[currentSlide].image} 
              alt={heroSlides[currentSlide].alt}
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
          </motion.div>
        </AnimatePresence>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl"
          >
            {/* Bigger Welcome Text with Logo */}
            <div className="inline-block py-3 px-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
                  Welcome to
                </span>
                <img 
                  src="../public/logo.svg" 
                  alt="Prints24 Logo"
                  className="h-8 md:h-16 w-auto" 
                />
              </div>
            </div>
            
            {/* Smaller Premium Printing Text */}
            <h1 className="font-serif text-2xl md:text-4xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Premium Printing <br/>
              <span className="text-cream-300 italic">Simplified</span>
            </h1>
            
            <p className="text-lg md:text-xl text-cream-100 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Join thousands of businesses and creators. Experience fast, creative, and high-quality digital printing solutions delivered to your doorstep.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link 
                to="/signup"
                className="bg-cream-50 text-cream-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 min-w-[200px]"
              >
                <UserPlus size={20} /> Sign Up Now
              </Link>
              <Link 
                to="/digital-print"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-cream-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 min-w-[200px]"
              >
                <Compass size={20} /> Explore Products
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125 w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-cream-900 mb-4">Our Services</h2>
            <p className="text-cream-600 max-w-xl mx-auto">Select from our wide range of premium printing categories crafted for professionals.</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {services.map((service) => (
              <motion.div key={service.id} variants={itemVariants}>
                <Link to={service.id === 'cards' ? '/digital-print/visiting-cards' : '/digital-print'}>
                  <div className="group h-full p-8 bg-cream-50 rounded-2xl hover:bg-cream-900 transition-all duration-300 cursor-pointer relative overflow-hidden border border-cream-100 hover:shadow-2xl">
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-cream-200 text-cream-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cream-800 group-hover:text-cream-50 transition-colors">
                        <service.icon size={28} />
                      </div>
                      <h3 className="font-serif text-xl font-semibold mb-3 text-cream-900 group-hover:text-cream-50 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-cream-600 text-sm group-hover:text-cream-200 transition-colors">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-cream-100 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white p-10 md:p-16 rounded-3xl shadow-xl"
            >
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl font-bold text-cream-900 mb-2">About Prints24</h2>
                <div className="w-24 h-1 bg-cream-400 mx-auto rounded-full"></div>
              </div>

              <div className="space-y-8 text-cream-800 leading-relaxed">
                <p className="text-lg">
                  Prints24 is a modern, fast-growing <span className="font-semibold">Digital & Offset Printing Company</span>, whose aim is to provide Fast, Creative, and High-Quality printing solutions to customers.
                </p>
                <p>
                  We started Prints24 with the idea that today's digital generation should get a platform where they can avail all types of printing services, from small quantities (Short Run) to Bulk Printing, in an easy, fast, and reliable manner.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  <div className="bg-cream-50 p-6 rounded-xl border border-cream-200">
                    <h3 className="font-serif text-xl font-bold text-cream-900 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 bg-cream-900 text-white rounded-full flex items-center justify-center text-sm">V</span> Vision
                    </h3>
                    <p className="text-sm">To make Affordable, Stylish, and Premium Quality Printing easily accessible to every individual and every business.</p>
                  </div>
                  <div className="bg-cream-50 p-6 rounded-xl border border-cream-200">
                    <h3 className="font-serif text-xl font-bold text-cream-900 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 bg-cream-900 text-white rounded-full flex items-center justify-center text-sm">M</span> Mission
                    </h3>
                    <ul className="text-sm space-y-2 list-disc list-inside">
                      <li>To make Modern Printing easy and accessible to everyone.</li>
                      <li>To provide smart solutions with Quick Delivery + High Quality.</li>
                      <li>To make better options available according to every budget.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upload Teaser Section */}
      <section className="py-24 bg-cream-900 text-cream-50 text-center">
        <div className="container mx-auto px-4">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.6 }}
             viewport={{ once: true }}
          >
            <div className="mb-8 inline-flex items-center justify-center w-16 h-16 bg-cream-800 rounded-full">
              <ArrowRight size={32} className="text-amber-300" />
            </div>
            <h2 className="font-serif text-4xl font-bold mb-6">Have a Design Ready?</h2>
            <p className="text-xl text-cream-200 max-w-2xl mx-auto mb-10">
              Skip the templates and upload your own artwork. Our automated system checks for errors instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-cream-300 mb-10">
               <span className="px-4 py-1 bg-cream-800 rounded-full border border-cream-700">PDF</span>
               <span className="px-4 py-1 bg-cream-800 rounded-full border border-cream-700">AI</span>
               <span className="px-4 py-1 bg-cream-800 rounded-full border border-cream-700">PSD</span>
               <span className="px-4 py-1 bg-cream-800 rounded-full border border-cream-700">JPG/PNG</span>
            </div>
            <Link 
              to="/upload"
              className="bg-cream-50 text-cream-900 px-10 py-4 rounded-full text-lg font-bold hover:bg-cream-200 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Upload Now
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;