import {Request, Response} from "express";
import User from "../models/user";

class UserController {
    public getDisplayName = (req, res) => {
        User.findById(req.userId, (err, user) => {
            if (err) {
                return res.status(500).send("error occured finding the user");
            }

            if (!user) {
                return res.status(404).send("could not find user");
            }

            res.status(200).send({displayName: user.displayName});
        });
    }
}

export default UserController;