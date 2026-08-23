import { Router } from 'express';
import { getMenu, getDish, getCategories } from '../controllers/menu.controller.js';

const router = Router();

router.get('/menu', getMenu);
router.get('/menu/:idOrSlug', getDish);
router.get('/categories', getCategories);

export default router;
