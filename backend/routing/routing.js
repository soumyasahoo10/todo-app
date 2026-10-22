import { Router } from "express";
import {
    addTodo,
    fetchAll,
    updateTodo,
    deleteTodo,
    addUser,
    getByUserId,
    getTodoById,
    togglePin,
    toggleFavorite,
    toggleArchive,
    getUserStats,
    healthCheck
} from '../controller/controller.js';

const router = Router();

// Healthcheck
router.get('/health', healthCheck);

// Stats
router.get('/stats', getUserStats);

// User auth/upsert
router.post('/login', addUser);

// Get notes by user id
router.get('/user', getByUserId);

// Note CRUD routes
router.get('/', fetchAll);
router.post('/', addTodo);
router.post('/todos', addTodo);

router.get('/:id', getTodoById);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

// Quick toggle actions
router.patch('/:id/pin', togglePin);
router.patch('/:id/favorite', toggleFavorite);
router.patch('/:id/archive', toggleArchive);

export default router;