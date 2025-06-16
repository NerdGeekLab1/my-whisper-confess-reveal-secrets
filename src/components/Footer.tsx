
import { Heart, Shield, Mail, Phone, MapPin, Twitter, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">TruthSpace</h3>
                <p className="text-sm text-slate-400">Anonymous confessions & support</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              A safe space for healing, truth, and community support. Your privacy and anonymity are our top priorities.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Facebook className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Support</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="tel:988" className="hover:text-white transition-colors">Crisis Helpline: 988</a></li>
              <li><a href="https://suicidepreventionlifeline.org/chat/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Anonymous Chat</a></li>
              <li><a href="https://www.psychologytoday.com/us/therapists" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Therapy Resources</a></li>
              <li><a href="https://www.nami.org/Support-Education/Support-Groups" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Support Groups</a></li>
              <li><a href="https://www.samhsa.gov/find-help/national-helpline" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Safety Planning</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Legal & Safety</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/guidelines" className="hover:text-white transition-colors">Community Guidelines</Link></li>
              <li><Link to="/report-abuse" className="hover:text-white transition-colors">Report Abuse</Link></li>
              <li><Link to="/data-protection" className="hover:text-white transition-colors">Data Protection</Link></li>
              <li><Link to="/technical" className="hover:text-white transition-colors">Technical Docs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-3 text-slate-400">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@truthspace.app" className="text-sm hover:text-white transition-colors">support@truthspace.app</a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <a href="tel:1-800-TRUTH-1" className="text-sm hover:text-white transition-colors">1-800-TRUTH-1</a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Anonymous by Design</span>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-white">100% Anonymous</span>
              </div>
              <p className="text-xs text-slate-400">
                No tracking, no data collection, no personal information stored.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm">
              © 2024 TruthSpace. All rights reserved. Made with ❤️ for healing and truth.
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <a href="tel:988" className="hover:text-white transition-colors">Emergency: 988</a>
              <span>•</span>
              <a href="tel:1-800-799-7233" className="hover:text-white transition-colors">Abuse Hotline: 1-800-799-7233</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
