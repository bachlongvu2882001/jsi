import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBb5SsxzRGdqWG1ZaDzbYE9lRQNJ0rcPKA",
  authDomain: "test1-a6efc.firebaseapp.com",
  databaseURL: "https://test1-a6efc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test1-a6efc",
  storageBucket: "test1-a6efc.appspot.com",
  messagingSenderId: "626229769095",
  appId: "1:626229769095:web:28f497d09506440f7f1922",
  measurementId: "G-GVBVJ26TGP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const storage = getStorage(app);

function saveJobApplication(name, email, position, resumeFile) {
  set(ref(db, 'jobApplications/' + name), {
    name: name,
    email: email,
    position: position,
    resumeFile: resumeFile
  }).then(() => {
    alert("Job application saved successfully.");
  }).catch((error) => {
    alert("Error saving job application:", error);
  });
}

document.getElementById("submit-data").addEventListener('click', function (e) {
  e.preventDefault();
  // e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const positionSelect = document.getElementById('position');
  const position = positionSelect.options[positionSelect.selectedIndex].value;
  const resumeFile = document.getElementById('resumeFile').files[0];

  if (!name || !email || !position || !resumeFile) {
    alert("Please fill all fields and select a resume file.");
    return;
  }

  const storageRef = sRef(storage, 'resumes/' + resumeFile.name);
  const uploadTask = uploadBytesResumable(storageRef, resumeFile);

  uploadTask.on('state_changed', 
    (snapshot) => {
    }, 
    (error) => {
      console.error("Error uploading file:", error);
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        saveJobApplication(name, email, position, downloadURL);

        document.getElementById('recruit-form').reset();
      });
    }
  );
})
