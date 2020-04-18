const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/authentication')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(404).send(e)
    }

    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

// GET tasks/me?completed=true/false/none
// GET tasks/me?limit=5&skip=2
// GET tasks/me?sortBy=createdAt_asc/_desc
router.get('/tasks/me',auth,  async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }


    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    try{
        // const task = await Task.find({owner: req.user._id})

        // await req.user.populate('tasks').execPopulate()
        

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(req.user.tasks)
    }catch(e) {
        res.status(500).send(e)
    }

    // Task.find().then((task) => {
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })
})

router.get('/tasks/me/:id', auth, async (req, res) => {
    const _id = req.params.id

    try{
        // const a = await Task.findById(_id)
        const a = await Task.findOne({_id, owner: req.user._id})
        await a.populate('owner').execPopulate()
        if(!a){
            return res.status(404).send({Error: 'Task not found by the ID'})
        }
        res.send(a)
    }catch(e){
        res.status(500).send(e)
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

router.patch('/tasks/me/:id', auth, async (req, res) => {
    const update = ['description', 'completed']
    const haveToUpdate = Object.keys(req.body)
    const data = haveToUpdate.every( a  => update.includes(a) )
    if(!data){
        return res.status(404).send({error: 'It is not valid operation'})
    }

    try{
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send({Error: 'No task associated with the ID'})
        }

        haveToUpdate.forEach( a => task[a] = req.body[a])
        await task.save()

        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/tasks/me/:id', auth, async (req, res) => {

    // const a = await Task.findByIdAndDelete(req.params.id)
    const a = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
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