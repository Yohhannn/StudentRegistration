// This file is the logic for the registrar page.
// Seven ideas from class show up here, in this order:
//   Variables -> ID_PREFIX, MAX_STUDENTS, addedThisSession, lastAddedName, isRosterFull
//   Class     -> Student
//   Factory   -> createStudent
//   Object    -> school, and each real student
//   Singleton -> Registrar (only one registrar office ever exists)
//   Array     -> school.students and starterStudents
//   Function  -> addStudent, validateStudent, render, and the helpers below

// VARIABLES (JavaScript basics)
// A variable is a name that holds a value.
//   const -> the name always points to the same value. You cannot reassign it.
//   let   -> the value can change later.
//   var   -> the old way. It still works, but modern code uses let and const.
// Each value has a type: string (text), number, or boolean (true / false).
const ID_PREFIX = "CTU"; // string. Every id starts with this.
const MAX_STUDENTS = 50; // number. The roster cannot grow past this.
let addedThisSession = 0; // number. Goes up by 1 each time the form adds someone.
let lastAddedName = "None yet"; // string. Changes to the newest student's name.
let isRosterFull = false; // boolean. Turns true when the roster hits MAX_STUDENTS.

// CLASS
// A class is a blueprint. It does not create a student by itself.
// It lists the fields every student has, and the actions a student can do.
class Student {
  // constructor runs when we write: new Student({ ... })
  // The curly braces here mean "one object of details" is passed in.
  constructor({ id, firstName, lastName, year, program, email }) {
    // "this" means the new object being built.
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.year = year;
    this.program = program;
    this.email = email;
  }

  // Puts first name and last name together for the roster heading.
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // A method is a function that belongs to the class.
  // "Maya" and "Chen" become "MC" for the small box on the roster.
  initials() {
    const first = this.firstName[0] || "";
    const last = this.lastName[0] || "";
    return `${first}${last}`.toUpperCase();
  }

  // Another method. It builds the year and program line under the name.
  label() {
    return `${this.year} · ${this.program}`;
  }
}

// FACTORY
// A factory is a function whose job is to build objects for you.
// The rest of the code calls createStudent(entry) and never writes "new Student" itself.
// The factory does the setup in one place:
//   1. Clean the text (trim spaces, uppercase the program, lowercase the email).
//   2. Pick the next id.
//   3. Build and return the finished Student object.
// If we ever change how students are made, we only change this one function.
function createStudent(entry) {
  return new Student({
    id: nextId(),
    firstName: entry.firstName.trim(),
    lastName: entry.lastName.trim(),
    year: entry.year,
    program: entry.program.trim().toUpperCase(),
    email: entry.email.trim().toLowerCase(),
  });
}

// OBJECT
// An object groups related values under one name.
// school is one object. Its keys are name, motto, and students.
const school = {
  name: "Cebu Technological University",
  motto: "Main Campus · Student information system",
  students: [],
};

// SINGLETON
// A singleton is a class that is only allowed to have ONE object.
// A school has one registrar office, so Registrar is a singleton.
// Nobody writes "new Registrar()". Everyone calls Registrar.getInstance().
//   - The first call builds the registrar and saves it in Registrar.instance.
//   - Every call after that hands back that same saved object.
// That way every part of the page reads and changes the same roster.
class Registrar {
  // "static" means this belongs to the class itself, not to one object.
  static instance = null;

  static getInstance() {
    if (Registrar.instance === null) {
      Registrar.instance = new Registrar();
    }
    return Registrar.instance;
  }

  constructor() {
    // Guard: stop anyone from making a second registrar by hand.
    if (Registrar.instance !== null) {
      throw new Error("Registrar is a singleton. Use Registrar.getInstance().");
    }
    this.school = school;
  }

  // Put one Student object on the roster.
  enroll(student) {
    // push adds one item at the end of an array.
    this.school.students.push(student);
    return student;
  }

  count() {
    return this.school.students.length;
  }
}

// Ask for the registrar twice. Both names point to the very same object.
const registrar = Registrar.getInstance();
const registrarAgain = Registrar.getInstance();
const sameRegistrar = registrar === registrarAgain; // true

// ARRAY
// An array is an ordered list. Square brackets [ ] make an array.
// starterStudents holds plain objects. They are not Student objects yet.
// addStudent() sends each one through the factory and stores it with the registrar.
const starterStudents = [
  { firstName: "Maya", lastName: "Chen", year: "3rd Year", program: "BSIT", email: "maya.chen@ctu.edu.ph" },
  { firstName: "Luis", lastName: "Ortega", year: "2nd Year", program: "BSME", email: "luis.ortega@ctu.edu.ph" },
  { firstName: "Amina", lastName: "Rahman", year: "4th Year", program: "BSEE", email: "amina.rahman@ctu.edu.ph" },
];

