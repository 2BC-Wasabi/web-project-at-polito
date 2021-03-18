## React client application routes

- Route `/login`: login page with 2 Textfields , and a Switch to switch between teacher and student 
- Route `/exams`: a gridlist to show the the exams for both users, for teacher select an exam to view, or make new one , for students if already booked shows the option to delete, if not allows to select the exam and book 

- Route '/exam/id/:id/reservation/:esid': this route is used for students to show available slots in the exam with a button to allow booking
params id refers to the exam id while esid is the reservation id of the student esid used to go back also to the exams page by calling the getexams with esid

- Route '/exam/id/:id: this is used but teacher to both view results and mark student id refers to the exam id,
both those routes use the same component i used a GridList to obtain a the same number of cells as session in exam with addion to exatra cell used for teachers to see the students list 

-Route '/new-exam' this is used only by the teacher, contains a stepper to show progress while creating a new exam 



## REST API server

- POST `/teacher-login`
    request body is the username and password for teacher response is a signed jwt 
    
   - POST `/student-login`
    request body is the username and password response is student object name and sid
- POST `/logout`
   no params or body response a command to delete the cookies
    
- GET `/api/student/exams/:userid`
request params is student id 
response array of the studets exams

- GET `/api/student/exam/:examid`
request params is exam id 
response exam object with it's properties 

- PUT `/api/student/exam/booking`
request body contains an object of the booking used also for deleting response status


- GET `/api/teacher`
no params only the browsers cookie to make sure the user is authenticated

- GET `/api/Teacher/exams'`
using the jwt token get teachers exams respose array of exams 
- GET `/api/Teacher/exam/:examid'`
params exam id to retreive respone exam object with it's sessions and students

- PUT `/api/Teacher/exam/marking`
request body contains an object of the marking  response status

- GET `/api/Teacher/course-studentsr`
no params using the signed cookie retreive the students of course respomse array of studemts

- POST `api/Teacher/exam`
  request body contains data about exam to create jwt gettes's the teacher id and course response id of the new exam
   
   
## Server database

Table courses_students contains enrolled students , and if the students passed or not
table exam_students contains students and the exams that the are registered too and vise versa
table exams contains data about exams
table session contains data about sessions and the id of the exam that they are connected to
table slots contains data about a single slot if booked or not also connect with session using an id
table students contains the data about a student 
teachers contains the teacher login password and course that he teachs 

## Main React Components


  CreateExamView this is used only buy the teacher, i use a stepper to show progress in doing so first the teacher is premoted with entering an exam name i put random function to genarte names, if the selection it premotes him to select students form a list the same component is used but with a diffreant mode that shows the names and student numbers with addition to checkbox clicking on it, then the teacher selects duration and finally defines sessions, using an dialog, i also added the option to edit and delete, then when there is enough slots he can see an over view with the options to save.
  
  ExamDetailView i used a GridList to make cells the number of session depends on teacher has another cell of list of all students
in each cell i created a listview cards in the list view related to this routes have 4 modes, for student it shows the free slots , booked ones appear as booked for secutriy, for the teacher he sees the list view with the status of the student, the card views -  first he may select if a student is present or absent,then it allows him to select a score form a drop down menu after that is shows the score. 

  ExamsGridView, a GridList that shows the exams of either teacher or the student shows exams that he was signed to if he is booked it gives him the option to delete it also shows the score if he has any, for the teacher it shows start and end time with the number of students , it also gives the option to delete the appointment for the student for the teacher it allows to select an exam and view it's resault or mark with addition to floating button that allow the teacher to create new exams

SessionCardView show a dialog when the teacher defines sessions allows him to edit a session as well or cancel  
(only _main_ components, minor ones may be skipped)


## Test users

* F.Corno password(frequent customer)
* M.Torchiano password
* 21482  frequent customer)
* 20703, 
* 25764,  
