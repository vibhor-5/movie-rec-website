import React, { useState } from 'react';
import { BookOpen, Users, Layers, Zap, ChevronDown, ChevronUp, Sliders } from 'lucide-react';

const EducationalPage: React.FC = () => {
  const [openSection, setOpenSection] = useState<string>('collaborative');
  const [sliderValues, setSliderValues] = useState({
    genre: 70,
    director: 60,
    actors: 50,
    plot: 80,
    visuals: 40,
  });

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  const handleSliderChange = (feature: string, value: number) => {
    setSliderValues(prev => ({
      ...prev,
      [feature]: value
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Understanding Movie Recommendations
          </h1>
          <p className="text-xl text-blue-100">
            Learn how different algorithms find the perfect movies for you
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <button 
              onClick={() => toggleSection('collaborative')}
              className={`p-6 text-left transition-colors duration-200 ${
                openSection === 'collaborative' ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-800" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Collaborative Filtering</h3>
                  <p className="text-sm text-gray-500">Finding your movie tribe</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => toggleSection('content')}
              className={`p-6 text-left transition-colors duration-200 ${
                openSection === 'content' ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Layers className="h-6 w-6 text-blue-800" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Content-Based Filtering</h3>
                  <p className="text-sm text-gray-500">Movie DNA matching</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => toggleSection('hybrid')}
              className={`p-6 text-left transition-colors duration-200 ${
                openSection === 'hybrid' ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-800" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Hybrid Systems</h3>
                  <p className="text-sm text-gray-500">Best of both worlds</p>
                </div>
              </div>
            </button>
          </div>
          
          {/* Collaborative Filtering Section */}
          {openSection === 'collaborative' && (
            <div className="p-6 bg-blue-50 border-t border-blue-100">
              <div className="md:flex">
                <div className="md:w-2/3 md:pr-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Collaborative Filtering Explained</h3>
                  <p className="text-gray-700 mb-4">
                    Collaborative filtering works on the principle that people who agreed in the past tend to agree again in the future. The algorithm finds users who share your taste in movies and recommends what they enjoyed.
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                      <li>We collect ratings from many users</li>
                      <li>Find patterns of similar rating behavior</li>
                      <li>Group users with similar tastes together</li>
                      <li>Recommend movies that others in your group enjoyed</li>
                    </ol>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Strengths:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Discovers unexpected recommendations</li>
                      <li>Gets more accurate as more users rate movies</li>
                      <li>Doesn't require understanding movie content</li>
                      <li>Works well for popular items with many ratings</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Limitations:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Cold start problem for new users with few ratings</li>
                      <li>Difficulty with new or niche movies</li>
                      <li>Popularity bias towards widely-rated films</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3 mt-6 md:mt-0">
                  <div className="bg-white rounded-lg shadow-sm p-5">
                    <h4 className="font-medium text-gray-900 mb-4">User Similarity Visualization</h4>
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm font-medium text-gray-900">You</div>
                        <div className="text-sm font-medium text-gray-900">Other Users</div>
                      </div>
                      
                      {/* User similarity visualization */}
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-medium">
                            Y
                          </div>
                          <div className="mx-3 flex-grow">
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-blue-600 rounded-full" style={{width: '90%'}}></div>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-medium">
                            A
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-medium">
                            Y
                          </div>
                          <div className="mx-3 flex-grow">
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-blue-600 rounded-full" style={{width: '75%'}}></div>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-800 font-medium">
                            B
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-medium">
                            Y
                          </div>
                          <div className="mx-3 flex-grow">
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-blue-600 rounded-full" style={{width: '60%'}}></div>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-red-800 font-medium">
                            C
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-medium">
                            Y
                          </div>
                          <div className="mx-3 flex-grow">
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-blue-600 rounded-full" style={{width: '30%'}}></div>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-800 font-medium">
                            D
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p className="mb-2">
                        The bars represent how similar your movie tastes are to other users.
                      </p>
                      <p>
                        Longer bars = more similar tastes = more relevant recommendations from those users.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Content-Based Filtering Section */}
          {openSection === 'content' && (
            <div className="p-6 bg-blue-50 border-t border-blue-100">
              <div className="md:flex">
                <div className="md:w-2/3 md:pr-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Content-Based Filtering Explained</h3>
                  <p className="text-gray-700 mb-4">
                    Content-based filtering focuses on the attributes of the movies you like, rather than finding similar users. The algorithm analyzes features like genre, director, actors, and themes to find movies similar to ones you've enjoyed.
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                      <li>Movies are represented as sets of features (genres, directors, actors, etc.)</li>
                      <li>The system analyzes movies you've rated positively</li>
                      <li>It creates a profile of your preferences based on these features</li>
                      <li>New movies are compared to your preference profile</li>
                      <li>Movies with the closest match to your profile are recommended</li>
                    </ol>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Strengths:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Works well for new users with only a few ratings</li>
                      <li>Can recommend niche or new items with few ratings</li>
                      <li>Can provide explanations for recommendations</li>
                      <li>Doesn't suffer from the cold-start problem for new movies</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Limitations:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Limited ability to recommend unexpected items</li>
                      <li>Overspecialization (recommending too similar items)</li>
                      <li>Difficulty capturing complex tastes and preferences</li>
                      <li>Requires rich feature data for each movie</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3 mt-6 md:mt-0">
                  <div className="bg-white rounded-lg shadow-sm p-5">
                    <h4 className="font-medium text-gray-900 mb-4">Feature Importance</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Adjust the sliders to see how changing feature weights affects your recommendations.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-gray-700">Genre Match</label>
                          <span className="text-sm text-gray-500">{sliderValues.genre}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={sliderValues.genre}
                          onChange={(e) => handleSliderChange('genre', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-gray-700">Director Style</label>
                          <span className="text-sm text-gray-500">{sliderValues.director}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={sliderValues.director}
                          onChange={(e) => handleSliderChange('director', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-gray-700">Actor Preference</label>
                          <span className="text-sm text-gray-500">{sliderValues.actors}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={sliderValues.actors}
                          onChange={(e) => handleSliderChange('actors', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-gray-700">Plot Elements</label>
                          <span className="text-sm text-gray-500">{sliderValues.plot}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={sliderValues.plot}
                          onChange={(e) => handleSliderChange('plot', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-gray-700">Visual Style</label>
                          <span className="text-sm text-gray-500">{sliderValues.visuals}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={sliderValues.visuals}
                          onChange={(e) => handleSliderChange('visuals', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    <button className="mt-6 w-full bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                      <Sliders className="h-4 w-4 mr-2" />
                      Apply Weights
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Hybrid Systems Section */}
          {openSection === 'hybrid' && (
            <div className="p-6 bg-blue-50 border-t border-blue-100">
              <div className="md:flex">
                <div className="md:w-2/3 md:pr-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Hybrid Recommendation Systems</h3>
                  <p className="text-gray-700 mb-4">
                    Hybrid systems combine collaborative and content-based approaches to get the best of both worlds. By merging these methods, they can overcome the limitations of each individual approach.
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                      <li>Run both collaborative and content-based algorithms in parallel</li>
                      <li>Weight the results from each method based on confidence scores</li>
                      <li>Combine the weighted recommendations into a final list</li>
                      <li>Analyze user feedback to dynamically adjust algorithm weights</li>
                    </ol>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Common hybrid approaches:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li><span className="font-medium">Weighted:</span> Combine scores from multiple recommendation techniques</li>
                      <li><span className="font-medium">Switching:</span> Choose the best algorithm based on the situation</li>
                      <li><span className="font-medium">Cascade:</span> Apply algorithms in sequence, with each refining previous results</li>
                      <li><span className="font-medium">Feature Combination:</span> Use collaborative data as additional features for content-based filtering</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Advantages of hybrid systems:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Overcomes the cold-start problem for new users and items</li>
                      <li>Provides more diverse and balanced recommendations</li>
                      <li>Reduces overspecialization and popularity bias</li>
                      <li>Higher accuracy across a wider range of scenarios</li>
                      <li>More resistant to data sparsity issues</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-1/3 mt-6 md:mt-0">
                  <div className="bg-white rounded-lg shadow-sm p-5">
                    <h4 className="font-medium text-gray-900 mb-4">Hybrid System Visualization</h4>
                    
                    <div className="mb-6">
                      <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
                        {/* Collaborative filtering results */}
                        <div className="absolute top-0 left-0 w-full h-full bg-blue-200 bg-opacity-50">
                          <div className="p-3">
                            <h5 className="text-xs font-medium text-blue-800 mb-2">Collaborative Filtering</h5>
                            <div className="space-y-2">
                              {[65, 58, 45, 40, 32].map((score, index) => (
                                <div key={index} className="flex items-center text-xs">
                                  <div className="w-16 truncate mr-2 text-gray-700">Movie {index + 1}</div>
                                  <div className="flex-grow">
                                    <div className="h-2 bg-blue-100 rounded-full">
                                      <div 
                                        className="h-2 bg-blue-600 rounded-full" 
                                        style={{width: `${score}%`}}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="ml-2 w-7 text-right text-gray-700">{score}%</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Content-based filtering results */}
                        <div className="absolute top-0 left-0 w-full h-full transform translate-y-[120px] transition-transform duration-300 ease-in-out hover:translate-y-0">
                          <div className="bg-teal-200 bg-opacity-50 h-full p-3">
                            <h5 className="text-xs font-medium text-teal-800 mb-2">Content-Based Filtering</h5>
                            <div className="space-y-2">
                              {[72, 60, 53, 38, 30].map((score, index) => (
                                <div key={index} className="flex items-center text-xs">
                                  <div className="w-16 truncate mr-2 text-gray-700">Movie {index + 3}</div>
                                  <div className="flex-grow">
                                    <div className="h-2 bg-teal-100 rounded-full">
                                      <div 
                                        className="h-2 bg-teal-600 rounded-full" 
                                        style={{width: `${score}%`}}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="ml-2 w-7 text-right text-gray-700">{score}%</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center mt-3 text-xs text-gray-500">
                        <p>(Hover to see content-based results)</p>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-3">Final Hybrid Results</h4>
                    <div className="space-y-2">
                      {[85, 76, 68, 62, 55].map((score, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <div className="w-20 truncate mr-2 font-medium text-gray-700">Movie {index + 1}</div>
                          <div className="flex-grow">
                            <div className="h-3 bg-gray-200 rounded-full">
                              <div 
                                className="h-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full" 
                                style={{width: `${score}%`}}
                              ></div>
                            </div>
                          </div>
                          <div className="ml-2 w-8 text-right font-medium text-gray-700">{score}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* "Try It Yourself" Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Try It Yourself: Algorithm Comparison</h3>
            <p className="text-gray-600 mt-1">
              See how different algorithms generate recommendations for the same user profile
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-800" />
                  Collaborative Filtering Results
                </h4>
                <ul className="space-y-3">
                  {[
                    { title: "The Dark Knight", match: 94 },
                    { title: "Interstellar", match: 88 },
                    { title: "The Matrix", match: 85 },
                    { title: "Fight Club", match: 82 },
                    { title: "The Prestige", match: 79 }
                  ].map((movie, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="text-gray-800">{movie.title}</span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {movie.match}% match
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-teal-800" />
                  Content-Based Filtering Results
                </h4>
                <ul className="space-y-3">
                  {[
                    { title: "Inception", match: 96 },
                    { title: "Tenet", match: 91 },
                    { title: "The Prestige", match: 87 },
                    { title: "Memento", match: 84 },
                    { title: "Shutter Island", match: 77 }
                  ].map((movie, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="text-gray-800">{movie.title}</span>
                      <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {movie.match}% match
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-5 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-orange-600" />
                Hybrid Approach Results
              </h4>
              <ul className="space-y-3">
                {[
                  { title: "Inception", match: 96, reason: "Perfect match for your preferences in complex narratives and visual style" },
                  { title: "The Dark Knight", match: 94, reason: "Highly rated by users with similar taste to yours" },
                  { title: "Tenet", match: 91, reason: "Matches your interest in Christopher Nolan films with mind-bending plots" },
                  { title: "Interstellar", match: 88, reason: "Combines sci-fi elements and emotional depth you've enjoyed in other films" },
                  { title: "The Prestige", match: 87, reason: "Blends plot complexity and directorial style you prefer" }
                ].map((movie, index) => (
                  <li key={index} className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{movie.title}</span>
                      <span className="bg-gradient-to-r from-blue-600 to-teal-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {movie.match}% match
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{movie.reason}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            <FaqItem 
              question="Why are my recommendations sometimes unexpected?"
              answer="This is often the result of collaborative filtering finding patterns in user behavior that aren't immediately obvious. Users who like the same movies you do might also enjoy films in completely different genres that share subtle qualities like pacing, themes, or emotional impact."
            />
            
            <FaqItem 
              question="How many movies do I need to rate to get good recommendations?"
              answer="For basic recommendations, rating 10-15 diverse movies is usually sufficient. However, the more movies you rate, especially across different genres and time periods, the more accurate your recommendations will become. Our hybrid system can start providing decent suggestions even with just a few ratings."
            />
            
            <FaqItem 
              question="Why do I see popular movies in my recommendations even if they don't match my taste?"
              answer="This is called popularity bias, and it's a common challenge in recommendation systems. Popular items have more ratings, making them more likely to appear in collaborative filtering results. We try to balance this by using our hybrid approach, but occasionally including popular titles helps users discover broadly appealing films they might have missed."
            />
            
            <FaqItem 
              question="Can I influence which algorithm is used for my recommendations?"
              answer="Yes! In your dashboard, you can select which algorithm you prefer, and you can also adjust the feature weights in the content-based system. This gives you direct control over how your recommendations are generated, allowing you to explore different approaches and find what works best for your unique tastes."
            />
            
            <FaqItem 
              question="How does the system handle new movies with few ratings?"
              answer="New movies with limited ratings are primarily recommended through content-based filtering, which analyzes the movie's features rather than user ratings. As more users rate the film, collaborative elements are gradually incorporated into its recommendation profile."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="py-4 px-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full justify-between items-center text-left"
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="mt-2 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default EducationalPage;