'use strict';

// DAO module for accessing Slots
// Data Access Object
const db = require('./db');
const Slot = require('./Slot');
const Session = require('./Session');


const Student = require('./Student');
const StudentExamsView = require('./StudentExamsView');
const StudentExamView = require('./StudentExamView');
const TeacherExamsView = require('./TeacherExamsView');
const TeacherExamView = require('./TeacherExamView');


const createStudentExams = function (row){
    return new StudentExamsView(row.id,row.sid,row.eid,row.score,row.date,row.time,row.ename,row.slotID,row.sname);
};
const createStudentExam = function (row,sessions){
    return new StudentExamView(row.id,row.cid,row.tid,row.name,row.sduration,row.sDate,row.eDate,row.numOfStudents,sessions);
};
const createTeacherExams = function (row){
    return new TeacherExamsView(row.id,row.name,row.numOfStudents,row.sDate,row.eDate,row.tid,row.sduration,row.cid);
};
const createTeacherExam = function (row,sessions,students){
    return new TeacherExamView(row.id,row.cid,row.tid,row.name,row.sduration,row.sDate,row.eDate,row.numOfStudents,sessions,students);
};



const createSlot = function (row,mode) {
    const name = row.name === null ? "Free Slot": mode === 0 ?row.name: "Already booked";
    const sid = row.sid === null ? -1 : mode === 0 ? row.sid : 0;
    const score = mode === 0 ? row.score :0;
    return new Slot(row.id,row.esid,row.sessionid,sid,name,row.sNumber,score);
};
const createSession = function (row,slots) {
    return new Session(row.id,row.sdate,row.startTime,row.duration,row.eid,row.sorder,slots);
};
const createStudent = function (row) {
    return new Student(row.sid,row.sname);
}


/**

*/
exports.createExam = function (exam,cid,tid){
    return new Promise((resolve,reject) => {

        let sql = 'INSERT INTO exams(name,sduration,numOfStudents,sDate,eDate,cid,tid) VALUES (?,?,?,?,?,?,?)';
        db.run(sql, [exam.name,exam.sduration,exam.numofStudents,exam.sdate,exam.edate,cid,tid], function (err) {
            if (err) {
                console.log(`error in createExam ${err}`);
                reject(err);
            }
            const promises = [];
            promises.push(createSessions(this.lastID,exam.sessions),createExamForStudents(this.lastID,exam.name,exam.students));
            Promise.all(promises).then(()=>resolve()).catch((err)=>reject(err));

            // resolve('success inserting');
        });
    })
};
function createSessions(examID,sessions){
    console.log(sessions);

    return new Promise((resolve,reject) => {
        let values = `("${sessions[0].date}","${sessions[0].time}","${sessions[0].duration}",${examID},0)`;
        for(let i=1;i<sessions.length;i++)values = values.concat(`,("${sessions[i].date}","${sessions[i].time}","${sessions[i].duration}",${examID},${i})`);
        let sql = 'INSERT INTO sessions(sdate,startTime,duration,eid,sorder) VALUES';
        sql = sql.concat(values);
        console.log(sql)
        db.run(sql, function (err,rows) {
            if (err) {
                console.log(`error in createSessions ${err}`);
                reject(err);
            }

            let sql2 = 'SELECT id id,duration duration FROM sessions WHERE eid=?'
            db.all(sql2,[examID],function (err,rows){
                if (err) {
                    console.log(`error in createSessions ${err}`);
                    reject(err);
                }
                let promises = [];
                rows.forEach((session)=>{
                    let promise = createSlots(session.id,session.duration);
                    promises.push(promise);
                })
               Promise.all(promises).then(results =>{
                   resolve();
                }).catch(()=>console.log(`error in createSessions ${err}`))
            });


        });
    });
}
function createSlots(sessionID,numberOfSlots){
    return new Promise((resolve,reject) => {
        let values = `(1,${sessionID})`;
        for (let i = 1; i < numberOfSlots; i++) values = values.concat(`,(${i+1},${sessionID})`);
        let sql = 'INSERT INTO slots(sNumber,sessionid) VALUES';
        sql = sql.concat(values);
        db.run(sql, function (err) {
            if (err) {
                console.log(`error in createSlots ${err}`);
                reject(err);
            }
            resolve('success inserting');
        });
    });
}
function createExamForStudents(examID,ename,students){
    return new Promise((resolve,reject) => {
        let values = `(${examID},"${ename}",${students[0].sid},"${students[0].sname}")`;
        for(let i=1;i<students.length;i++)values = values.concat(`,(${examID},"${ename}",${students[i].sid},"${students[i].sname}")`);
        let sql = 'INSERT INTO exam_student(eid,ename,sid,sname) VALUES';
        sql = sql.concat(values);
        console.log(sql)
        db.run(sql, function (err) {
            if (err) {
                console.log(`error in createExamForStudents ${err}`);
                reject(err);
            }
            resolve('students inserted successfully');
        });
    });
}
/**
 * get exams
 * used for getting exam list of a teacher or a student
 * 1 is student 0 is teacher
 */
