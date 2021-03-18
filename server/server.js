const express = require('express');
const morgan = require('morgan');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const TeacherExamsView = require('./TeacherExamsView');
const myDAO = require('./myDAO');
const UserDao = require('./UserLoginDao');

//todo use your key here!!!
const mykey = require('./key');

const jwtSecret = mykey;
const expireTime = 600;

const PORT = 3001;
const app = express();
const authErrorObj = { errors: [{  'param': 'Server', 'msg': 'Authorization error' }] };



app.use(morgan('combined'));
app.use(express.json());


const BASEURI = '/api' ;


app.post(BASEURI+'/teacher-login', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    UserDao.getTeacher(username)
        .then((teacher) => {
            console.log("in then login teacher");
            if(teacher === undefined) {
                res.status(404).send({
                    errors: [{ 'param': 'Server', 'msg': 'Invalid username' }]
                });
            } else {
                if(!UserDao.checkPassword(teacher, password)){
                    res.status(401).send({
                        errors: [{ 'param': 'Server', 'msg': 'Invalid password' }]
                    });
                } else {
                    //AUTHENTICATION SUCCESS
                    const token = jsonwebtoken.sign({ username: teacher.username,course:teacher.cid,mode:0}, jwtSecret, {expiresIn: expireTime});
                    res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                    res.json({username: teacher.username, course:teacher.cid,mode:0});
                }
            }
        }).catch(

        /*
        (err) => {
            new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(404).json(authErrorObj))
        }

         */
    );
});
app.post(BASEURI+'/student-login/', (req, res) => {

    const username = req.body.username;

    UserDao.checkStudent(username)
        .then((user) => {
            if (user === undefined) {
                res.status(404).send({
                    errors: [{ 'param': 'Server', 'msg': 'Invalid student id' }]
                });
            } else {
                console.log(user);
                res.json(user);
            }
        }).catch(
        /*
        (err) => {
            new Promise((resolve) => {
                setTimeout(resolve, 1000)
            }).then(() => res.status(401).json(err))
        }

         */
    );
});

app.use(cookieParser());

app.post(BASEURI+'/logout', (req, res) => {
    res.clearCookie('token').end();
});


// STUDENT API START
/**
 *Get exams
 */
app.get(BASEURI+'/student/exams/:userid', (req, res)=> {
        myDAO.getExams(1,req.params.userid).then((exams) => res.json(exams))
            .catch((err) => {
                console.log(err);
                res.status(401).json({
                    errors: [{'msg': err}],
                });
            });
});

/**
 *Get exam
 */
app.get(BASEURI+'/student/exam/:examid', (req, res)=> {
    myDAO.getExam(1,0,req.params.examid).then((exam) => res.json(exam))
        .catch((err) => {
            console.log(err);
            res.status(401).json({
                errors: [{'msg': err}],
            });
        });
});
/**
 *book or delete
 */
app.put(BASEURI+'/student/exam/booking', (req, res)=>{
    if(!req.body){
        res.status(401).end();
    } else {
        const myBooking = req.body;
        myDAO.bookSlot(myBooking)
            .then((result) => res.status(200).end())
            .catch((err) => res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            }));
    }
});

// STUDENT API EN









//AUTHENTICATION AND TEACHER API START
app.use(jwt({secret: jwtSecret, getToken: req => req.cookies.token,algorithms:['HS256']}));
// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authErrorObj);
    }
});




app.get(BASEURI+'/teacher', (req,res) => {
    const username = req.user && req.user.username;
    UserDao.getTeacherByUsername(username).then((teacher) => {res.json({username: teacher.username, course: teacher.cid,mode:0});})
        .catch((err) => {
            res.status(401).json(authErrorObj);
        });
});
/**
 *Get exams
 */
app.get(BASEURI+'/Teacher/exams', (req, res)=> {
    const user = req.user && req.user.username;
    myDAO.getExams(0,user).then((exams) => res.json(exams))
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                errors: [{'msg': err}],
            });
        });

});

/**
 *Get exam
 */
app.get(BASEURI+'/Teacher/exam/:examid', (req, res)=> {
    myDAO.getExam(0, 0, req.params.examid).then((exam) => {
        console.log(exam);
        res.json(exam)

        }
    ).catch((err) => {
            console.log(err);
            res.status(500).json({
                errors: [{'msg': err}],
            });
        });
});
/**
 *mark a student
 */
app.put(BASEURI+'/Teacher/exam/marking', (req, res)=>{
    if(!req.body){
        res.status(400).end();
    } else {
        const cid = req.user && req.user.course;
        const mark = req.body;
        myDAO.registerMark(mark)
            .then((result) => res.status(200).end())
            .catch((err) => res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            }));
    }
});
/**
 *Get students of course
 */
app.get(BASEURI+'/Teacher/course-students', (req, res)=> {
    const course = req.user && req.user.course;

    console.log(course);
    myDAO.getStudentList(course).then((students) => res.json(students))
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                errors: [{'msg': err}],
            });
        });
});
/**
 *create exam
 */
app.post(BASEURI+'/Teacher/exam', (req, res)=>{
    if(!req.body){
        res.status(400).end();
    } else {
        const cid = req.user && req.user.course;
        const tid = req.user && req.user.username;
        const exam = req.body;
        myDAO.createExam(exam,cid,tid).then((id) => res.json({id: id})).catch((err) => {
            console.log(err);
            res.status(500).json({errors: [{'param': 'Server', 'msg': err}],
            })
        });
    }
});



app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

