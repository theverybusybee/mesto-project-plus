import Router from 'express';
import {
  createCard,
  deleteCard,
  getCards,
  setLike,
  removeLike,
} from '../controllers/card';
import { cardIdValidator, createCardValidator } from '../utils/validation';

const router = Router();

router.get('/', getCards);
router.post('/', createCardValidator, createCard);
router.delete('/:cardId', cardIdValidator, deleteCard);

router.put('/:cardId/likes', cardIdValidator, setLike);
router.delete('/:cardId/likes', cardIdValidator, removeLike);

export default router;
