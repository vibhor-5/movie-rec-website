import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Film, BookOpen, Heart, Users, Layers, Zap, Star, Play } from 'lucide-react';
import styles from './Landing.module.css';

const Landing: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Discover Your Next Favorite Film
            </h1>
            <p className={styles.heroSubtitle}>
              MovieRec uses advanced algorithms to find movies you'll love. Learn how it works while getting personalized recommendations.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/auth" className={styles.primaryButton}>
                Get Started Free
                <ChevronRight className={styles.buttonIcon} />
              </Link>
              <Link to="/educational" className={styles.secondaryButton}>
                <Play className={styles.buttonIcon} />
                See How It Works
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.movieGrid}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={styles.movieCard}>
                  <div className={styles.moviePoster}></div>
                  <div className={styles.movieRating}>
                    <Star className={styles.starIcon} />
                    <span>{(8 + Math.random() * 2).toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.heroWave}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,31,10.22,94.47,29.37c65.52,20.06,133.4,29.71,199.93,34.85A720.88,720.88,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContent}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>How MovieRec Works</h2>
            <p className={styles.featuresSubtitle}>
              Our platform combines multiple recommendation algorithms to find the perfect movies for you while explaining the technology behind it.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Heart />
              </div>
              <h3 className={styles.featureTitle}>Personalized Recommendations</h3>
              <p className={styles.featureDescription}>
                Rate movies you've watched and receive tailored recommendations based on your unique taste profile.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <BookOpen />
              </div>
              <h3 className={styles.featureTitle}>Educational Insights</h3>
              <p className={styles.featureDescription}>
                Learn how recommendation algorithms work with interactive visualizations and simple explanations.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Film />
              </div>
              <h3 className={styles.featureTitle}>Multiple Algorithms</h3>
              <p className={styles.featureDescription}>
                Compare different recommendation techniques and understand why specific movies are suggested to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithm Section */}
      <section className={styles.algorithms}>
        <div className={styles.algorithmsContent}>
          <div className={styles.algorithmsHeader}>
            <h2 className={styles.algorithmsTitle}>Three Powerful Algorithms Working Together</h2>
            <p className={styles.algorithmsSubtitle}>
              Understand the science behind your recommendations
            </p>
          </div>

          <div className={styles.algorithmsGrid}>
            <div className={styles.algorithmCard}>
              <div className={styles.algorithmIcon}>
                <Users />
              </div>
              <h3 className={styles.algorithmTitle}>Collaborative Filtering</h3>
              <p className={styles.algorithmDescription}>
                "Users like you also enjoyed..." - Find movies based on what similar users love.
              </p>
              <div className={styles.algorithmExample}>
                <div className={styles.userSimilarity}>
                  <div className={styles.userBar} style={{ width: '90%' }}></div>
                  <div className={styles.userBar} style={{ width: '75%' }}></div>
                  <div className={styles.userBar} style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>

            <div className={styles.algorithmCard}>
              <div className={styles.algorithmIcon}>
                <Layers />
              </div>
              <h3 className={styles.algorithmTitle}>Content-Based Filtering</h3>
              <p className={styles.algorithmDescription}>
                "Because you liked..." - Recommendations based on movie features like genre, director, and cast.
              </p>
              <div className={styles.algorithmExample}>
                <div className={styles.contentFeatures}>
                  <div className={styles.feature}>Genre: 85%</div>
                  <div className={styles.feature}>Director: 70%</div>
                  <div className={styles.feature}>Cast: 60%</div>
                </div>
              </div>
            </div>

            <div className={styles.algorithmCard}>
              <div className={styles.algorithmIcon}>
                <Zap />
              </div>
              <h3 className={styles.algorithmTitle}>Hybrid Approach</h3>
              <p className={styles.algorithmDescription}>
                "Our best picks for you" - Combines both methods for the most accurate recommendations.
              </p>
              <div className={styles.algorithmExample}>
                <div className={styles.hybridResult}>
                  <div className={styles.hybridBar}>
                    <div className={styles.collaborativePart}></div>
                    <div className={styles.contentPart}></div>
                  </div>
                  <span className={styles.hybridScore}>95% Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className={styles.gettingStarted}>
        <div className={styles.gettingStartedContent}>
          <div className={styles.gettingStartedText}>
            <h2 className={styles.gettingStartedTitle}>Get Started in Three Simple Steps</h2>
            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Create an Account</h3>
                  <p className={styles.stepDescription}>
                    Sign up with your email or social media in less than a minute.
                  </p>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Rate Movies You've Watched</h3>
                  <p className={styles.stepDescription}>
                    Tell us about movies you've seen to calibrate your taste profile.
                  </p>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Discover and Learn</h3>
                  <p className={styles.stepDescription}>
                    Explore personalized recommendations and learn how they're generated.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.gettingStartedButton}>
              <Link to="/auth" className={styles.primaryButton}>
                Create Free Account
              </Link>
            </div>
          </div>
          
          <div className={styles.gettingStartedVisual}>
            <div className={styles.mockupContainer}>
              <div className={styles.mockup}>
                <div className={styles.mockupHeader}>
                  <div className={styles.mockupDots}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className={styles.mockupContent}>
                  <div className={styles.mockupSection}>
                    <div className={styles.mockupTitle}></div>
                    <div className={styles.mockupMovies}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={styles.mockupMovie}></div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.mockupSection}>
                    <div className={styles.mockupTitle}></div>
                    <div className={styles.mockupMovies}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={styles.mockupMovie}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.testimonialsContent}>
          <div className={styles.testimonialsHeader}>
            <h2 className={styles.testimonialsTitle}>What Our Users Say</h2>
          </div>

          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <div className={styles.testimonialAvatar}>M</div>
                <div className={styles.testimonialInfo}>
                  <h4 className={styles.testimonialName}>Michael K.</h4>
                  <p className={styles.testimonialRole}>Film Student</p>
                </div>
              </div>
              <p className={styles.testimonialText}>
                "I love how MovieRec not only recommends great movies but explains why they were chosen. It's helped me discover classic films I never would have found otherwise."
              </p>
              <div className={styles.testimonialRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={styles.testimonialStar} />
                ))}
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <div className={styles.testimonialAvatar}>S</div>
                <div className={styles.testimonialInfo}>
                  <h4 className={styles.testimonialName}>Sarah T.</h4>
                  <p className={styles.testimonialRole}>Data Scientist</p>
                </div>
              </div>
              <p className={styles.testimonialText}>
                "As someone who works with algorithms, I appreciate the educational aspect. The visualizations make complex concepts accessible without oversimplifying."
              </p>
              <div className={styles.testimonialRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={styles.testimonialStar} />
                ))}
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <div className={styles.testimonialAvatar}>J</div>
                <div className={styles.testimonialInfo}>
                  <h4 className={styles.testimonialName}>James L.</h4>
                  <p className={styles.testimonialRole}>Movie Enthusiast</p>
                </div>
              </div>
              <p className={styles.testimonialText}>
                "MovieRec has transformed how I find movies to watch. The recommendations are spot-on, and I love being able to adjust the algorithm parameters myself."
              </p>
              <div className={styles.testimonialRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={styles.testimonialStar} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Discover Your Next Favorite Film?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of users who are discovering new films and learning about recommendation algorithms.
          </p>
          <Link to="/auth" className={styles.ctaButton}>
            Get Started Now
            <ChevronRight className={styles.buttonIcon} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;