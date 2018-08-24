"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const routes_1 = require("./routes/routes");
class App {
    constructor() {
        this.routeProvider = new routes_1.Routes();
        this.mongoUrl = 'mongodb://localhost/recipeasy';
        this.app = express();
        this.config();
        this.mongoSetup();
        this.routeProvider.routes(this.app);
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(session({
            secret: process.env.SECRET,
            resave: true,
            saveUninitialized: false,
        }));
    }
    mongoSetup() {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map