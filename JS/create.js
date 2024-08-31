import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

// Cấu hình Firebase
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

function addProduct(name, price, category, hotsale, imageDataUrl) {

  set(ref(db, 'products/' + name), {
    name: name,
    price: price,
    category: category,
    hotsale: hotsale,
    imageURL: imageDataUrl
  }).then(() => {
    alert("Thêm sản phẩm thành công");
    document.getElementById('product-form').reset();
  }).catch((error) => {
    alert("Unsuccessful: " + error);
  });
}

document.getElementById("upload").addEventListener('click', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const categorySelect = document.querySelector('.form-select');
  const category = categorySelect.options[categorySelect.selectedIndex].id;
  const hotsale = document.getElementById('hotsale').checked;
  const image = document.getElementById('img').files[0];


  if (image) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const imageDataUrl = reader.result;

      // Lưu sản phẩm vào Firebase Realtime Database
      addProduct(name, price, category, hotsale, imageDataUrl);
    }
    reader.readAsDataURL(image);
  } else {
    alert("Please upload an image.");
  }
});
