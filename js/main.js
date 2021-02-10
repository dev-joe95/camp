/* -------------------------- Define scrollTop Button------------------------------ */
const toTop = document.getElementById("to-top");

window.onscroll = function () {
  scrollToTop();
};

function scrollToTop() {
  if (
    document.body.scrollTop > 300 ||
    document.documentElement.scrollTop > 300
  ) {
    toTop.style.display = "flex";
  } else {
    toTop.style.display = "none";
  }
}

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
  apiKey: "AIzaSyBIaJ7_L8hbW4k42Qn2ISjMF5BJEgT3QS4",
  authDomain: "camp-64cb4.firebaseapp.com",
  projectId: "camp-64cb4",
  storageBucket: "camp-64cb4.appspot.com",
  messagingSenderId: "619567759321",
  appId: "1:619567759321:web:adf96a7884b38aa1e923c8",
  measurementId: "G-RK15ETC22D",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database();

/* **********************************  */

const todoInput = document.querySelector("#toDoInput");
const todoButton = document.querySelector("#submitBtn");
const todoList = document.querySelector("#notes");

todoButton.addEventListener("click", addTodo);
var dataArray;

//Read Data from the Database
function readData() {
  firebase
    .database()
    .ref("notes/")
    .once("value")
    .then((snap) => {
      dataArray = Object.values(snap.val());
      dataKeys = Object.keys(snap.val());

      for (var i = 0; i < dataArray.length; i++) {
        createLiElements(dataArray[i].text, dataArray[i].finished, dataKeys[i]);
      }
    });
}

readData();

function addTodo(event) {
  event.preventDefault();
  if (todoInput.value !== "") {
    createLiElements(todoInput.value, false);
    var uniKey = firebase.database().ref().child("toDo").push().key;

    firebase
      .database()
      .ref("notes/" + uniKey)
      .set({
        text: todoInput.value,
        finished: false,
      });

    //reading data from database

    todoInput.value = "";
  }
}

function createLiElements(text, finished, eleId) {
  const newLi = document.createElement("li");
  newLi.id = eleId;
  newLi.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );
  if (finished) {
    newLi.classList.add("dashed-line");
  } else {
    newLi.classList.remove("dashed-line");
  }
  newLi.innerText = text;

  const newDiv = document.createElement("div");
  const newButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  const editButton = document.createElement("button");

  editButton.classList.add("btn");
  deleteButton.classList.add("btn");
  newButton.classList.add("btn");
  newButton.innerHTML = `<i class="bi bi-check2-circle ${
    finished ? "text-green" : "text-success"
  } "></i>`;
  deleteButton.innerHTML = `<i class="bi bi-trash-fill text-danger"></i>`;
  editButton.innerHTML = `<i class="bi bi-pencil-square text-info"></i>`;

  newButton.addEventListener("click", function () {
    this.parentElement.parentElement.classList.toggle("dashed-line");
    if (this.parentElement.parentElement.classList.contains("dashed-line")) {
      this.children[0].classList.remove("text-success");
      this.children[0].classList.add("text-green");
    } else {
      this.children[0].classList.remove("text-green");
      this.children[0].classList.add("text-success");
    }
    firebase
      .database()
      .ref("notes/" + this.parentElement.parentElement.id)
      .update({
        finished: !finished,
      });
  });
  deleteButton.addEventListener("click", function () {
    this.parentElement.parentElement.remove();
    firebase
      .database()
      .ref("notes/" + this.parentElement.parentElement.id)
      .remove();
  });
  editButton.addEventListener("click", function () {
    todoInput.value = this.parentElement.parentElement.innerText;
    todoButton.innerText = "Update";
    firebase
      .database()
      .ref("notes/" + this.parentElement.parentElement.id)
      .update({
        text: todoInput.value,
      });
  });
  newDiv.appendChild(editButton);
  newDiv.appendChild(deleteButton);
  newDiv.appendChild(newButton);
  newLi.appendChild(newDiv);
  todoList.appendChild(newLi);
}

/* -------------------------- Retrieve TODO list------------------------------ */
// let noteRef = firebase.database().ref("notes/");

// const notesEle = document.getElementById("notes");
// noteRef.once("value").then( async (snapshot) => {
//   console.log(snapshot);
//   let note = snapshot.val();
//   const noteLi = document.createElement("li");
//   noteLi.classList.add(
//     "list-group-item",
//     "d-flex",
//     "justify-content-between",
//     "align-items-center",
//     note.finished ? "dashed-line" : "item"
//   );
//   noteLi.innerText = note.text;
//   noteLi.setAttribute("child-key", snapshot.key);
//   noteLi.insertAdjacentHTML(
//     "beforeend",
//     `<button id="delete-btn" class="btn badge bg-danger rounded-pill"><i class="bi bi-trash-fill"></i></button>`
//   );
//   /* -------------------------- Delete note function ------------------------------ */
//   noteLi.querySelector("#delete-btn").addEventListener("click", async (e) => {
//     var noteId = e.target.getAttribute("child-key");
//     await firebase
//       .database()
//       .ref("notes/" + noteId)
//       .remove()
//       .then(function () {
//         console.log("Remove succeeded.");
//       })
//       .catch(function (error) {
//         console.log("Remove failed: " + error.message);
//       });
//   });
//   /* ----------------------- Edit note function ------------------------------------- */
//   noteLi.addEventListener("click", async (e, item) => {
//     await firebase
//       .database()
//       .ref("notes/" + e.target.getAttribute("child-key"))
//       .update({
//         finished: !item.finished,
//       });
//     this.classList.toggle("lineThrough");
//   });
//   notesEle.appendChild(noteLi);
// });

// /* ----------------------- Create new note ------------------------------------- */

// // const todoButton = document.querySelector("#sumbitBtn");
// // const todoInput = document.querySelector("#toDoInput");

// todoButton.addEventListener("click", (e) => {
//   e.preventDefault();
//   firebase.database().ref("notes").push().set({
//     text: todoInput.value,
//     finished: false,
//   });
//   todoInput.value = "";
// });
