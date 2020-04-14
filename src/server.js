const express = require('express')
require('./db/mongoose')
const userRouter = require('../src/router/user')
const taskRouter = require('../src/router/task')

const app = express()
const PORT = process.env.PORT || 3000

// app.use( (req, res, next) => {

//     console.log(req.path, req.method)
//     if(req.method == 'GET'){
//         return res.send('Site is in maintainance mode. No data can be retrived...!')
//     }

    
// })

app.use(express.json())

app.use(userRouter, taskRouter)






app.listen(PORT, () => {
    console.log('Server is started @ 3000')
})