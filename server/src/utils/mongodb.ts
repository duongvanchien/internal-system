import mongoose from "mongoose";
import dotenv from "./dotenv";
import logger from './logger';

dotenv.config();

const {
    DB_HOST = process.env.DB_HOST,
    DB_PORT = process.env.DB_PORT,
    DB_USER = process.env.DB_USER,
    DB_PWD = process.env.DB_PWD,
    DB_NAME = process.env.DB_NAME
} = process.env;

const DB_URL = `mongodb://${DB_HOST}:${DB_PORT}`;

const connectDatabase = (callback?: () => void) => {
    mongoose
        .connect(DB_URL, {
            dbName: DB_NAME,
            auth: {
                username: DB_USER,
                password: DB_PWD,
            },
            authSource: DB_NAME,
        })
        .then(() => {
            logger.info("MongoDB connected:", {
                url: DB_URL,
                dbName: DB_NAME
            });
            if (callback) callback();
        })
        .catch((err) => logger.error("MongoDB initial connection error: ", err));

    mongoose.connection.on("error", (err) => {
        console.log("MongoDB error: ", err);
    });
};

export default connectDatabase;
