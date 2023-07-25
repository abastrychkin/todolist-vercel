
var ObjectId = require('mongodb').ObjectId; 

module.exports = function(app, db) {

    const tasksDbCollection = db.collection("tasks");

    app.get('/todolist-server/all', async (req, res) => {
        let dbTasks = await tasksDbCollection.find({}).toArray();
        res.send(dbTasks);
    });

    app.post('/todolist-server/add',async (req, res) => {
        elem = req.fields;
        elem.done = false

        await tasksDbCollection.insertOne(elem);

        res.send("OK")
    })

    app.post('/todolist-server/:taskId/toggle-done', async (req, res) => {
        const taskId = req.params.taskId;
        const objectTaskId = new ObjectId(taskId);

        let task = await getTaskById(tasksDbCollection, objectTaskId);
    
        const newDoneValue = !task.done;

        await tasksDbCollection.updateOne(
            { "_id" : task._id },
            { $set: { "done" : newDoneValue } 
        });
        
        let changedTask = await getTaskById(tasksDbCollection, objectTaskId);
        
        res.send(changedTask);
    })

};

async function getTaskById(tasksDbCollection, objectTaskId) {
    let taskArray = await tasksDbCollection.find({ "_id": objectTaskId }).toArray();
    let task = taskArray[0];
    return task;
}
