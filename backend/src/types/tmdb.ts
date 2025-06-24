export interface TMDBResult {
    id: number;
    title?: string;
    name?: string;
    genre_ids?: number[];
    genres?: { id: number; name: string }[];
    release_date?: string;
    poster_path?: string;
    media_type?: string;
    overview?: string;
    vote_average?: number;
}

export interface ExternalIDsResponse {
    imdb_id?: string;
}

export interface Movie {
    id: number;
    title?: string;
    name?: string;
    genre_ids?: number[];
    release_date?: string;
    genres?: { id: number; name: string }[];
    poster_path?: string;
    overview?: string;
    vote_average?: number;
}

export interface TransformedMovie {
    id: number;
    title: string;
    posterPath: string | null;
    releaseDate: string;
    voteAverage: number;
    genres: string[];
    overview: string;
    imdbId: string | null;
    tmdbId: number;
    year: number | null;
}