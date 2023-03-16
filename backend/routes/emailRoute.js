import express from 'express';
import {sendEmail} from '../controllers/emailController.js'
import authMiddleware from '../middlewares/auth/authMiddleware.js';

const emailRoute = express.Router();

emailRoute.post('/', authMiddleware, sendEmail);

export default emailRoute;