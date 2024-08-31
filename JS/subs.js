import { auth, db, subscriptions } from "./firebase.js";
import { signOut, onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import {
    addDoc,
    query,
    orderBy,
    collection,
    onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

    window.handleSignOut = () => {
    signOut(auth);
    };

  const updateNavbar = (user) => {
    const navbarLinks = document.querySelector("#navbar-links");
    if (auth.currentUser) {
      navbarLinks.innerHTML = /*html*/ `
        <div class="dropdown">
          <img class="navbar-avatar" src="../Assets/Avatar.jpg" alt="User Avatar" id="navbarAvatar" data-bs-toggle="dropdown" aria-expanded="false" />
          <ul class="dropdown-menu dropdown-menu-end mt-2" aria-labelledby="navbarAvatar">
            <li><button class="dropdown-item link-danger" onclick="handleSignOut()">Đăng xuất</button></li>
          </ul>
        </div>
      `;
    } else {
      navbarLinks.innerHTML = /*html*/ `
        <a href="LoginRegister.html">
          <i class="fa-solid fa-user" id="users"></i>
        </a>
      `;
    }
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      updateNavbar(user);
    } else {
      updateNavbar(null);
    }
  });