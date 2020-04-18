const express = require('express')
require('./db/mongoose')
const userRouter = require('../src/router/user')
const taskRouter = require('../src/router/task')
const path = require('path')
// require('dotenv').config({path : path.join(__dirname,'../config/dev.env')}) // Alternate for configuting .env file


const app = express()
const PORT = process.env.PORT

// app.use( (req, res, next) => {

//     console.log(req.path, req.method)
//     if(req.method == 'GET'){
//         return res.send('Site is in maintainance mode. No data can be retrived...!')
//     }

    
// })

app.use(express.json())

app.use(userRouter, taskRouter)

// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 7000000,
//     },
//     fileFilter(req, file, cb){

//         // if(!file.originalname.endsWith(.pdf))
//         if(!file.originalname.match(/\.(jpg|jpeg\png)$/)){
//             return cb(new Error('File must be Image'))
//         }
//         cb(undefined, true)
//         // cb(new Error('File must be a PDF'))
//         // cb(undefined, true)
//         // cb(undefined, false)
//     }
// })
// app.post('/upload', upload.single('upload'), async (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({error: error.message})
// })



// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async () => {
//     // const task = await Task.findById('5e964d4f7866bc27c89dc446')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     const user = await User.findById('5e964c3b79f9f43bd839463e')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)

// }

// main()




app.listen(PORT, () => {
    console.log(`Server is started @ ${PORT}`)
})