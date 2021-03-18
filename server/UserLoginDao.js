'use strict';

const StudentUser = require('./StudentUser');
const TeacherUser = require('./TeacherUser');
const db = require('./db');
const bcrypt = require('bcrypt');

/**
 * Function to create a User object from a row of the users table
 * @param {*} row a row of the users table
 */
const createTeacher = function (row) {

    const user = new TeacherUser(row.username,0,row.course,row.hash);
    return user;
}
const createStudent = function (row) {
    console.log("in create student");
    console.log(row)
    const user = new StudentUser(row.sid,row.name,1);


    return user;
}


exports.checkStudent = function (username) {
    console.log("checkStudent");
    console.log(username);
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM students WHERE sid = ?";
        db.all(sql, [username], (err, rows) => {
            console.log(rows)
            if (err) reject(err);
            else if (rows.length === 0) {
                resolve(undefined);
            } else {

                console.log("in create student");
                console.log(rows[0]);
                const user = createStudent(rows[0]);
                resolve(user);
            }
        });
    });
};

exports.getTeacher = function (user) {
    return new Promise((resolve, reject) => {
        console.log("in get teacher");
        const sql = "SELECT * FROM teachers WHERE username = ?"
        db.all(sql, [user], (err, rows) => {
            if (err) {
                console.log("asdasd");
                reject(err);
            }
            console.log(rows);
            if (rows.length === 0)
                resolve(undefined);
            else{
                const user = createTeacher(rows[0]);;
                resolve(user);
            }
        });
    });
};
exports.getTeacherByUsername = function (username) {
    console.log("getTeacherByUsername")
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM teachers WHERE username = ?"
        db.all(sql, [username], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const user = createTeacher(rows[0]);
                resolve(user);
            }
        });
    });
};
exports.checkPassword = function(user, password){
    let hash = bcrypt.hashSync(password, 10);
    console.log(hash);
    console.log("DONE");

    return bcrypt.compareSync(password, user.hash);
}