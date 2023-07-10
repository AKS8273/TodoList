const mongoose = require('mongoose')


const todoSchema = new mongoose.Schema({
    title: { type: String },
    note: { type: String },
    Note_id:{type:String}
})

// const todoList = mongoose.model('todoList', todoSchema);
// module.exports = todoList;
module.exports = todoSchema;