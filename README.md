# MovieRec: Educational Movie Recommendation Platform

MovieRec is a full-stack, educational movie recommendation platform that helps users discover new films while learning how recommendation algorithms work. The platform combines collaborative filtering, content-based filtering, and hybrid approaches, offering both personalized recommendations and interactive educational insights.

---

## Features

- **Personalized Movie Recommendations**: Get suggestions tailored to your taste using multiple algorithms.
- **Educational Insights**: Learn how recommendation systems work through interactive visualizations and explanations.
- **Onboarding & Taste Profiling**: Rate movies and set preferences to build your unique taste profile.
- **Modern UI**: Responsive, user-friendly frontend built with React, Tailwind CSS, and TypeScript.
- **Robust Backend**: Node.js/Express API with Prisma ORM and PostgreSQL for data management.
- **Extensible ML Models**: Python-based pre-training and recommender modules for experimenting with new algorithms.

---

## Project Structure

```
project/
│
├── backend/         # Node.js/Express API, Prisma ORM, PostgreSQL
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── ...
│
├── frontend/        # React + TypeScript + Tailwind CSS client
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── ...
│
├── pre_training/    # Python ML models for offline training
│   ├── base/
│   ├── models/
│   └── ...
│
└── recommender/     # Python recommender system logic
    ├── models/
    ├── data/
    ├── API/
    └── ...
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Python 3.8+
- PostgreSQL

### 1. Backend Setup

```bash
cd backend
cp .env.example .env   # Edit with your DB credentials
npm install
npx prisma migrate dev
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Pre-training & Recommender (Python)

```bash
cd pre_training
pip install -r requirements.txt
# Train or evaluate models as needed

cd ../recommender
pip install -r requirements.txt
# Run recommender scripts or API
```

---

## Key Technologies

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, Prisma ORM, JWT Auth
- **Database**: PostgreSQL
- **ML/Recommendation**: Python, PyTorch, Matrix Factorization, Hybrid Models

---

## Educational Value

MovieRec is designed not just to recommend movies, but to **demystify the algorithms** behind recommendations. Users can:
- See why a movie was recommended
- Compare different algorithms
- Explore their own taste profile

---

## Contributing

Pull requests and issues are welcome! Please open an issue to discuss your ideas or report bugs.

---

## License

MIT License

---

## Acknowledgements

- [TMDB API](https://www.themoviedb.org/documentation/api) for movie data
- Open source libraries and the developer community

---

_Discover. Learn. Enjoy movies