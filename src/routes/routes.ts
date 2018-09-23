import {Request, Response} from "express";
import jwt = require("jsonwebtoken");
import AuthController from "../controllers/authController";
import UserController from "../controllers/userController";

export class Routes {
    public authController: AuthController = new AuthController();
    public userController: UserController = new UserController();

    public routes(app): void {
        const requiresAuth = (req, res, next) => {
            const token = req.headers["x-access-token"];

            if (!token) {
                return res.status(401).send();
            }

            jwt.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).send({message: "Failed to authenticate token"});
                }

                req.userId = decoded.id;
                next();
            });
        };

        app.route(process.env.BASE_URL + "/register")
        .post(this.authController.register);

        app.route(process.env.BASE_URL + "/login")
        .post(this.authController.login);

        app.route(process.env.BASE_URL + "/displayname")
            .get(requiresAuth, this.userController.getDisplayName);
    }
}