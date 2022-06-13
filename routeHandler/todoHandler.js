const express = require('express');
const mongoose = require('mongoose');
const todoSchema = require('../schemas/todoSchema');
const userSchema = require('../schemas/userSchema');
const authCheck = require('../middleware/auth');

const router = express.Router();
const Todo = new mongoose.model('Todo', todoSchema);
const User = new mongoose.model('User', userSchema);

router.get('/', authCheck, async (req, res) => {
    try {
        const data = await Todo.find().select({ _id: 0 }).populate('user', '-_id');
        res.status(200).json({
            result: data,
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
router.get('/active', async (req, res) => {
    try {
        const todo = new Todo();
        const data = await todo.findActive();
        res.status(200).json({
            data,
        });
    } catch (err) {
        res.status(500).json({ error: err });
        console.log(err);
    }
});
router.get('/active-statics', async (req, res) => {
    try {
        const data = await Todo.findActive();
        res.status(200).json({
            data,
        });
    } catch (err) {
        res.status(500).json({ error: err });
        console.log(err);
    }
});
router.get('/query', async (req, res) => {
    try {
        const data = await Todo.find().byQuery(false);
        res.status(200).json({
            data,
        });
    } catch (err) {
        res.status(500).json({ error: err });
        console.log(err);
    }
});
router.get('/:id', async (req, res) => {
    try {
        const data = await Todo.find({ _id: req.params.id }).select({ _id: 0 });
        res.status(200).json({
            result: data,
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
router.post('/', authCheck, async (req, res) => {
    try {
        const todo = await Todo.create({ ...req.body, user: req.userId });
        await User.updateOne({ _id: req.userId }, { $push: { todos: todo._id } });
        res.status(200).json({
            message: 'Todo insert successfully',
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
router.post('/all', async (req, res) => {
    try {
        await Todo.create(req.body);
        res.status(200).json({
            message: 'Todo insert successfully',
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
router.put('/:id', async (req, res) => {
    try {
        await Todo.updateOne({ _id: req.params.id }, { $set: { status: 'false' } });
        res.status(200).json({
            message: 'Todo update successfully',
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const data = await Todo.deleteOne({ _id: req.params.id });
        if (data.deletedCount > 0) {
            res.status(200).json({
                message: 'Todo delete successfully',
            });
        } else {
            throw new Error('Todo was not delete');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