exports.getExams = function(mode,uid){
    return new Promise((resolve,reject) => {
        let sql = mode === 1?"SELECT * FROM exam_student WHERE sid = ?":"SELECT * FROM exams WHERE tid = ?";
        console.log(sql)
        console.log(uid)
        db.all(sql, [uid], (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            let exams = mode === 1 ? rows.map((row) => (createStudentExams(row))):rows.map((row) => (createTeacherExams(row)));
            resolve(exams);
        })
    });
}

/**
 * get exam
 * used for getting data about a single exam
 * added privacy in a way
 */
exports.getExam = function(mode,uid,eid){
    return new Promise((resolve,reject) => {
        let sql = "SELECT * FROM exams WHERE id = ?";
        db.get(sql, [eid], (err,row) => {
            if(err){
                console.log(err);
                reject(err);
            }
            if(row === undefined){
                console.log("No exam Found")
                reject("No exam Found");
            }
            let promises = [getSessions(mode,eid)];
            if(mode === 0)promises.push(getCurrentRegisteredStudents(eid));
            Promise.all(promises).then(results => {

                const exam = mode === 0 ? createTeacherExam(row,results[0],results[1]):createStudentExam(row,results[0]);

                resolve(exam);

            }).catch(()=>{

                console.log("error getting data for exam");
            });

        });
    });
}

function getSessions(mode,eid){
    return new Promise((resolve,reject) => {
        let sql = 'SELECT * FROM sessions WHERE eid = ?';
        db.all(sql, [eid], function (err,rows) {
            if (err) {
                console.log(err);
                reject(err);
            }
            let sessions = rows.map((row)=> createSession(row,[]));
            let promises = [];
            sessions.forEach((s)=>{
                let promise = getSlots(mode,s.id);
                promises.push(promise);
            })

            Promise.all(promises).then(results => {
                results.forEach(function(result,index) {
                    sessions[index].slots.push(...result);
                })
                resolve(sessions);
            }).catch(()=>console.log("error getting slots"));

        });
    });
}
function getSlots(mode,sessionID){
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM slots WHERE sessionid = ? ORDER BY sNumber ASC`;
        db.all(sql, [sessionID], (err,rows) => {
            if(err){
                console.log(err);
                reject(err);
            }
            const slots = rows.map((row) => (createSlot(row,mode)));
            resolve(slots);
        })
    });
}
function getCurrentRegisteredStudents(eid){
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM exam_student WHERE eid = ?`;
        db.all(sql, [eid], (err,rows) => {
            if(err){
                console.log(err);
                reject(err);
            }
            const students = rows.map((row) => createStudentExams(row));
            resolve(students);
        })
    });
}
/**
 *
 */

exports.bookSlot = function (examBooking){
    return new Promise((resolve, reject) => {
        console.log(examBooking);
        const sql ='UPDATE slots SET esid = ?, sid = ?, name = ? WHERE id = ?';
        const sql2 = 'UPDATE exam_student SET date = ? ,time = ?,slotID = ? WHERE id = ?';
        db.serialize(() => {
            db.run(sql,[examBooking.sid===null?null:examBooking.esid,examBooking.sid,examBooking.name,examBooking.slotID])
                .run(sql2,[examBooking.date,examBooking.time,examBooking.sid===null?null:examBooking.slotID,examBooking.esid],(err, row) => {
                if (err){
                    reject(err);
                }
                resolve('success booking');
            });
        });
    });
}
exports.deleteSlot = function (){

}
/**
 *
 */
exports.registerMark = function (mark){
    return new Promise((resolve, reject) => {
        const sql ='UPDATE exam_student SET score = ? WHERE id = ?';
        db.run(sql, [mark.score,mark.esid], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }

            let promises = [updateSlot(mark.slotID,mark.score)];

            if(score => 18 && score <=31)promises.push(updateStudent(mark.sid,mark.cid));

            Promise.all(promises).then(results => {
                resolve("score updated successfully");

            }).catch(()=>{
                console.log("error updating score");
            });
        });
    });

}
function updateSlot(slotID,score){
    return new Promise((resolve, reject) => {
        const sql ='UPDATE slots SET score = ? WHERE id = ?';
        db.run(sql, [score,slotID], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve("success updating student");
        });
    });
}
function updateStudent(sid,cid){
    return new Promise((resolve, reject) => {
        const sql ='UPDATE courses_students SET didpass = ? WHERE cid = ? AND sid = ?';
        db.run(sql, [1,cid,sid], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve("success updating student");
        });
    });
}
/**
 *
 */
exports.getStudentList = function (cid){
    return new Promise((resolve,reject) => {
        let sql = "SELECT * FROM courses_students WHERE cid = ? AND didpass != 1";
        db.all(sql, [cid], (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            const students = rows.map((row)=>createStudent(row));
            resolve(students);
        })
    });
}
/**
 *
 */
