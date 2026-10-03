import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/database.js';
import authRouter from './routes/authRoutes.js';
import orgRouter from './routes/orgRoutes.js';
import userRouter from './routes/userRoutes.js';
import jobRouter from './routes/jobRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import cookieParser from 'cookie-parser';
import config from './config/config.js';

const app = express();

app.use(cors({
    origin: config.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/org", orgRouter);
app.use("/api/user", userRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/courses", courseRouter);

connectDB();

const PORT = config.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;