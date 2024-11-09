import "./styles.css";

let projectArray = JSON.parse(localStorage.getItem("projectStorage")) || [];

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem("projectStorage", JSON.stringify(projectArray));
}

// Initial loading of project data
function init() {
    displayProject();
}

// DOM Elements
const newProjectBtn = document.querySelector("#newProjectBtn");
const mainContainer = document.querySelector("#mainContainer");
const newProjectDialog = document.querySelector("#newProjectDialog");
const closeNewProjectBtn = document.querySelector("#closeNewProjectBtn");
const projectNameForm = document.querySelector("#projectNameForm");
const projectContainer = document.querySelector("#projectContainer");
const todoContainer = document.querySelector(".todoContainer");
const addTodoBtn = document.querySelector("#addTodoBtn");
const closeNewTodoBtn = document.querySelector("#closeNewTodoBtn");
const AddNewTodoBtn = document.querySelector("#AddNewTodoBtn");
const todoDialog = document.querySelector("#todoDialog");
const projectTitleTodo = document.querySelector("#projectTitleTodo")

let selectedProjectIndex = null; // Track selected project index

// Project item constructor
function NewProjectItem(title) {
    this.title = title;
    this.todoArray = [];
}

function Todo(taskName, description, date, priority) {
    this.taskName = taskName;
    this.description = description;
    this.date = date;
    this.priority = priority;
}

// Open and close dialog
newProjectBtn.addEventListener("click", () => {
    newProjectDialog.show();
});
closeNewProjectBtn.addEventListener("click", () => {
    newProjectDialog.close();
});

addTodoBtn.addEventListener("click", () => {
    todoDialog.show();
});

closeNewTodoBtn.addEventListener("click", () => {
    todoDialog.close();
});

// Adding a new project
projectNameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const projectName = document.querySelector("#projectName").value;

    if (projectName) {
        const newProjectObj = new NewProjectItem(projectName);
        projectArray.push(newProjectObj);
        saveToLocalStorage();
        resetDisplayProject();
        displayProject();
        projectNameForm.reset();
        newProjectDialog.close();
    }
});

// Create and display a single project
function newProject(projectName, projectIndex) {
    const newProjectWrapper = document.createElement("div");
    newProjectWrapper.className = "newProjectWrapper";

    const newProject = document.createElement("button");
    newProject.className = "newProject";
    newProject.textContent = projectName;
    newProject.addEventListener("click", () => {
        selectedProjectIndex = projectIndex; // Set selected project index
        displayTodos(); // Display the to-dos of the selected project
    });

    const deleteBtnWrapper = document.createElement("div");
    deleteBtnWrapper.innerHTML = '<button id="deleteProjectBtn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg></button>';
    deleteBtnWrapper.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent triggering project selection
        projectArray.splice(projectIndex, 1);
        saveToLocalStorage();
        resetDisplayProject();
        displayProject();
    });

    newProjectWrapper.appendChild(newProject);
    newProjectWrapper.appendChild(deleteBtnWrapper);
    projectContainer.appendChild(newProjectWrapper);
}

// Display all projects
function displayProject() {
    projectContainer.innerHTML = ''; // Clear existing projects
    projectArray.forEach((project, index) => {
        newProject(project.title, index);
    });
}

// Reset display of the project container
function resetDisplayProject() {
    projectContainer.innerHTML = '';
    todoContainer.innerHTML = ""
    projectTitleTodo.textContent = ""
}

function displayTodos() {
    todoContainer.innerHTML = '';

    if (selectedProjectIndex !== null && projectArray[selectedProjectIndex]) {

        projectTitleTodo.textContent = projectArray[selectedProjectIndex].title

        const todos = projectArray[selectedProjectIndex].todoArray;

        todos.forEach((todo, todoIndex) => {
            const todoItem = document.createElement("div");
            todoItem.className = "todoItemWrapper";

            const textWrapper = document.createElement("div");
            textWrapper.className = "textWrapper";

            const todoTitle = document.createElement("h1");
            todoTitle.textContent = todo.taskName;

            const todoDes = document.createElement("p");
            todoDes.textContent = todo.description;

            textWrapper.appendChild(todoTitle);
            textWrapper.appendChild(todoDes);

            const dateAndPriorityWrapper = document.createElement("div");
            dateAndPriorityWrapper.className = "dateWrapper";

            const dateText = document.createElement("p");
            dateText.textContent = `Due Date: ${todo.date}`;

            const priorityText = document.createElement("p");
            priorityText.textContent = `Priority: ${todo.priority}`;

            dateAndPriorityWrapper.appendChild(dateText);
            dateAndPriorityWrapper.appendChild(priorityText);

            const todoDeleteBtnWrapper = document.createElement("div");
            todoDeleteBtnWrapper.className = "todoDeleteBtnWrapper";

            const todoDeleteBtn = document.createElement("button");
            todoDeleteBtn.className = "delBtn";
            todoDeleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>';

            todoDeleteBtn.addEventListener("click", () => {
                projectArray[selectedProjectIndex].todoArray.splice(todoIndex, 1);
                saveToLocalStorage();
                displayTodos();
            });

            todoDeleteBtnWrapper.appendChild(todoDeleteBtn);

            todoItem.appendChild(textWrapper);
            todoItem.appendChild(dateAndPriorityWrapper);
            todoItem.appendChild(todoDeleteBtnWrapper);

            todoContainer.appendChild(todoItem);
        });
    }
}


// Adding a new todo to the selected project
AddNewTodoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (selectedProjectIndex === null) return alert("Select a project first!");

    const taskName = document.querySelector("#taskName").value;
    const description = document.querySelector("#description").value;
    const date = document.querySelector("#dueDate").value;
    const priority = document.querySelector("#priority").value;

    const newTodo = new Todo(taskName, description, date, priority);
    projectArray[selectedProjectIndex].todoArray.push(newTodo);
    saveToLocalStorage();
    displayTodos(); // Update todo display
    todoDialog.close();
});

init();

export { projectArray };
