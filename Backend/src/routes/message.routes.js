import {Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';
import { createMessage, getAllMessages } from '../controllers/message.controllers.js';



const router = Router();

router.get("/:conversationId", isLoggedIn , getAllMessages)
router.post("/:conversationId",isLoggedIn, createMessage )





export default router;