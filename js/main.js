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
/* -------------------------- Retrieve TODO list------------------------------ */
let noteRef = firebase.database().ref().child("notes/");

const notesEle = document.getElementById("notes");
noteRef.on("child_added", (snap) => {
  let item = snap.val();
  const note = document.createElement("li");
  note.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-center",
    item.finished ? "dashed-line" : "item"
  );
  note.innerText = item.text;
  note.setAttribute("child-key", snap.key);
  note.insertAdjacentHTML(
    "beforeend",
    `<button id="delete-btn" class="btn badge bg-danger rounded-pill"><i class="bi bi-trash-fill"></i></button>`
  );
  note
    .querySelector("#delete-btn")
    .addEventListener("click", (e) => deleteNote(e));
  note.addEventListener("click", (e) => finishNote(e, item));
  notesEle.appendChild(note);
});

/* -------------------------- Delete note function ------------------------------ */
async function deleteNote(e) {
  var noteId = e.target.getAttribute("child-key");
  await firebase
    .database()
    .ref("notes/" + noteId)
    .remove()
    .then(function () {
      console.log("Remove succeeded.");
    })
    .catch(function (error) {
      console.log("Remove failed: " + error.message);
    });
}
/* ----------------------- Edit note function ------------------------------------- */

function finishNote(e, item) {
  firebase
    .database()
    .ref()
    .child("notes/" + e.target.getAttribute("child-key"))
    .set({
      note_id: item.note_id,
      text: item.text,
      finished: !item.finished,
    });
}
/* ----------------------- Create new note ------------------------------------- */

const todoButton = document.querySelector("#sumbitBtn");
const todoInput = document.querySelector("#toDoInput");

todoButton.addEventListener("click", (e) => {
  e.preventDefault();
  const num = Math.random() * 1000;
  firebase.database().ref().child("notes").push().set({
    note_id: num,
    text: todoInput.value,
    finished: false,
  });
  todoInput.value = "";
});
