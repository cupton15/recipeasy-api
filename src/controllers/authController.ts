import {Request, Response} from 'express';
const { check, body , validationResult } = require('express-validator/check');
import User from '../models/user';
import ValidationError from '../interfaces/validationError.interface';


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
                return this.returnErrorResponse(errors, res);
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
                return this.returnErrorResponse(errors, res);
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

    private returnErrorResponse(errors: any, res: Response) {
        const validationErrors = errors.array().map(err => <ValidationError>{
            param: err.param,
            errorMessage: err.value
        });
        return res.status(400).json({ errors: validationErrors });
    }
};

export default AuthController;