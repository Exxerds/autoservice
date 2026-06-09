import { Router } from 'express';
import { createBooking } from '../controllers/bookingsController';

const router = Router();

// Публичный — любой может создать запись с сайта
router.post('/', createBooking);

export default router;