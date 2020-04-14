// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const objectId = mongodb.ObjectID
const {MongoClient, ObjectID} = require('mongodb')

const url = 'mongodb://localhost:27017'
const databaseName = 'task-manager'

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if(error){
        return console.log('Something Went Wrong')
    }
    console.log('Connected to MongoDB')

    const db = client.db(databaseName)

    // const id = new ObjectID()
    // console.log(id.id.length)
    // console.log(id.toHexString().length)



    // db.collection('users').insertOne({
    //     name: 'vinay kotha',
    //     age: 23
    // })

    // db.collection('users').insertMany([{
    //     name: 'Indire',
    //     age: 45
    // },{
    //     name: 'Sudhakae',
    //     age: 51
    // }
    // ], (error, result) => {
    //     if(error){
    //         return console.log('unable t oinsert data')
    //     }
    //     console.log(result.ops)
    // })


    // db.collection('users').findOne( { _id: new ObjectID("5e8ceee021aba23b30eae15d")}, (error, result) => {
    //     if(error){
    //         return console.log('No data found')
    //     }
    //     console.log(result)
    // })

    // db.collection('users').find({name: 'vinay kotha'}).toArray((err, user) => {
    //     console.log(user)
    // })
    // db.collection('users').find({name: 'vinay kotha'}).count().then((result) => {
    //     console.log(result)
    // }).catch(() => {
    //     console.log('Unable to count the data')
    // })
    
    // db.collection('users').updateOne({
    //     _id: new ObjectID("5e8e24863d47554224b8757f")
    // }, {
    //     $set: {
    //         name: 'vinay kotha',
    //         age: 26
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })


    // db.collection('users').updateOne({
    //     _id: new ObjectID('5e8e24863d47554224b8757f')
    // }, {
    //     $inc: {
    //         age: 2
    //     } 
    // })

    // db.collection('tasks').insertMany([{
    //     description: 'Cleaning bathroom',
    //     status: false
    // }, {
    //     description: 'House keepinf',
    //     status: false
    // }, {
    //     description: 'Studying',
    //     status: true
    // }])


    // db.collection('tasks').updateMany({
    //     status: false
    // }, {
    //     $set :{
    //         status: true
    //     }
    // }).then((s) => {
    //     console.log(s)
    // }).catch((e) => {
    //     console.log(e)
    // })

    db.collection('tasks').deleteOne({
        status: true
    }).then((s) => {
            console.log(s)
        }).catch((e) => {
            console.log(e)
        })





})