let students = [
    { id: "student-1", name: "Alice Johnson", course: "Web Development", level: "Beginner" },
    { id: "student-2", name: "Bob Smith", course: "Data Science", level: "Intermediate" },
    { id: "student-3", name: "Carol Lee", course: "Web Development", level: "Advanced" },]; // we need students {id, name, course, level}

const studentForm = document.querySelector("#student-form");
const nameInput = document.querySelector("#name-input");
const courseInput = document.querySelector("#course-input");
const levelSelect = document.querySelector("#level-select");

const searchInput = document.querySelector("#search");
const searchInputButton = document.querySelector("#search-btn");

const studentListContainer = document.querySelector("#student-list");
const studentCountElement = document.querySelector("#student-count");

const renderStudents = (studentList) => {
    studentCountElement.textContent = `${studentList.length} students`;

    if (studentList.length === 0) {
        studentListContainer.innerHTML = `<p class="empty-message">No students found.</p>`;
        return;
    }

    const studentHTMLElements = studentList.map((student) => {
        const {id, name, course, level} = student;
        return `<div class="student-card" id="${id}">
          <div class="student-info">
            <span class="student-name">${name}</span>
            <span class="student-meta">${course} · <span class="level-badge ${level.toLowerCase()}">${level}</span></span>
          </div>
          <button class="delete-btn">Delete</button>
        </div>`
    });

    studentListContainer.innerHTML = studentHTMLElements.join(" ");
}


renderStudents(students);