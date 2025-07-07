import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Search, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import styles from './Onboarding.module.css';

import { userPreferences } from '../../api/onboarding';
import { useAuthContext } from '../../contexts/AuthContext';

interface Movie {
  id: number;
  title: string;
  year: number;
  poster: string;
  genres: string[];
  rating: number;
  popularity: number;
}

interface MovieRating {
  movieId: number;
  rating: number;
  watched: boolean;
}

const POPULAR_MOVIES: Movie[] = [
  { id: 1, title: 'The Shawshank Redemption', year: 1994, poster: 'https://images.pexels.com/photos/5662857/pexels-photo-5662857.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama'], rating: 9.3, popularity: 95 },
  { id: 2, title: 'The Godfather', year: 1972, poster: 'https://images.pexels.com/photos/7234243/pexels-photo-7234243.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Crime', 'Drama'], rating: 9.2, popularity: 92 },
  { id: 3, title: 'The Dark Knight', year: 2008, poster: 'https://images.pexels.com/photos/8118880/pexels-photo-8118880.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Crime'], rating: 9.0, popularity: 98 },
  { id: 4, title: 'Pulp Fiction', year: 1994, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Crime', 'Drama'], rating: 8.9, popularity: 89 },
  { id: 5, title: 'Forrest Gump', year: 1994, poster: 'https://images.pexels.com/photos/2549565/pexels-photo-2549565.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama', 'Romance'], rating: 8.8, popularity: 94 },
  { id: 6, title: 'Inception', year: 2010, poster: 'https://images.pexels.com/photos/8118890/pexels-photo-8118890.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Sci-Fi'], rating: 8.8, popularity: 96 },
  { id: 7, title: 'The Matrix', year: 1999, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Sci-Fi'], rating: 8.7, popularity: 91 },
  { id: 8, title: 'Goodfellas', year: 1990, poster: 'https://images.pexels.com/photos/3137890/pexels-photo-3137890.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Crime', 'Drama'], rating: 8.7, popularity: 85 },
  { id: 9, title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Adventure', 'Fantasy'], rating: 8.8, popularity: 93 },
  { id: 10, title: 'Star Wars: Episode IV - A New Hope', year: 1977, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Sci-Fi'], rating: 8.6, popularity: 97 },
  { id: 11, title: 'Casablanca', year: 1942, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama', 'Romance'], rating: 8.5, popularity: 78 },
  { id: 12, title: 'Citizen Kane', year: 1941, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama'], rating: 8.3, popularity: 72 },
  { id: 13, title: 'Titanic', year: 1997, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama', 'Romance'], rating: 7.8, popularity: 99 },
  { id: 14, title: 'Jurassic Park', year: 1993, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Adventure'], rating: 8.1, popularity: 95 },
  { id: 15, title: 'Avatar', year: 2009, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Sci-Fi'], rating: 7.8, popularity: 97 },
  { id: 16, title: 'The Avengers', year: 2012, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Adventure'], rating: 8.0, popularity: 98 },
  { id: 17, title: 'Toy Story', year: 1995, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Animation', 'Family'], rating: 8.3, popularity: 88 },
  { id: 18, title: 'Finding Nemo', year: 2003, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Animation', 'Family'], rating: 8.2, popularity: 90 },
  { id: 19, title: 'The Lion King', year: 1994, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Animation', 'Family'], rating: 8.5, popularity: 92 },
  { id: 20, title: 'Frozen', year: 2013, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrg