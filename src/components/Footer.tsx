
import { Heart, Shield, FileText, Users, HelpCircle, Lock } from "lucide-react";

interface FooterProps {
  setCurrentPage?: (page: string) => void;
}

const Footer = ({ setCurrentPage }: FooterProps = {}) => {
  const handleInternalNavigation = (page: string) => {
    if (setCurrentPage) {
      setCurrentPage(page);
    } else {
      // Fallback for when used outside of main app context
      window.location.href = `/${page}`;
    }
  };

  const handleExternalNavigation = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div 
              className="flex items-center space-x-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleInternalNavigation("confessions")}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">TruthSpace</h3>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              A safe, anonymous platform for sharing experiences, seeking support, and building a community of healing and truth.
            </p>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-400">100% Anonymous • Secure • Supportive</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleInternalNavigation("guidelines")}
                  className="text-slate-400 hover:text-white transition-colors flex items-center text-left"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Community Guidelines
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleInternalNavigation("features")}
                  className="text-slate-400 hover:text-white transition-colors flex items-center text-left"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Feature Documentation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleInternalNavigation("technical")}
                  className="text-slate-400 hover:text-white transition-colors flex items-center text-left"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Technical Documentation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleInternalNavigation("report-abuse")}
                  className="text-slate-400 hover:text-white transition-colors flex items-center text-left"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Report Abuse
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal & Privacy</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleInternalNavigation("privacy")}
                  className="text-slate-400 hover:text-white transition-colors flex items-center text-left"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleInternalNavigation("terms")}
                  className="text-slate-400 hover:text-white transition-colors flex items-center text-left"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleInternalNavigation("data-protection")}
                  className="text-slate-400 hover:text-white transition-colors flex items-center text-left"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Data Protection
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Crisis Resources */}
        <div className="border-t border-slate-800 pt-8 mt-8">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <HelpCircle className="w-6 h-6 text-red-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-300 mb-2">Crisis Resources</h4>
                <p className="text-red-200 text-sm mb-2">
                  If you're in immediate danger or having thoughts of self-harm, please reach out for help:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong className="text-red-300">Crisis Text Line:</strong>
                    <br />
                    <button 
                      onClick={() => handleExternalNavigation("sms:741741?body=HOME")}
                      className="text-red-200 hover:text-red-100 underline"
                    >
                      Text HOME to 741741
                    </button>
                  </div>
                  <div>
                    <strong className="text-red-300">National Suicide Prevention:</strong>
                    <br />
                    <button 
                      onClick={() => handleExternalNavigation("tel:988")}
                      className="text-red-200 hover:text-red-100 underline"
                    >
                      988 or 1-800-273-8255
                    </button>
                  </div>
                  <div>
                    <strong className="text-red-300">Emergency Services:</strong>
                    <br />
                    <button 
                      onClick={() => handleExternalNavigation("tel:911")}
                      className="text-red-200 hover:text-red-100 underline"
                    >
                      Call 911 immediately
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 mt-8 text-center">
          <p className="text-slate-500 text-sm">
            © 2024 TruthSpace. All rights reserved. Built with care for mental health awareness.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
