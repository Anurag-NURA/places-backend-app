import dotenv from "dotenv";

dotenv.config();

interface Config {
    PORT: number;
    NODE_ENV: string;
    ALLOWED_ORIGINS: string;
}

const config: Config = {
    PORT: Number(process.env.PORT) || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "http://localhost:5173",
};

export default config;
