import StudentExam from './StudentExamView';
import StudentExams from './StudentExamsView';
import TeacherExam from './TeacherExamView';
import TeacherExams from './TeacherExamsView';
import Student from './Student';
const APIURL = 'http://localhost:3000/api';



async function getExams(userID,privacy){
    console.log(`aaaaa ooooo ${privacy}`);
    const url = privacy ? '/Teacher/exams' : `/student/exams/${userID}`
    const response = await fetch(APIURL + url);
    const examsJson = await response.json();
    console.log("privay");
    console.log(privacy);
    if(response.ok){
        console.log("get exams");
        const exams = examsJson.map((exam) => !privacy ? new StudentExams(exam.id,exam.sid,exam.eid,exam.score,exam.date,exam.time,exam.ename,exam.slotID,exam.sname):new TeacherExams(exam.id,exam.name,exam.numberOfStudents,exam.startDate,exam.endDate,exam.tid,exam.slotduration,exam.courseID));
        console.log(exams);
        return exams
    } else {
        throw examsJson;  // An object with the error coming from the server
    }
}
async function getExam(examID,privacy){
    const url = privacy ? `/Teacher/exam/${examID}` : `/student/exam/${examID}`
    const response = await fetch(APIURL + url);
    const exam = await response.json();
    if(response.ok){
        return !privacy ? new StudentExam(exam.id,exam.cid,exam.tid,exam.name,exam.sduration,exam.sdate,exam.edate,exam.numofStudents,exam.sessions):new TeacherExam(exam.id,exam.cid,exam.tid,exam.name,exam.sduration,exam.sdate,exam.edate,exam.numofStudents,exam.sessions,exam.students);
    } else {
        throw exam;  // An object with the error coming from the server
    }
}
async function createExam(exam){
    const response = await fetch(APIURL+'/Teacher/exam', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(exam)
    });
    const json = await response.json();
    return json ;
}
async function bookingExam(booking){
    const response = await fetch(APIURL+`/student/exam/booking`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
    });
    const json = await response
    return json ;
}
async function markStudent(mark){
    const response = await fetch(APIURL+`/Teacher/exam/marking`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(mark),
    });
    const json = await response;
    return json ;
}
async function getStudents(cid){
    const response = await fetch(APIURL + `/Teacher/course-students`);
    const students = await response.json();
    if(response.ok){
        return students.map((student) => new Student(student.sid,student.sname));
    } else {
        throw students;  // An object with the error coming from the server
    }
}


async function isAuthenticated(){
    let url = "/teacher";
    const response = await fetch(APIURL + url);
    const userJson = await response.json();
    if(response.ok){
        return userJson;
    } else {
        let err = {status: response.status, errObj:userJson};
        throw err;  // An object with the error coming from the server
    }
}
async function userLogin(username, password,type) {
    const url = type === 0 ? '/teacher-login':'/student-login';
    const body = type === 0 ? JSON.stringify({username: username, password: password}):JSON.stringify({username: username})
    console.log(url)
    console.log(body)
    return new Promise((resolve, reject) => {
        fetch(APIURL + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    console.log(`successful teacher/student login ${user}`);
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}
async function userLogout(username, password) {
    return new Promise((resolve, reject) => {
        fetch(APIURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

const API = {getExams,getExam,createExam,bookingExam,getStudents,markStudent,isAuthenticated,userLogin,userLogout};
export default API;