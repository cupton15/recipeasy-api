import * as bcrypt from 'bcrypt';
import {model, Schema} from 'mongoose';

const UserSchema = new Schema({
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
    }
});

UserSchema.pre('save', function(next) {
    const user = this;

    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        user.password = hash;
        user.passwordConfirm = hash;
        return next();
    })
});

UserSchema.statics.authenticate = (email, password, callback) => {
    User.findOne({ email })
        .then((err, user) => {
            if (err) {
                console.log(err);
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

const User = model('User', UserSchema);

export default User;