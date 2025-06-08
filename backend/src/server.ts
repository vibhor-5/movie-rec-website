import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from './generated/prisma';
import authRoutes from './routes/authRoutes';

dotenv.config();``

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Hello World"
    });
});

app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

