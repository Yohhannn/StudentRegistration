# Video script: Cebu Technological University Student Registrar

About 4 to 5 minutes. Open the site in a browser and keep `app.js` open beside it. The comments in `app.js` are labeled VARIABLES, CLASS, FACTORY, OBJECT, SINGLETON, ARRAY, and FUNCTION, top to bottom. Scroll to each word as you talk about it.

Lines in quotes are what you say. Lines in brackets are what you do.

---

"Hi, this is my activity. I built a small school website where you can add a student. It is written in JavaScript, and the important file is app.js. It covers variables, arrays, objects, functions, the factory pattern, and the singleton pattern."

[Show the page. Point at the three names on the roster, then at the "Variables right now" table under the log.]

"This is the Cebu Technological University registrar. Maya, Luis, and Amina are already on the list. I will add one more person, then show the code that does it."

[Switch to `app.js`. Point at the comment that says VARIABLES.]

"First, variables. A variable is a name that holds a value. `const` means the name can't be reassigned, so `ID_PREFIX` and `MAX_STUDENTS` stay the same the whole time. `let` means the value can change. `addedThisSession`, `lastAddedName`, and `isRosterFull` change every time I add someone. They also show three types: `ID_PREFIX` is a string, `MAX_STUDENTS` is a number, and `isRosterFull` is a boolean, true or false. `var` is the older way to make a variable, but modern code uses `let` and `const`."

[Scroll to the comment that says CLASS, on `class Student`.]

"Next is the Student class. A class is a blueprint. It says every student has an id, a first name, a last name, a year, a program, and an email. `fullName`, `initials`, and `label` are methods, which are functions that belong to the class."

[Scroll to the comment that says FACTORY, on `function createStudent`.]

"Now the factory pattern. A factory is a function whose job is to build objects. The rest of my code never writes `new Student` by itself. It always calls `createStudent`. The factory trims the spaces, makes the program uppercase and the email lowercase, picks the next id, and then returns the finished Student. All of that setup is in one place, so if I change how students are made, I only change this one function."

[Scroll to the comment that says OBJECT, on `const school`.]

"This is an object. `school` groups values under keys: the name, the motto, and `students`. The header on the page reads the name and the motto from this object. Each student made by the factory is an object too."

[Scroll to the comment that says SINGLETON, on `class Registrar`.]

"This is the singleton pattern. A singleton is a class that can only ever have one object. A school has one registrar office, so `Registrar` is a singleton. You don't write `new Registrar`. You call `Registrar.getInstance()`. The first call builds the registrar and saves it. Every call after that gives back the same saved one. If someone tries `new Registrar` a second time, the constructor throws an error."

[Point at the three lines `registrar`, `registrarAgain`, `sameRegistrar`.]

"Here I ask for the registrar twice and compare the two with triple equals. It's `true`, so both names point to the same object. You can see `sameRegistrar` is true in the table on the page too."

[Scroll to the comment that says ARRAY, on `const starterStudents`.]

"Arrays. You can tell these are arrays from the square brackets. `starterStudents` is the starting list of three people, and `school.students` starts empty. `forEach` walks the starter array, and each person gets pushed into `school.students`. Later, `map` walks the array again to draw the roster, and `find` searches it for duplicates."

[Scroll to the comment that says FUNCTION, on `function addStudent`.]

"Last, functions. A function is a named set of steps that I can run again and again. `addStudent` asks the factory for a Student, then asks the one registrar to enroll it. `validateStudent` is another function. It blocks the form if a field is blank, if a name has characters that aren't letters, if the email looks wrong, or if that person is already on the roster, even when the spelling is only a little off. `render` reads the array and redraws the page."

[Go back to the browser. Type slowly: first name Sofia, last name Reyes, 3rd Year, program bsit, sofia.reyes@ctu.edu.ph. Click Add student.]

"The count goes from 3 students to 4, and Sofia shows up at the bottom. I typed the program in lowercase, but it shows BSIT, because the factory cleaned it. The log follows the same order as the code. The validator checked the form, the factory built the Student, the singleton registrar enrolled her into the array, the variables changed, and `render` redrew the page."

[Point at the variables table.]

"In the variables table, `addedThisSession` went from 0 to 1 and `lastAddedName` is now Sofia Reyes. Those are `let` variables. The `const` ones didn't change."

[Point at the dark box.]

"The dark box is the students array printed out, and Sofia is the last object in it."

"So, to wrap up: variables hold the values, the class is the blueprint, the factory builds each student, objects group the data, the singleton makes sure there's only one registrar, the array holds every student, and functions run the steps when I click Add student. That's my activity."
