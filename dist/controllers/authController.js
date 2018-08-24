"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { check, body, validationResult } = require('express-validator/check');
const user_1 = require("../models/user");
class AuthController {
    constructor() {
        this.register = [
            body('displayName', 'display name is required').exists(),
            body('email', 'email is required').exists(),
            body('email', 'email must be in a valid format').isEmail(),
            body('password', 'password is required').exists(),
            body('passwordConfirm', 'passwords must match')
                .exists()
                .custom((value, { req }) => value === req.body.password),
            (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() });
                }
                user_1.default.create(req.body, (err) => {
                    if (err) {
                        res.send(err);
                    }
                    return res.status(200).send();
                });
            }
        ];
        this.login = (req, res) => {
            console.log(req.body.email, req.body.password);
            user_1.default.authenticate(req.body.email, req.body.password, (err, user) => {
                if (err || !user) {
                    console.log(err);
                    console.log(user);
                    return res.status(401).send();
                }
                req.session.userId = user._id;
                return res.status(200).send();
            });
        };
    }
}
;
exports.default = AuthController;
//# sourceMappingURL=authController.js.map