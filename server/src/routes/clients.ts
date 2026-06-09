import { Router } from 'express';
import { registerClient, loginClient, getMyProfile } from '../controllers/clientsController';
import { getMyBookings } from '../controllers/bookingsController';
import { clientAuthMiddleware } from '../middleware/clientAuth';

const router = Router();

router.post('/register', registerClient);
router.post('/login', loginClient);
router.get('/me', clientAuthMiddleware, getMyProfile);
router.get('/me/bookings', clientAuthMiddleware, getMyBookings);

export default router;