import {Request, Response} from 'express';
const { check, body , validationResult } = require('express-validator/check');
import User from '../models/user';


class AuthController {

    public register = [
        body('displayName', 'display name is required').exists(),
        body('email', 'email is required').exists(),
        body('email', 'email must be in a valid format').isEmail(),
        body('email', 'email already in use').custom(value => {
            return User.findOne( { email: value })
                .then(user => {
                    if(user) {
                        return Promise.reject();
                    }
                })
            }),
        body('password', 'password is required').exists(),
        body('passwordConfirm', 'passwords must match')
            .exists()
            .custom((value, { req }) => value === req.body.password),
        (req: Request, res: Response) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

        User.create(req.body, (err: Error) => {
            if(err) {
                res.send(err);
            }
            return res.status(200).send();
        })
    }
    ];

    public login = [
        body('email', 'email is required').exists(),
        body('password', 'password is required').exists(),
        (req: Request, res: Response) => {
            const errors = validationResult(req);

            if(!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            User.authenticate(req.body.email, req.body.password, (err, user) => {
                if (err || !user) {
                    return new Error();
                }
            
            req.session.userId = user._id;
            return res.status(200).send();
        })
    }]

    public logout = (req: Request, res: Response) => {
        if (req.session) {
            req.session.destroy((err) => {
                if(err) {
                    return new Error(err);
                }
                return res.status(200).send();
            })
        }
    }
};

export default AuthController;