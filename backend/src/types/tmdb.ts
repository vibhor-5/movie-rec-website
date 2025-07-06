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
    release_date?: Date;
    genre?:string[];
    posterUrl?: string;
    overview?: string;
    vote_average?: number;
}

export interface TransformedMovie {
    title: string;
    posterUrl: string | null;
    releaseDate: Date;
    voteAverage: number;
    genre: string[];
    overview: string;
    tmdbId: number;
    year: number | null;
}