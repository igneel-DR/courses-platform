
const express = require('express');
const router = express.Router();
const TeacherModel = require('../Model/TeacherModel')
const axios = require("axios")
const {verifyToken} = require('../Middleware/Auth')


router.get("/all", verifyToken, async(req, res)=>{
    try{
        const Teachers = await TeacherModel.find({})
        res.status(200).json(Teachers)
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.post("/add", verifyToken, async(req, res)=>{
    try{
        const newTeacher = new TeacherModel(req.body)
        const teacher = await newTeacher.save();
        res.json(teacher) 
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.post("/assign/:professeur_id/:cours_id", verifyToken, async(req, res)=>{
    try{
        const fetchCourses = await axios.get(`http://localhost:3001/course/search/${req.params.cours_id}`,{
            headers: { 
                'Authorization': req.headers['authorization'] 
            }
        });
        const course = fetchCourses.data;
        if (!course){
            return res.json({message: "Cours not found"}) 
        }

        const Teacher = await TeacherModel.find({id: req.params.professeur_id})
        if (!Teacher){
            return res.json({message: "Teacher not found"}) 
        }

        const CheckTeacherCourse = await TeacherModel.find({cours : {$in: [course.id]}});

        if (CheckTeacherCourse[0]){
            return res.json({message: "course Already exist "}) 
        }

        const updateTeacher = await TeacherModel.updateOne({ id: req.params.professeur_id }, { $push: { cours: req.params.cours_id } });
   
        res.json(updateTeacher) 
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get("/enrolledStudents/:cours_id", verifyToken, async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3002/student/all', {
            headers: { 
                'Authorization': req.headers['authorization']
            }
        });
        const allStudents = response.data;
        const enrolledStudents = allStudents.filter(student => student.cours && student.cours.includes(req.params.cours_id) );
        res.status(200).json(enrolledStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;