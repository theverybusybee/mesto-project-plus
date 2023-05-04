import { createCard, deleteCard, getCards, setLike, removeLike } from "../controllers/card";
import Router from "express";

const router = Router();

router.get("/cards", getCards);

router.post("/cards", createCard);

router.delete("/cards/:cardId", deleteCard);

router.put("/cards/:cardId/likes", setLike)
router.delete("/cards/:cardId/likes", removeLike);

export default router;
