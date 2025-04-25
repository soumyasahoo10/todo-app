import { Router } from "express";
import { addTodo, fetchAll, updateTodo, deleteTodo } from '../controller/controller.js';

const router = Router();

// add a todo
router.post('/', addTodo);

// send all the saved todos
router.get('/', fetchAll);

// update a todo
router.put('/:id', updateTodo);

// delete a todo
router.delete('/:id', deleteTodo);

export default router;