const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/authentication')
const multer = require('multer')
const router = new express.Router()



router.post('/users', async (req, res) => {
    const me = new User(req.body)

    try{
        await me.save()
        const token = await me.generateNewToken()
        res.status(201).send({me, token})
    } catch(e) {
        res.status(400).send(e)
    }
    

    // me.save().then(() => {
    //     res.status(201).send(me)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.get('/users/me', auth, async (req, res) => {

    res.status(200).send(req.user)
    
})

router.get('/users', async (req, res) => {

    try{
        const users = await User.find()
        res.status(200).send(users)
    }catch(e){
        res.status(500).send(e)
    }

    // User.find({}).then((users) => {
    //     res.status(200).send(users)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })
})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     try{
//         const user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(404).send(e)
//     }

//     // User.findById(_id).then((user) => {
//     //     if(!user){
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(404).send(e)
//     // })
// })


router.post('/users/login', async (req, res) => {

    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateNewToken()
        res.status(200).send({user, token})
    }catch(e){
        res.status(500).send(e)
    }

})

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter( (data) => {
            return data.token !== req.token
        })
        await req.user.save()

        res.send({status: 'User logged out....!'})
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) =>{
    try{
        req.user.tokens = []
        req.user.save()

        res.status(200).send({status: 'Logged out from all devices....!'})
    }catch(e){
        res.status(500).seend()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const update = ['name', 'email', 'password', 'age']
    const needToUpdate = Object.keys(req.body)
    const match = needToUpdate.every( compare => update.includes(compare))

    if(!match){
        return res.status(404).send({'error': 'Unmatched fields trying to update'})
    }

    try{
        // const user = await User.findByIdAndUpdate(abc, req.body, { new: true, runValidators: true } )

        const user = await req.user
        needToUpdate.forEach( (data) => {
            user[data] = req.body[data]
        })
        await user.save()

        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {

    try{
       const user = await req.user.remove()
       res.send(user)
    }catch(e){
        res.status(404).send(e)
    }

})

const upload = multer({
    limits: {
        fileSize: 7000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File must be an Image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send({status: 'File uploaded successfully'})    
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {

    req.user.avatar = undefined
    await req.user.save()
    res.send({status: 'Image deleted successfully'})
})

router.get('/users/:id/avatar', async (req, res) => {

    const user = await User.findById(req.params.id)
    try{
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg').send(user.avatar)
        

    }catch(e){
        res.send(404)
    }
})

module.exports = router