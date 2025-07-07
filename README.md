# Multi Recsys Movie Recommendation

MovieRec(tentative) is a full-stack educational movie recommendation platform. It helps users discover new films and learn how recommendation algorithms work, combining collaborative filtering, content-based filtering, and hybrid approaches. The platform features a modern UI, robust backend, and extensible ML modules.

---

## Features

- **Personalized Recommendations**: Tailored movie suggestions using multiple algorithms.
- **Educational Insights**: Learn how recommendation systems work with interactive visualizations.
- **Onboarding & Taste Profiling**: Rate movies and set preferences to build your unique taste profile.
- **Modern UI**: Responsive frontend built with React, TypeScript, and Tailwind CSS.
- **Robust Backend**: Node.js/Express API with Prisma ORM and PostgreSQL.
- **Extensible ML Models**: Python-based modules for experimenting with new algorithms.

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
│   ├── index.html
│   ├── package.json
│   └── ...
│
├── ml/              # Python ML models and training scripts
│   ├── train.py
│   ├── base/
│   ├── models/
│   └── ...
│
├── env/             # Python virtual environment (auto-generated)
│   └── ...
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Python 3.8+
- PostgreSQL

### 1. Backend Setup

```sh
cd backend
cp .env.example .env   # Edit with your DB credentials
npm install
npx prisma migrate dev
npm run dev
```

### 2. Frontend Setup

```sh
cd frontend
npm install
npm run dev
```

### 3. ML Model Training (Optional)

```sh
cd ml
pip install -r requirements.txt
python train.py
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

_Discover. Learn. Enjoy movies._
