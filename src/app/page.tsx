import NominationForm from '@/components/nomination-form/NominationForm';
import Image from 'next/image';
import { ShieldCheck, Award, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with gradient and navigation */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-md">
        <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white rounded-lg p-2 mr-3">
                <Image
                  src="/next.svg"
                  alt="Checkatrade Logo"
                  width={90}
                  height={30}
                  className="h-6 w-auto"
                />
              </div>
              <h1 className="text-xl font-bold text-white">Checkatrade Awards</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-blue-100 hover:text-white font-medium transition-colors">Home</a>
              <a href="#" className="text-blue-100 hover:text-white font-medium transition-colors">Past Winners</a>
              <a href="#" className="text-blue-100 hover:text-white font-medium transition-colors">FAQs</a>
              <a href="#" className="text-blue-100 hover:text-white font-medium transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero section with improved visuals */}
          <div className="relative text-center mb-16">
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 transform opacity-10">
                <Award className="h-96 w-96 text-blue-600" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
              Nominate a Trade for the 2025 Awards
            </h2>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Recognize exceptional trades who demonstrate trust, quality, and reliability.
              Your nomination helps celebrate excellence in the industry.
            </p>
            
            <div className="mt-10 flex flex-wrap justify-center gap-8 md:gap-12">
              <div className="flex flex-col items-center group">
                <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-full h-20 w-20 flex items-center justify-center mb-3 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <ShieldCheck className="h-10 w-10 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">Trust</span>
              </div>
              
              <div className="flex flex-col items-center group">
                <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-full h-20 w-20 flex items-center justify-center mb-3 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Award className="h-10 w-10 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">Quality</span>
              </div>
              
              <div className="flex flex-col items-center group">
                <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-full h-20 w-20 flex items-center justify-center mb-3 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Clock className="h-10 w-10 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">Reliability</span>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5 rounded-t-lg">
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Award Nomination Form</h3>
                    <p className="text-blue-100 mt-1 text-sm">Complete all steps to submit your nomination</p>
                  </div>
                </div>
              </div>
              <NominationForm />
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Having trouble with your nomination? <a href="#" className="text-blue-600 hover:text-blue-800 underline">Contact support</a>
              </p>
            </div>
          </div>
          
          {/* Improved 'Why Your Nomination Matters' section */}
          <div className="rounded-2xl overflow-hidden shadow-md mb-20">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 px-8">
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Why Your Nomination Matters</h3>
              </div>
            </div>
            
            <div className="bg-white p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-b from-white to-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-100">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-14 w-14 flex items-center justify-center mb-5 shadow-md mx-auto">
                    <span className="text-xl font-bold text-white">1</span>
                  </div>
                  <h4 className="text-xl font-medium text-gray-900 mb-3 text-center">Recognition</h4>
                  <p className="text-gray-600 text-center">Your nomination helps hardworking trades get the recognition they deserve for their exceptional service.</p>
                </div>
                
                <div className="bg-gradient-to-b from-white to-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-100">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-14 w-14 flex items-center justify-center mb-5 shadow-md mx-auto">
                    <span className="text-xl font-bold text-white">2</span>
                  </div>
                  <h4 className="text-xl font-medium text-gray-900 mb-3 text-center">Industry Standards</h4>
                  <p className="text-gray-600 text-center">By highlighting quality work, we help set high standards across the industry for all trades.</p>
                </div>
                
                <div className="bg-gradient-to-b from-white to-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-100">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-14 w-14 flex items-center justify-center mb-5 shadow-md mx-auto">
                    <span className="text-xl font-bold text-white">3</span>
                  </div>
                  <h4 className="text-xl font-medium text-gray-900 mb-3 text-center">Community</h4>
                  <p className="text-gray-600 text-center">Your stories help build a community that values and celebrates excellence in trades.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">
            &copy; 2025 Checkatrade. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
