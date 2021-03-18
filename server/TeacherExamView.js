/**
 * this is used for data about single exam and all related data about it
 * this is a teacher!! version of the exam
 */
class TeacherExamView{
    constructor(id,cid,tid,name,sduration,sdate,edate,numofStudents,sessions,students) {
        this.id = id;
        this.cid = cid;
        this.tid = tid;
        this.name = name;
        this.sduration = sduration;
        this.sdate = sdate;
        this.edate = edate;
        this.numofStudents = numofStudents;
        this.sessions = sessions;
        this.students = students;
    }
}
module.exports = TeacherExamView;

