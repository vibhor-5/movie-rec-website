import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/AuthContext';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthContext();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          MovieRec
        </Link>
        
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/discover" className={styles.navLink}>Discover</Link>
          <Link to="/educational" className={styles.navLink}>Learn</Link>
        </nav>

        <div className={styles.auth}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>{user?.name}</span>
              <button onClick={logout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className={styles.loginButton}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 