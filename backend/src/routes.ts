import { Router } from 'express';
import { TransactionController } from './controllers/TransactionController';
import { AuthController } from './controllers/AuthController';
import { authMiddleware } from './middlewares/authMiddleware';

export const routes = Router();

const transactionController = new TransactionController();
const authController = new AuthController();

routes.post('/auth/register', authController.register);
routes.post('/auth/login', authController.login);

routes.use(authMiddleware); // Todas as rotas abaixo precisam de token

routes.get('/auth/me', authController.me);

routes.post('/transactions', transactionController.create);
routes.get('/transactions', transactionController.list);
routes.get('/transactions/summary', transactionController.summary);
routes.delete('/transactions/:id', transactionController.delete);
