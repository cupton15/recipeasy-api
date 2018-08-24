import {Request, Response} from 'express';
import AuthController from '../controllers/authController';

export class Routes {
    public authController: AuthController = new AuthController();

    public routes(app): void {
        app.route('/')
        .get((req: Request, res: Response) => {
            res.status(200).send({
                message: 'GET SUCCESS'
            })
        })

        app.route('/signup')
        .post(this.authController.register);

        app.route('/login')
        .post(this.authController.login);
    }
}