import storageService from '../services/storage.service.js';

export const addTodo = async (req, res) => {
    try {
        const body = req.body;
        if (!body || !body.userId) {
            return res.status(400).json({
                success: false,
                message: "Missing required field: userId"
            });
        }

        const noteData = {
            title: body.title !== undefined ? body.title : 'Untitled Note',
            todo: body.todo !== undefined ? body.todo : '',
            userId: body.userId,
            category: body.category || 'General',
            tags: Array.isArray(body.tags) ? body.tags : [],
            isPinned: Boolean(body.isPinned),
            isFavorite: Boolean(body.isFavorite),
            isArchived: Boolean(body.isArchived),
            color: body.color || 'default',
            checklist: Array.isArray(body.checklist) ? body.checklist : []
        };

        const newTodo = await storageService.createNote(noteData);
        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: newTodo
        });
    } catch (error) {
        console.error("Error creating note:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const fetchAll = async (req, res) => {
    try {
        const { search, category, isArchived, isFavorite, userId } = req.query;
        const notes = await storageService.getNotesByUser(userId || 'all', {
            search,
            category,
            isArchived: isArchived !== undefined ? isArchived === 'true' : undefined,
            isFavorite: isFavorite !== undefined ? isFavorite === 'true' : undefined
        });

        return res.status(200).json({
            success: true,
            message: "Successfully fetched notes",
            data: notes
        });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).json({ success: false, message: "Error fetching notes" });
    }
};

export const getByUserId = async (req, res) => {
    const { id, search, category, isArchived, isFavorite } = req.query;
    if (!id) {
        return res.status(400).json({ success: false, message: "Missing userId query param 'id'" });
    }

    try {
        const notes = await storageService.getNotesByUser(id, {
            search,
            category,
            isArchived: isArchived !== undefined ? isArchived === 'true' : undefined,
            isFavorite: isFavorite !== undefined ? isFavorite === 'true' : undefined
        });

        return res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            data: notes
        });
    } catch (error) {
        console.error("Error fetching notes for user:", error);
        return res.status(500).json({ success: false, message: "Notes fetching failed" });
    }
};

export const getTodoById = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await storageService.getNoteById(id);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
        return res.status(200).json({ success: true, data: note });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTodo = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    if (!body || !id) {
        return res.status(400).json({ success: false, message: "Missing payload or id" });
    }

    try {
        const updated = await storageService.updateNote(id, body);
        if (!updated) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            data: updated
        });
    } catch (error) {
        console.error("Error updating note:", error);
        return res.status(500).json({ success: false, message: "Todo update failed" });
    }
};

export const deleteTodo = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: "Invalid id" });
    }

    try {
        const deleted = await storageService.deleteNote(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Note not found or already deleted" });
        }

        return res.status(200).json({
            success: true,
            message: "Todo deleted successfully",
            deletedId: id
        });
    } catch (error) {
        console.error("Error deleting note:", error);
        return res.status(500).json({ success: false, message: "Todo deletion failed" });
    }
};

export const togglePin = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await storageService.getNoteById(id);
        if (!note) return res.status(404).json({ success: false, message: "Note not found" });

        const updated = await storageService.updateNote(id, { isPinned: !note.isPinned });
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleFavorite = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await storageService.getNoteById(id);
        if (!note) return res.status(404).json({ success: false, message: "Note not found" });

        const updated = await storageService.updateNote(id, { isFavorite: !note.isFavorite });
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleArchive = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await storageService.getNoteById(id);
        if (!note) return res.status(404).json({ success: false, message: "Note not found" });

        const updated = await storageService.updateNote(id, { isArchived: !note.isArchived });
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const addUser = async (req, res) => {
    const { sub, name, picture, email, theme } = req.body;
    const userId = sub || req.body.userId;

    if (!userId || !name || !email) {
        return res.status(400).json({ success: false, message: "Missing required user fields (sub/userId, name, email)" });
    }

    try {
        const savedUser = await storageService.upsertUser({ sub: userId, name, picture, email, theme });
        return res.status(200).json({
            success: true,
            message: "User saved successfully",
            user: savedUser
        });
    } catch (error) {
        console.error("DB error in addUser:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserStats = async (req, res) => {
    const { id } = req.query;
    if (!id) return res.status(400).json({ success: false, message: "Missing userId query param 'id'" });

    try {
        const stats = await storageService.getStats(id);
        return res.status(200).json({ success: true, data: stats });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const healthCheck = async (req, res) => {
    const storageMode = storageService.useMongo() ? 'MongoDB Cluster' : 'Local Storage Fallback';
    return res.status(200).json({
        success: true,
        status: 'UP',
        timestamp: new Date().toISOString(),
        storage: storageMode
    });
};