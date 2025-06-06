import React from 'react';
import { ChevronRight, Film, BookOpen, Heart } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Discover Your Next Favorite Film
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              FilmSage uses advanced algorithms to find movies you'll love. Learn how it works while getting personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors duration-200 inline-flex items-center justify-center">
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors duration-200 inline-flex items-center justify-center">
                Learn How It Works
                <BookOpen className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24 text-gray-50 fill-current">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,31,10.22,94.47,29.37c65.52,20.06,133.4,29.71,199.93,34.85A720.88,720.88,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How FilmSage Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform combines multiple recommendation algorithms to find the perfect movies for you while explaining the technology behind it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-sm p-8 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-blue-800" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Recommendations</h3>
              <p className="text-gray-600">
                Rate movies you've watched and receive tailored recommendations based on your unique taste profile.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-sm p-8 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-blue-800" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Educational Insights</h3>
              <p className="text-gray-600">
                Learn how recommendation algorithms work with interactive visualizations and simple explanations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-sm p-8 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Film className="w-6 h-6 text-blue-800" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multiple Algorithms</h3>
              <p className="text-gray-600">
                Compare different recommendation techniques and understand why specific movies are suggested to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Started in Three Simple Steps</h2>
              <div className="space-y-8 mt-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-800 text-white">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">Create an Account</h3>
                    <p className="mt-2 text-gray-600">
                      Sign up with your email or social media in less than a minute.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-800 text-white">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">Rate Movies You've Watched</h3>
                    <p className="mt-2 text-gray-600">
                      Tell us about movies you've seen to calibrate your taste profile.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-800 text-white">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">Discover and Learn</h3>
                    <p className="mt-2 text-gray-600">
                      Explore personalized recommendations and learn how they're generated.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <button className="px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-lg transition-colors duration-200 inline-flex items-center justify-center">
                  Create Free Account
                </button>
              </div>
            </div>
            
            <div className="md:w-1/2 md:ml-10">
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-blue-800 to-teal-500 aspect-video rounded-xl overflow-hidden relative p-10">
                  <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                    <div className="flex flex-col space-y-3">
                      <div className="h-3 w-32 bg-blue-200 rounded-full"></div>
                      <div className="grid grid-cols-5 gap-3">
                        {[1, 2, 3, 4, 5].map((poster) => (
                          <div key={poster} className="aspect-[2/3] bg-blue-100 rounded-md"></div>
                        ))}
                      </div>
                      <div className="h-3 w-40 bg-blue-200 rounded-full"></div>
                      <div className="grid grid-cols-5 gap-3">
                        {[1, 2, 3, 4, 5].map((poster) => (
                          <div key={poster} className="aspect-[2/3] bg-teal-100 rounded-md"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xl">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Michael K.</h4>
                  <p className="text-sm text-gray-500">Film Student</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I love how FilmSage not only recommends great movies but explains why they were chosen. It's helped me discover classic films I never would have found otherwise."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xl">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Sarah T.</h4>
                  <p className="text-sm text-gray-500">Data Scientist</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As someone who works with algorithms, I appreciate the educational aspect. The visualizations make complex concepts accessible without oversimplifying."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xl">
                  J
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">James L.</h4>
                  <p className="text-sm text-gray-500">Movie Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "FilmSage has transformed how I find movies to watch. The recommendations are spot-on, and I love being able to adjust the algorithm parameters myself."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-800 to-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Discover Your Next Favorite Film?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of users who are discovering new films and learning about recommendation algorithms.
          </p>
          <button className="px-8 py-4 bg-white text-blue-800 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200 inline-flex items-center justify-center text-lg">
            Get Started Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;