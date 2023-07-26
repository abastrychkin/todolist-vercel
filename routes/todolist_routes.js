
var ObjectId = require('mongodb').ObjectId; 

const NOT_FOUND = { message:"NOT_FOUND" }

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
        let task = NOT_FOUND;
        let objectTaskId = 0;
        try{
            objectTaskId = new ObjectId(taskId);
            task = await getTaskById(tasksDbCollection, objectTaskId);
            console.log(task)
        } catch {

        }

        
        if (task != NOT_FOUND) {
            const newDoneValue = !task.done;

            await tasksDbCollection.updateOne(
                { "_id" : task._id },
                { $set: { "done" : newDoneValue } 
            });
            
            let changedTask = await getTaskById(tasksDbCollection, objectTaskId);
            
            res.send(changedTask);
        } else {
            res.send(task);
        }
    })

};

async function getTaskById(tasksDbCollection, objectTaskId) {
    try {
        let task = await tasksDbCollection.findOne({ _id: objectTaskId });
        return task ? task : NOT_FOUND;
    } catch (err) {
        console.log(err);
    }
}
