const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/authentication')
const router = new express.Router()



router.post('/users', async (req, res) => {
    const me = new User(req.body)

    try{
        await me.save()
        const token = await me.authToken()
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

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(404).send(e)
    }

    // User.findById(_id).then((user) => {
    //     if(!user){
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((e) => {
    //     res.status(404).send(e)
    // })
})

router.patch('/users/:id', async (req, res) => {
    const abc = req.params.id
    const update = ['name', 'email', 'password', 'age']
    const needToUpdate = Object.keys(req.body)
    const match = needToUpdate.every( compare => update.includes(compare))

    if(!match){
        return res.status(404).send({'error': 'Unmatched fields trying to update'})
    }

    try{
        // const user = await User.findByIdAndUpdate(abc, req.body, { new: true, runValidators: true } )

        const user = await User.findById(abc)
        needToUpdate.forEach( (data) => {
            user[data] = req.body[data]
        })
        await user.save()


        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {

    try{
        const a = await User.findByIdAndRemove(req.params.id)
        if(!a){
            return res.status(400).send({error: 'No match found'})
        }
        res.send(a)
    }catch(e){
        res.status(404).send(e)
    }

})


router.post('/users/login', async (req, res) => {

    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.authToken()
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

router.post('/users/logoutAll', auth, async () =>{
    try{
        req.user.tokens = []
        req.user.save()
    }catch(e){
        res.status(500).seend()
    }
})

module.exports = router