// These lines connect this file to the HTML.
// querySelector finds an element by its id, like "#roster".
const form = document.querySelector("#student-form");
const errorBox = document.querySelector("#form-error");
const roster = document.querySelector("#roster");
const rosterCount = document.querySelector("#roster-count");
const trace = document.querySelector("#trace");
const snapshot = document.querySelector("#snapshot");
const variablesBox = document.querySelector("#variables");

// Copy the school object's name and motto into the header.
document.querySelector("#school-name").textContent = school.name;
document.querySelector("#school-motto").textContent = school.motto;

// forEach walks the starter array and calls addStudent once per item.
starterStudents.forEach((entry) => addStudent(entry));
render();
setTrace([
  "Set up the variables with const and let.",
  "Registrar.getInstance() was called twice and returned the same object both times.",
  "createStudent() built 3 Student objects from the starterStudents array.",
  "registrar.enroll() pushed each one into school.students.",
]);

// This function runs when the Add student button is clicked.
// addEventListener connects a page event to a function.
form.addEventListener("submit", (event) => {
  // Stop the browser from reloading the page on submit.
  event.preventDefault();

  // Build one plain object from the form fields.
  // This object is the input. It is not a Student yet.
  const entry = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    year: form.year.value,
    program: form.program.value,
    email: form.email.value,
  };

  const problem = validateStudent(entry);
  if (problem) {
    showError(problem);
    return;
  }

  const student = addStudent(entry);

  // Change the let variables. const ones like MAX_STUDENTS stay the same.
  addedThisSession = addedThisSession + 1;
  lastAddedName = student.fullName();
  isRosterFull = registrar.count() >= MAX_STUDENTS;

  form.reset();
  showError("");
  render();
  setTrace([
    "validateStudent() checked the form and found no problem.",
    `The createStudent() factory built a Student object named ${student.fullName()}.`,
    "Registrar.getInstance() handed back the one registrar, and enroll() pushed the student into school.students.",
    `The let variables changed: addedThisSession is now ${addedThisSession}.`,
    "render() drew the updated roster from the array.",
  ]);
});

// FUNCTION
// A function is a named block of steps you can run again.
// addStudent does two things:
//   1. Ask the factory to build a Student object.
//   2. Ask the one registrar to put that object on the roster.
// It returns the object so the rest of the page can use the name.
function addStudent(entry) {
  const student = createStudent(entry);

  // getInstance() gives back the same registrar as the "registrar" variable above.
  const office = Registrar.getInstance();
  office.enroll(student);
  return student;
}

// Validator. Returns an error message, or an empty string when the form is fine.
// It checks blank fields, name and email shape, then looks for the same
// or a very similar name or email already in the students array.
function validateStudent(entry) {
  const firstName = entry.firstName.trim();
  const lastName = entry.lastName.trim();
  const program = entry.program.trim();
  const email = entry.email.trim().toLowerCase();

  if (isRosterFull) {
    return `The roster is full. It holds at most ${MAX_STUDENTS} students.`;
  }

  if (!firstName || !lastName || !entry.year || !program || !email) {
    return "Fill in first name, last name, year, program, and email.";
  }

  if (!looksLikeName(firstName) || !looksLikeName(lastName)) {
    return "Use letters for first name and last name.";
  }

  if (!looksLikeEmail(email)) {
    return "Enter an email like name@ctu.edu.ph.";
  }

  const nameMatch = school.students.find((student) => namesAreTooClose(student, firstName, lastName));
  if (nameMatch) {
    if (normalizeName(nameMatch.fullName()) === normalizeName(`${firstName} ${lastName}`)) {
      return `${nameMatch.fullName()} is already on the roster.`;
    }
    return `That name is too close to ${nameMatch.fullName()}, who is already on the roster.`;
  }

  const emailMatch = school.students.find((student) => emailsAreTooClose(student.email, email));
  if (emailMatch) {
    if (normalizeEmail(emailMatch.email) === normalizeEmail(email)) {
      return "That email is already on the roster.";
    }
    return `That email is too close to ${emailMatch.email}, which is already on the roster.`;
  }

  return "";
}

