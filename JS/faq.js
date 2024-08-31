import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js';
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

function submitQuestion(question) {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const userName = auth.currentUser.displayName || "Người dùng";
  
      // Tạo đối tượng câu hỏi
      const questionData = {
        question: question,
        userName: userName
      };
  
      // Lưu câu hỏi vào Firebase Realtime Database
      set(ref(db, 'questions/' + userName + '/' + new Date().getTime()), questionData)
      .then(() => {
        alert('Câu hỏi của bạn đã được gửi thành công');
        document.getElementById('faqTextarea').value = ''; // Clear the textarea after submission
      })
      .catch((error) => {
        console.error('Lỗi khi gửi câu hỏi:', error);
        alert('Đã xảy ra lỗi khi gửi câu hỏi. Vui lòng thử lại.');
      });
    } else {
      alert('Bạn cần đăng nhập để gửi câu hỏi.');
    }
  }
  
  document.getElementById('submitQuestion').addEventListener('click', () => {
    const question = document.getElementById('faqTextarea').value;
  
    if (question) {
      submitQuestion(question);
    } else {
      alert('Vui lòng nhập câu hỏi trước khi gửi.');
    }
  });