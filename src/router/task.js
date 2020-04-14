const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try{
        await task.save()
        res.send(task)
    }catch(e){
        res.status(404).send(e)
    }

    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.get('/tasks', async (req, res) => {

    try{
        const task = await Task.find()
        res.send(task)
    }catch(e) {
        res.status(500).send(e)
    }

    // Task.find().then((task) => {
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try{
        const a = await Task.findById(_id)
        if(!a){
            return res.status(500).send()
        }
        res.send(a)
    }catch(e){
        res.status(404).send(e)
    }

    // Task.findById(_id).then((task) => {
    //     if(!task){
    //         return res.status(500).send()
    //     }
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(404).send(e)
    // })
})

router.patch('/tasks/:id', async (req, res) => {
    const update = ['description', 'completed']
    const haveToUpdate = Object.keys(req.body)
    const data = haveToUpdate.every( a  => update.includes(a) )

    if(!data){
        return res.status(404).send({error: 'It is not valid operation'})
    }

    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {

    const a = await Task.findByIdAndDelete(req.params.id)
    try{
        if(!a){
            return res.status(404).send({error: 'No match found'})
        }
        res.send(a)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router;