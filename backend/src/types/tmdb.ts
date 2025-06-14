export interface TMDBResult {
    id: number;
    title?: string;
    name?: string;
    genre_ids?: number[];
    genres?: { name: string }[];
    release_date?: string;
    poster_path?: string;
    media_type?: string;
}

export interface ExternalIDsResponse {
    imdb_id?: string;
}

export interface Movie  {
    id: number;
    title?: string;
    name?: string;
    genre_ids?: number[];
    release_date?: string;
    genres?: { name: string }[];
    poster_path?: string;
};

export interface TransformedMovie  {
    tmdbId: number;
    title: string | null;
    genre_ids: number[];
    year: number | null;
    genre: string[];
    posterUrl: string | null;
    imdbId: string | null;
};