import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from './generated/prisma';
import authRoutes from './routes/authRoutes';
import onboardingRoutes from './routes/onboardingRoutes'

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes);
app.use("/", onboardingRoutes)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

