const express = require('express');
const mongo = require('mongodb');
const cors = require('cors');
const { response } = require('express');
require('dotenv').config();
const app = express();
const mongoClient = mongo.MongoClient;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME;
const port = process.env.PORT || 3000;
const objID = mongo.ObjectID;

app.use(express.json());
app.use(cors());

app.get("/students", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let data = await db.collection('students').find().toArray();
        res.status(200).json({
            data,
            items: data.length
        });
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

app.post("/student/create", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        req.body.is_assign = false;
        let data = await db.collection('students').insertOne(req.body);
        res.status(200).json({
            "success": "student created"
        });
        clientInfo.close();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get("/student/:id", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let data = await db.collection('students').findOne({
            _id: objID(req.params.id)
        });
        res.status(200).json({
            data,
            items: data.length
        });
        clientInfo.close();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.put("/student/edit/:id", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        await db.collection('students').updateOne({
            _id: objID(req.params.id)
        }, {
            $set: req.body
        });
        res.status(200).json({
            "success": "Student details updated"
        });
        clientInfo.close();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.delete("/student/:id", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        await db.collection('students').deleteOne({
            _id: objID(req.params.id)
        });
        res.status(200).json({
            "success": "Student deleted"
        });
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});


app.get("/mentors", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let data = await db.collection('mentors').find().toArray();
        res.status(200).json({
            data,
            items: data.length
        });
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

app.post("/mentor/create", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let data = await db.collection('mentors').insertOne(req.body);
        res.status(200).json({
            "success": "mentor created"
        });
        clientInfo.close();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get("/mentor/:id", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let data = await db.collection('mentors').findOne({
            _id: objID(req.params.id)
        });
        res.status(200).json({
            data,
            items: data.length
        });
        clientInfo.close();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.put("/mentor/edit/:id", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        await db.collection('mentors').updateOne({
            _id: objID(req.params.id)
        }, {
            $set: req.body
        });
        res.status(200).json({
            "success": "mentor details updated"
        });
        clientInfo.close();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.delete("/mentor/:id", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        await db.collection('mentors').deleteOne({
            _id: objID(req.params.id)
        });
        res.status(200).json({
            "success": "mentor deleted"
        });
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});


app.get("/assign/view/students", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let data = await db.collection('students').find({
            is_assign: false
        }).toArray();
        res.status(200).json({
            data,
            items: data.length
        });
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

app.post("/assign/students", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let students_id = [];
        await req.body.students.forEach(async (ele) => {
            students_id.push(objID(ele));
            await db.collection('students').findOneAndUpdate({
                _id: objID(ele)
            }, {
                $set: {
                    mentor_id: objID(req.body.mentorId),
                    is_assign: true
                }
            });
        });
        await db.collection('mentors').findOneAndUpdate({
            _id: objID(req.body.mentorId)
        }, {
            $set: {
                students: students_id
            }
        });
        res.status(200).json({
            status: "success",
            message: "Students got assigned successfully"
        });
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

app.get("/assign/mentor/students/:id", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let data = await db.collection('mentors').aggregate([{
            '$lookup': {
                'from': 'students',
                'localField': 'students',
                'foreignField': '_id',
                'as': 'results'
            }
        }, {
            '$project': {
                'results.name': 1
            }
        }, {
            '$match': {
                '_id': objID(req.params.id)
            }
        }]).toArray();
        if (data[0]['results'].length > 0) {
            res.status(200).json({
                status: "success",
                data,
                items: data.length
            });
        } else {
            res.status(200).json({
                status: "failed",
                message: "No students under you"
            })
        }
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

app.delete("/assign/mentor/remove/:id", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let mentorID = await db.collection('students').aggregate([{
            '$match': {
                '_id': objID(req.params.id)
            }
        }, {
            '$project': {
                'mentor_id': 1
            }
        }]).toArray();
        if (mentorID[0]['mentor_id']) {
            await db.collection('students').findOneAndUpdate({
                _id: objID(req.params.id)
            }, {
                $set: {
                    is_assign: false,
                    mentor_id: ''
                }
            });

            let studentsID = await db.collection('mentors').aggregate([{
                '$match': {
                    '_id': objID(mentorID[0]['mentor_id'])
                }
            }, {
                '$project': {
                    'students': 1
                }
            }]).toArray();

            studentsID = studentsID[0]['students'];

            studentsID = studentsID.filter(obj => obj != req.params.id);

            await db.collection('mentors').findOneAndUpdate({
                '_id': objID(mentorID[0]['mentor_id'])
            }, {
                $set: {
                    students: studentsID
                }
            })


            res.status(200).json({
                status: "success",
                message: "mentor removed successfully"
            })
        } else {
            res.status(200).json({
                status: "failed",
                message: "No mentor for you"
            })
        }
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

app.get("/assign/mentor/:id", async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db(dbName);
        let data = await db.collection('students').aggregate([{
            '$lookup': {
                'from': 'mentors',
                'localField': 'mentor_id',
                'foreignField': '_id',
                'as': 'results'
            }
        }, {
            '$project': {
                'results.name': 1
            }
        }, {
            '$match': {
                '_id': objID(req.params.id)
            }
        }]).toArray();
        if (data[0]['results'].length > 0) {
            res.status(200).json({
                status: "success",
                data,
                items: data.length
            });
        } else {
            res.status(200).json({
                status: "failed",
                message: "No mentor assigned to you"
            })
        }
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

app.listen(port, () => {
    console.log(`app listening at https://localhost:${port}/`)
})
