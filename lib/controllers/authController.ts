import {Request, Response} from 'express';
const { check, body , validationResult } = require('express-validator/check');
import User from '../models/user';

class AuthController {

    public register = [
        body('displayName', 'display name is required').exists(),
        body('email', 'email is required').exists(),
        body('email', 'email must be in a valid format').isEmail(),
        body('password', 'password is required').exists(),
        body('passwordConfirm', 'passwords must match')
            .exists()
            .custom((value, { req }) => value === req.body.password)
           ,
        (req: Request, res: Response) => {
            const errors = validationResult(req);

            if(!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            User.create(req.body, (err) => {
                if(err) {
                    res.send(err);
                }
                return res.status(200).send();
            })
        }
    ];

    public login = (req: Request, res: Response) => {
        console.log(req.body.email, req.body.password)
        User.authenticate(req.body.email, req.body.password, (err, user) => {
            if (err || !user) {
                console.log(err);
                console.log(user);
                return res.status(401).send();
            }
            req.session.userId = user._id;
            return res.status(200).send();
        })
    }
};

export default AuthController;