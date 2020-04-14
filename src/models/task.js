const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    description: {
        type: String,
        require: true,
        maxlength: 50
    },
    completed: {
        type: Boolean,
        default: false
    }
})


const Task = mongoose.model('Tasks', taskSchema)

module.exports = Task