import { Router } from 'express';
import authorizationMiddleware from '../../routes/middlewares/authorization.middleware';
import CustomerController from './customer.controller';

export default (router: Router) => {

  router.use('/customer', authorizationMiddleware);
  router.get('/customer', (req, res) => CustomerController.findAll(req, res));

};
