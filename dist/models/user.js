"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    displayName: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    passwordConfirm: {
        type: String,
        required: true,
    }
});
UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        user.password = hash;
        user.passwordConfirm = hash;
        return next();
    });
});
UserSchema.statics.authenticate = (email, password, callback) => {
    console.log(email, password);
    User.findOne({ email: email })
        .exec((err, user) => {
        if (err) {
            return callback(err);
        }
        if (!user) {
            err = new Error('user does not exist');
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (result === true) {
                return callback(null, user);
            }
            return callback();
        });
    });
};
const User = mongoose_1.model('User', UserSchema);
exports.default = User;
//# sourceMappingURL=user.js.map