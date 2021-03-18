import Sessions from "./Session";
import moment from "moment";

/**
 * this is used for data about single exam and all related data about it
 * this is a student!! version of the exam
 */
//todo momentjs
class StudentExamView{
    constructor(id,cid,tid,name,sduration,sdate,edate,numofStudents,sessions) {
        this.id = id;
        this.cid = cid;
        this.tid = tid;
        this.name = name;
        this.sduration = moment(sduration,'HH:mm').format('HH:mm');
        this.sdate = moment(sdate).format('YYYY-MM-DD');
        this.edate = moment(edate).format('YYYY-MM-DD');
        this.numofStudents = numofStudents;
        this.sessions = sessions.map((session)=> new Sessions(session.id,session.sdate,session.startTime,session.duration,session.examid,session.sorder,session.slots,sduration));
    }
}
export default StudentExamView;