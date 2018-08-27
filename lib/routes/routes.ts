import {Request, Response} from 'express';
import AuthController from '../controllers/authController';

export class Routes {
    public authController: AuthController = new AuthController();

    public routes(app): void {
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        app.route('/api/register')
        .post(this.authController.register);

        app.route('/login')
        .post(this.authController.login);
    }
}