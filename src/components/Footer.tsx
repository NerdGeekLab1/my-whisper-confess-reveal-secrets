
import { Heart, Shield, FileText, Users, HelpCircle, Lock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
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
                <a href="/guidelines" className="text-slate-400 hover:text-white transition-colors flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Community Guidelines
                </a>
              </li>
              <li>
                <a href="/features" className="text-slate-400 hover:text-white transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Feature Documentation
                </a>
              </li>
              <li>
                <a href="/technical" className="text-slate-400 hover:text-white transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Technical Documentation
                </a>
              </li>
              <li>
                <a href="/report-abuse" className="text-slate-400 hover:text-white transition-colors flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Report Abuse
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal & Privacy</h4>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-slate-400 hover:text-white transition-colors flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-slate-400 hover:text-white transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/data-protection" className="text-slate-400 hover:text-white transition-colors flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Data Protection
                </a>
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
                    <br />Text HOME to 741741
                  </div>
                  <div>
                    <strong className="text-red-300">National Suicide Prevention:</strong>
                    <br />988 or 1-800-273-8255
                  </div>
                  <div>
                    <strong className="text-red-300">Emergency Services:</strong>
                    <br />Call 911 immediately
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
