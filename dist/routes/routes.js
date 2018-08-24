"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = require("../controllers/authController");
class Routes {
    constructor() {
        this.authController = new authController_1.default();
    }
    routes(app) {
        app.route('/')
            .get((req, res) => {
            res.status(200).send({
                message: 'GET SUCCESS'
            });
        });
        app.route('/signup')
            .post(this.authController.register);
        app.route('/login')
            .post(this.authController.login);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map