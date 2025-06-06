import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/AuthContext';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          MovieRec
        </Link>
        
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/movies" className={styles.navLink}>Movies</Link>
          <Link to="/educational" className={styles.navLink}>Learn</Link>
          {isAuthenticated && (
            <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
          )}
        </nav>

        <div className={styles.userSection}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <Link to="/profile" className={styles.profileLink}>
                {user?.name || 'Profile'}
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/auth" className={styles.loginButton}>
                Login
              </Link>
              <Link to="/auth" className={styles.registerButton}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;