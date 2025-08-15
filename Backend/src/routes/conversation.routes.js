import {Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';
import { createConversation, deleteConversation, getAllConversations } from '../controllers/conversation.controllers.js';


const router = Router();

router.get("/:persona", isLoggedIn , getAllConversations)
router.post("/",isLoggedIn, createConversation )
router.delete("/:id", isLoggedIn, deleteConversation)




export default router;