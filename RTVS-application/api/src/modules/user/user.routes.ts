import { Router } from 'express';
import authorizationMiddleware from '../../routes/middlewares/authorization.middleware';
import UserController from './user.controller';

export default (router: Router) => {

  router.use('/me', authorizationMiddleware);
  router.get('/me', (req, res) => UserController.me(req, res));

};
