import Todo from '../model/todo.model.js'
import User from '../model/user.model.js';


export const addTodo = async(req, res) => {
    const todo = req.body;
    if (!todo || !todo.title || !todo.todo || !todo.userId) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: title, todo, or userId"
        });
    }
    // if (!todo){
    //     return res.status(500).json({success: false, message: "no payload found"})
    // }
    try {
        const newTodo = new Todo(todo);
        // console.log(newTodo);
        await newTodo.save();
        res.status(200).json({success: true, message: "todo saved to db", data: todo})
    } catch (error) {
        console.error("Error uploading payload", error)
        return res.status(500).json({success: false, message: error})
    }
};


export const fetchAll = async(req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json({data: todos, success:true, message:"successfully fetched todos"})
    } catch (error) {
        res.status(500).json({success:false, message: "error fetching todos"})        
    }
};


export const updateTodo = async (req, res) => {
    const {id} = req.params;
    const body = req.body;
    if(!body || !id){
        return res.status(500).json({success: false, message: "no payload found"})
    }

    try {
        await Todo.findByIdAndUpdate(id, {...body});
        res.status(200).json({success: true, message: "Todo updated successfully"})
    } catch (error) {
        res.status(500).json({success: false, message: "Todo update failed"})
    }
};


export const deleteTodo = async (req, res) => {
    const {id} = req.params;
    if(!id){
        return res.status(500).json({success: false, message: "invalid id"})
    }

    try {
        await Todo.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Todo deleted successfully"})
    } catch (error) {
        res.status(500).json({success: false, message: "Todo deletion failed"})
    }
};


export const addUser = async (req, res) => {
  const { sub, name, picture, email } = req.body;

  if (!sub || !name || !picture || !email) {
    console.log("Missing fields:", req.body);
    return res.status(400).json({ message: "Missing user data" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
        { userId: sub },
        { userId: sub, name, picture, email },
        { new: true, upsert: true }
    );
    console.log("Saved user:", updatedUser); // ✅ Add this
    res.status(200).json({ success: true, message: "User added successfully", user: updatedUser });
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




export const getByUserId = async (req, res) => {
    const { id } = req.params;
    
    try {
        const data = await Todo.find({userId: id});
        res.status(200).json({success: true, message: "Notes fetched successfully", data})
    }
    catch (error) {
        res.status(500).json({success: false, message: "Notes fetching failed"})
    }
};