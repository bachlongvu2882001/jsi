// Khởi tạo Firebase (nếu chưa có)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { auth } from "./firebase.js"

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

function submitContact(name, email, phone, message) {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const userName = auth.currentUser.displayName || "Người dùng";
  
      // Tạo đối tượng tin nhắn
      const contactData = {
        name: name,
        email: email,
        phone: phone,
        message: message,
        userName: userName,
        timestamp: Date.now()
      };
  
      // Lưu tin nhắn vào Firebase Realtime Database
      set(ref(db, 'contact/' + userId), contactData)
        .then(() => {
          alert('Tin nhắn của bạn đã được gửi thành công');
          document.getElementById('contactForm').reset(); // Clear the form after submission
        })
        .catch((error) => {
          console.error('Lỗi khi gửi tin nhắn:', error);
          alert('Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại.');
        });
    } else {
      alert('Bạn cần đăng nhập để gửi tin nhắn.');
    }
  }
  
  document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
  
    if (name && email && phone && message) {
      submitContact(name, email, phone, message);
    } else {
      alert('Vui lòng điền đầy đủ thông tin trước khi gửi.');
    }
  });