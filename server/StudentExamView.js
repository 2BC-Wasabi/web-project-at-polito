/**
 * this is used for data about single exam and all related data about it
 * this is a student!! version of the exam
 */

class StudentExamView{
    constructor(id,cid,tid,name,sduration,sdate,edate,numofStudents,sessions) {
        this.id = id;
        this.cid = cid;
        this.tid = tid;
        this.name = name;
        this.sduration = sduration;
        this.sdate = sdate;
        this.edate = edate;
        this.numofStudents = numofStudents;
        this.sessions = sessions;
    }
}
module.exports = StudentExamView;