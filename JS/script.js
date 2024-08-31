import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

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

// Biến lưu trữ dữ liệu sản phẩm
let data = null;

// Hàm tạo thẻ sản phẩm
function createProductCard(product) {
  const itemContainer = document.createElement("div");
  itemContainer.classList.add("col-12", "col-sm-6", "col-md-4", "mb-4", "d-flex", "justify-content-center");

  const cardElement = document.createElement("div");
  cardElement.classList.add("card");

  const imgElement = document.createElement("img");
  imgElement.src = product.imageURL;
  imgElement.alt = product.name;
  imgElement.classList.add("card-img-top");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const titleElement = document.createElement("h5");
  titleElement.classList.add("card-title");
  titleElement.innerText = product.name;

  const priceElement = document.createElement("p");
  priceElement.classList.add("card-text");
  priceElement.innerText = `Giá: ${product.price} VND`;

  const buttonElement = document.createElement("a");
  buttonElement.href = "#";
  buttonElement.classList.add("btn", "btn-primary");
  buttonElement.innerText = "Thêm vào giỏ hàng";
  buttonElement.onclick = (event) => {
    event.preventDefault();
    addToCart(product);
  };

  cardBody.appendChild(titleElement);
  cardBody.appendChild(priceElement);
  cardBody.appendChild(buttonElement);

  cardElement.appendChild(imgElement);
  cardElement.appendChild(cardBody);
  itemContainer.appendChild(cardElement);

  return itemContainer;
}

// Hàm hiển thị sản phẩm
function displayProducts(products) {
  // Xóa nội dung cũ trong các container
  document.getElementById('hotsale').innerHTML = "";
  document.getElementById('phones').innerHTML = "";
  document.getElementById('laptop').innerHTML = "";
  document.getElementById('tablets').innerHTML = "";
  document.getElementById('accessories').innerHTML = "";
  document.getElementById('headphones').innerHTML = "";

  products.forEach((product) => {
    const itemContainer = createProductCard(product);

    if (product.hotsale) {
      const hotsaleContainer = document.getElementById("hotsale");
      if (hotsaleContainer) {
        const hotsaleItem = itemContainer.cloneNode(true);
        const hotsaleButton = hotsaleItem.querySelector(".btn");
        hotsaleButton.onclick = (event) => {
          event.preventDefault();
          addToCart(product);
        };
        hotsaleContainer.appendChild(hotsaleItem);
      } else {
        console.error("No container found for hotsale");
      }
    }

    const categoryContainer = document.getElementById(product.category);
    if (categoryContainer) {
      categoryContainer.appendChild(itemContainer);
    }
  });
}

// Hiển thị sản phẩm từ Firebase khi tải trang
document.addEventListener('DOMContentLoaded', () => {
  const dbRef = ref(db, 'products/');
  get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      data = snapshot.val();
      displayProducts(Object.values(data));

      // Thêm sự kiện tìm kiếm
      const searchInput = document.getElementById("searchInput");
      searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = Object.values(data).filter(product =>
          product.name.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredData);
      });
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error("Error retrieving data: ", error);
  });
});

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(product) {
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  let products = {
    name: product.name,
    price: product.price,
    image: product.imageURL,
    id: product.id || new Date().getTime()
  };
  cartItems.push(products);
  localStorage.setItem('cart', JSON.stringify(cartItems));
  alert(`${product.name} đã được thêm vào giỏ hàng`);
}
