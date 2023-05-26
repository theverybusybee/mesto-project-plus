import {
  createCard,
  deleteCard,
  getCards,
  setLike,
  removeLike,
} from "../controllers/card";
import Router from "express";

const router = Router();

router.get("/", getCards);

router.post("/", createCard);

router.delete("/:cardId", deleteCard);

router.put("/:cardId/likes", setLike);
router.delete("/:cardId/likes", removeLike);

export default router;
