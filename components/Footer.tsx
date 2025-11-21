import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cream-900 text-cream-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-cream-50">Prints24</h3>
            <p className="text-cream-200 text-sm leading-relaxed">
              Modern, fast-growing digital & offset printing company providing creative and high-quality solutions.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-cream-50 mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/digital-print" className="hover:text-white transition-colors">Digital Print</Link></li>
              <li><Link to="/upload" className="hover:text-white transition-colors">Upload Files</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-cream-50 mb-6">Customer Service</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/policy" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-cream-50 mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0" />
                <span>123 Print Street, Creative District,<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} />
                <span>support@prints24.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream-800 mt-12 pt-8 text-center text-sm text-cream-400">
          <p>&copy; {new Date().getFullYear()} Prints24. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;