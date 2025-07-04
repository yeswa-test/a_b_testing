import {MongoImportation} from "./mongoose_connect/mongo_connect";
import express from 'express';
import {applyProductionRoutes} from "./api/api_routes";

// Extend Express Response interface
declare global {
    namespace Express {
        interface Response {
            sendWithLog(msg: string): void;
        }
    }
}

async function startServer(): Promise<void> {
    try {
        // Connect to MongoDB first
        console.log("Connecting to MongoDB...");
        await MongoImportation.connectDB();
        console.log("MongoDB connected successfully");

        // Create Express app
        const app = express()
        const bodyParser = require('body-parser');
        app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));
        app.use(bodyParser.json({limit: '10mb'}));
        const cors = require('cors');
        app.use(cors());

        // Custom middleware for logging
        app.use(function (req, res, next) {
            res.sendWithLog = function (msg: string) {
                res.send(msg);
                return console.log(msg);
            };
            next();
        });

        // Apply routes
        applyProductionRoutes(app);

        // Start server
        const PORT: number = 5001;
        app.listen(PORT, () => {
            console.log(`#########################################`);
            console.log(`API server listening on port: ${PORT}`);
            console.log(`Server started successfully!`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
    }
}

// Start the server
startServer();