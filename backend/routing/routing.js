import { Router } from "express";
import { addTodo, fetchAll, updateTodo, deleteTodo, addUser, getByUserId } from '../controller/controller.js';

const router = Router();

// add a todo
router.post('/', addTodo);

// send all the saved todos
router.get('/', fetchAll);

// update a todo
router.put('/:id', updateTodo);

// delete a todo
router.delete('/:id', deleteTodo);

// add a user
router.post('/login', addUser);

// get note by user id
router.get('/user', getByUserId);


export default router;