import { Router } from 'express';
import AuthController from './auth.controller';

export default (router: Router) => {

  router.post('/auth/login', (req, res) => AuthController.login(req, res));

};
