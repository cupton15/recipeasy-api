import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";

import cors = require("cors");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

import { Routes } from "./routes/routes";

class App {
    public app: express.Application;
    public routeProvider: Routes = new Routes();
    public mongoUrl: string = "mongodb://localhost/recipeasy";

    constructor() {
        this.app = express();
        this.config();
        this.mongoSetup();
        this.routeProvider.routes(this.app);
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false}));
        this.app.options('*', cors()) 
        this.app.use(cors());
    }

    private mongoSetup(): void {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
    }
}

export default new App().app;
