/**
 * this is used for data about exams in general when showing the list of exams
 * this is a Student!! version of the exams
 */

class StudentExamsView{
    constructor(id,sid,eid,score,date,time,ename,slotID,sname) {
        this.id = id;
        this.sid = sid;
        this.eid = eid;
        this.score = score;
        this.date = date;
        this.time = time;
        this.ename = ename;
        this.slotID = slotID;
        this.sname = sname
    }
}
module.exports = StudentExamsView;