import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import AuthController from "../controllers/authController";

export class Routes {
    public authController: AuthController = new AuthController();

    public routes(app): void {
        const requiresAuth = (req, res, next) => {
            const token = req.headers["x-access-token"];

            if (!token) {
                return res.status(401).send();
            }

            jwt.verify(token, process.env.SECRET, (err) => {
                if (err) {
                    return res.status(500).send({message: "Failed to authenticate token"});
                }

                next();
            });
        };

        app.route("/api/register")
        .post(this.authController.register);

        app.route("/api/login")
        .post(this.authController.login);
    }
}