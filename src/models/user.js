const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        default: 'xoxo',
        maxlength: 20
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0){
                throw new Error('Age must greater then zero')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error('Invalid Email id')
            }
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('the text do not contain PASSWOED word')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
    const user = this

    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateNewToken = async function () {
    const user = this

    const token = await jwt.sign({ _id: user._id.toString()}, 'killany1')

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( {email} )
    if(!user){
        return new Error('Email id not found')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        return new Error('Unable to login')
    }

    return user

}


userSchema.pre('save', async function() {
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
        console.log('Hassing......!')
    }
})

userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({owner: user._id})

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User