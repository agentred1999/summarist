'use client';

import Link from 'next/link';
import { FiArrowLeft, FiMail } from 'react-icons/fi';

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition mb-8"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Help &amp; Support</h1>
      <p className="text-lg text-gray-600 mb-8">How can we help you?</p>

      <div className="bg-gray-50 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-6">
          Have questions? Our support team is ready to help.
        </p>
        <a
          href="mailto:support@summarist.app"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Contact Support
        </a>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>We typically respond within 24 hours</p>
      </div>
    </div>
  );
}
