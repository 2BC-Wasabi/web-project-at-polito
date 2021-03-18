/**
 * this is used for data about single exam and all related data about it
 * this is a teacher!! version of the exam
 *///todo momentjs
import Sessions from './Session';
import ExamStudents from './StudentExamsView';
import moment from "moment";
class TeacherExamView{
    constructor(id,cid,tid,name,sduration,sdate,edate,numofStudents,sessions,students) {
        this.id = id;
        this.cid = cid;
        this.tid = tid;
        this.name = name;
        this.sduration = moment(sduration,'HH:mm').format('HH:mm');
        this.sdate = moment(sdate).format('YYYY-MM-DD');
        this.edate = moment(edate).format('YYYY-MM-DD');
        this.numofStudents = numofStudents;
        this.sessions = sessions.map((session)=> new Sessions(session.id,session.sdate,session.startTime,session.duration,session.examid,session.sorder,session.slots,sduration));
        this.students = students.map((student)=> new ExamStudents(student.id,student.sid,student.eid,student.score,student.date,student.time,student.ename,student.slotID,student.sname));
        //todo moment.js
    }
}
export default TeacherExamView;

