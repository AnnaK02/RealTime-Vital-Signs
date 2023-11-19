import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface RequestWithUser extends Request {
  user?: any;
}

export default (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { authorization: token } = req.headers;

    if (!token) {
      throw new Error('Token not provided');
    }

    const decode: any = jwt.verify(
      token.replace('Bearer ', ''),
      process.env.JWT_SECRET || 'secret'
    );

    if (!decode) {
      throw new Error('Token invalid');
    }

    req.user = decode;
    req.body = {
      ...req.body,
      tenantId: decode.tenantId,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ statusCode: 401, error: 'Unauthorized' });
  }
};