import {Request, Response} from "express";
import AuthController from "../controllers/authController";

export class Routes {
    public authController: AuthController = new AuthController();

    public routes(app): void {
        //put in const
        // app.use((req, res, next) => {
        //     if (req.session && !req.session.user) {
        //         return res.sendStatus(401);
        //     }
        //     next();
        // });

        app.route("/api/register")
        .post(this.authController.register);

        app.route("/api/login")
        .post(this.authController.login);
    }
}