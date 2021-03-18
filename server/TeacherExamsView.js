/**
 * this is used for data about exams in general when showing the list of exams
 * this is a teacher!! version of the exams
 */

class TeacherExamsView{
    constructor(id,name,numberOfStudents,startDate,endDate,tid,slotduration,courseID) {
        this.id = id;
        this.name = name;
        this.numberOfStudents = numberOfStudents;
        this.startDate = startDate;
        this.endDate = endDate;
        this.tid = tid;
        this.slotduration = slotduration;
        this.courseID = courseID;
    }
}
module.exports = TeacherExamsView;