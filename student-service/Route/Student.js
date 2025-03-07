
const express = require('express');
const router = express.Router();
const StudentModel = require('../Model/StudentModel')
const axios = require("axios")
const {verifyToken} = require('../Middleware/Auth')

function findDeletedCourses(existingIds, enrolledIds) {
    return enrolledIds.filter(id => !existingIds.includes(id));
}

router.get("/all", verifyToken, async(req, res)=>{
    try{
        const Students = await StudentModel.find({})
        res.status(200).json(Students)
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.post("/add", verifyToken, async(req, res)=>{
    try{
        const newStudent = new StudentModel(req.body)
        const student = await newStudent.save();
        res.json(student) 
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.post("/enroll/:etudiant_id/:cours_id", verifyToken, async(req, res)=>{
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

        const Student = await StudentModel.find({id: req.params.etudiant_id})
        if (!Student){
            return res.json({message: "student not found"}) 
        }

        const CheckStudentCourse = await StudentModel.find({cours : {$in: [course.id]}});

        if (CheckStudentCourse[0]){
            return res.json({message: "course Already exist "}) 
        }

        const updateStudent = await StudentModel.updateOne({ id: req.params.etudiant_id }, { $push: { cours: req.params.cours_id } });
   
        res.json(updateStudent) 
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get("/enrolledCourses/:etudiant_id", verifyToken, async (req, res) => {
    try {
        const student = await StudentModel.findOne({ id: req.params.etudiant_id });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const enrolledCourseIds = student.cours; // student courses ids

        const fetchCourses = await axios.get('http://localhost:3001/course/all',{
            headers: { 
                'Authorization': req.headers['authorization'] 
            }
        });

        const allCourses = fetchCourses.data;
        const existingCourseIds = allCourses.map(course => course.id); // course ids

        const deletedCourses = findDeletedCourses(existingCourseIds, enrolledCourseIds);
        if(deletedCourses){
            await StudentModel.updateOne({ id: req.params.etudiant_id }, { $pull: { cours: { $in: deletedCourses } } });
        } 

        const studentCourses = allCourses.filter(course => enrolledCourseIds.includes(course.id));

        res.status(200).json(studentCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;