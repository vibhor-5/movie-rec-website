import { PrismaClient } from '../src/generated/prisma';
import axios from 'axios';

const prisma = new PrismaClient();
const TMDB_API_KEY = process.env.TMDB_BEARER_TOKEN;

const fetchGenres = async () => {
    const res = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
        headers: {
            Authorization: `Bearer ${TMDB_API_KEY}`,
        },
        params: { language: 'en-US' },
    });
    return (res as any).data.genres;
};

async function main() {
    console.log("starting seed")
    const genres = await fetchGenres();
    for (const genre of genres) {
        await prisma.genre.upsert({
            where: { id: genre.id },
            update: { name: genre.name },
            create: { id: genre.id, name: genre.name },
        });
    }
    console.log('Genres seeded');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