function looksLikeName(value) {
  return /^[A-Za-z][A-Za-z' -]*$/.test(value);
}

function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Lowercase, drop punctuation, squash extra spaces so "Maya  Chen" matches "maya-chen".
function normalizeName(value) {
  return value.toLowerCase().replace(/['-]/g, " ").replace(/\s+/g, " ").trim();
}

// Lowercase, drop dots and +tags in the local part so maya.chen and mayachen count as the same.
function normalizeEmail(value) {
  const [local = "", domain = ""] = value.toLowerCase().split("@");
  const localCore = local.split("+")[0].replace(/\./g, "");
  return `${localCore}@${domain}`;
}

// Same person if first and last names both match, or both are only a letter or two off.
function namesAreTooClose(student, firstName, lastName) {
  const incomingFirst = normalizeName(firstName);
  const incomingLast = normalizeName(lastName);
  const listedFirst = normalizeName(student.firstName);
  const listedLast = normalizeName(student.lastName);

  return looksSimilar(incomingFirst, listedFirst) && looksSimilar(incomingLast, listedLast);
}

function emailsAreTooClose(listedEmail, incomingEmail) {
  const listed = normalizeEmail(listedEmail);
  const incoming = normalizeEmail(incomingEmail);

  if (listed === incoming) {
    return true;
  }

  const [listedLocal, listedDomain] = listed.split("@");
  const [incomingLocal, incomingDomain] = incoming.split("@");

  if (listedDomain === incomingDomain && looksSimilar(listedLocal, incomingLocal)) {
    return true;
  }

  return looksSimilar(listed, incoming);
}

// Two short strings count as similar if they match, or if only 1 or 2 letters differ.
function looksSimilar(a, b) {
  if (a === b) {
    return true;
  }

  const longest = Math.max(a.length, b.length);
  if (longest <= 4) {
    return letterDistance(a, b) <= 1;
  }

  return letterDistance(a, b) <= 2;
}

// Counts how many letter changes it takes to turn one string into the other.
function letterDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) {
    grid[i][0] = i;
  }
  for (let j = 0; j < cols; j += 1) {
    grid[0][j] = j;
  }

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      grid[i][j] = Math.min(grid[i - 1][j] + 1, grid[i][j - 1] + 1, grid[i - 1][j - 1] + cost);
    }
  }

  return grid[a.length][b.length];
}

// IDs look like CTU-001, CTU-002, and so on.
// The number comes from how many students the registrar already has.
function nextId() {
  const number = String(registrar.count() + 1).padStart(3, "0");
  return `${ID_PREFIX}-${number}`;
}

// Read the students array and draw the roster, the variables, and the data box.
function render() {
  const total = registrar.count();
  rosterCount.textContent = `${total} student${total === 1 ? "" : "s"}`;

  // map() walks the array and returns a new array of HTML strings.
  // join("") glues those strings into one block of HTML.
  roster.innerHTML = school.students
    .map(
      (student) => `
        <li>
          <span class="initials">${escapeHtml(student.initials())}</span>
          <div>
            <h3>${escapeHtml(student.fullName())}</h3>
            <p>${escapeHtml(student.label())} · ${escapeHtml(student.email)}</p>
          </div>
          <span class="student-id">${escapeHtml(student.id)}</span>
        </li>
      `
    )
    .join("");

  renderVariables();

  // Show the same array as text, so the video can point at the objects.
  snapshot.textContent = JSON.stringify(
    school.students.map((student) => ({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      year: student.year,
      program: student.program,
      email: student.email,
    })),
    null,
    2
  );
}

// Show each variable's keyword, name, current value, and type.
// typeof tells you the type of a value: "string", "number", or "boolean".
function renderVariables() {
  const rows = [
    { keyword: "const", name: "ID_PREFIX", value: ID_PREFIX },
    { keyword: "const", name: "MAX_STUDENTS", value: MAX_STUDENTS },
    { keyword: "let", name: "addedThisSession", value: addedThisSession },
    { keyword: "let", name: "lastAddedName", value: lastAddedName },
    { keyword: "let", name: "isRosterFull", value: isRosterFull },
    { keyword: "const", name: "sameRegistrar", value: sameRegistrar },
  ];

  variablesBox.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td><code class="keyword">${row.keyword}</code></td>
          <td><code>${escapeHtml(row.name)}</code></td>
          <td><code>${escapeHtml(JSON.stringify(row.value))}</code></td>
          <td class="type">${typeof row.value}</td>
        </tr>
      `
    )
    .join("");
}

// Replace the "What the code just did" list.
function setTrace(lines) {
  trace.innerHTML = lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
}

function showError(message) {
  errorBox.hidden = !message;
  errorBox.textContent = message;
}

// Turn characters like < into safe text before putting them in HTML.
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
