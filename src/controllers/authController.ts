import {Request, Response} from "express";
import { body , validationResult } from "express-validator/check";
import jwt = require("jsonwebtoken");
import User from "../models/user";
import { IValidationError } from "../types/validationError";

class AuthController {

    public register = [
        body("displayName", "display name is required").exists(),
        body("email", "email is required").exists(),
        body("email", "email must be in a valid format").isEmail(),
        body("email", "email already in use").custom((value) => {
            return User.findOne( { email: value })
                .then((user) => {
                    if (user) {
                        return Promise.reject();
                    }
                });
            }),
        body("password", "password is incorrect").exists()
            .isLength({ min: 7 })
            .withMessage("password must be at least 7 characters long")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
            .withMessage("password must contain at least one capital letter, lower case letter and number"),
        (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return this.returnErrorResponse(errors, res);
            }

            User.create(req.body, (err, user) => {
            if (err) {
                return res.status(400).send(err);
            }
            return res.status(200).send(user);
        });
    },
    ];

    public login = [
        body("email", "email is required").exists(),
        body("email", "email must be in a valid format").isEmail(),
        body("password", "password is required").exists(),
        (req: Request, res: Response) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return this.returnErrorResponse(errors, res);
            }

            User.authenticate(req.body.email, req.body.password, (err, user) => {
                if (err || !user) {
                    if(!user) {
                        return res.status(400).json({ errors: { param: 'email', msg: 'no user for provided email'} });
                    }
                    return res.status(400).json({ errors: {param: 'unknown', msg: 'unknown error occurred'} });
                }

                const token = jwt.sign({id: user._id}, process.env.SECRET, {
                    expiresIn: "2h",
                });
                return res.status(200).send({ auth: true, token });
        });
    }];

    public logout = (req: Request, res: Response) => {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    return this.returnErrorResponse(err, res);
                }
                return res.status(200).send();
            });
        }
    }

    private returnErrorResponse(errors: any, res: Response) {
        const validationErrors = errors.array().map((err) => {
            return {param: err.param, errorMessage: err.msg } as IValidationError;
        });
        return res.status(400).json({ errors: validationErrors });
    }
}

export default AuthController;
