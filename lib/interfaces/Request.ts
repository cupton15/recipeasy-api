import * as Express from 'express';

export default interface Request extends Express.Request {
    session: [any],
}