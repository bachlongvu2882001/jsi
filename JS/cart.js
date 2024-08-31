import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { auth } from "./firebase.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getDatabase, ref, child, get, set } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

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

document.addEventListener('DOMContentLoaded', () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const productsContainer = document.getElementById('products-container');
    const checkoutContainer = document.getElementById('checkout-container');

    // Xóa nội dung cũ trong container
    productsContainer.innerHTML = "";
    checkoutContainer.innerHTML = ""; // Xóa nội dung cũ của nút đặt hàng

    let totalPrice = 0;

    if (cartItems.length > 0) {
        cartItems.forEach((product) => {
            // Tạo các phần tử cho sản phẩm
            const itemContainer = document.createElement("div");
            itemContainer.classList.add("col-12", "col-sm-6", "col-md-4", "mb-4", "d-flex", "justify-content-center");
      
            const cardElement = document.createElement("div");
            cardElement.classList.add("card");
      
            const imgElement = document.createElement("img");
            imgElement.src = product.image;
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
            buttonElement.classList.add("btn", "btn-danger");
            buttonElement.innerText = "Xoá sản phẩm";
            buttonElement.onclick = (event) => {
              event.preventDefault();
              console.log(product);
              removeProductFromCart(product.id);
            };
      
            // Thêm các phần tử vào cấu trúc thẻ
            cardBody.appendChild(titleElement);
            cardBody.appendChild(priceElement);
            cardBody.appendChild(buttonElement);
      
            cardElement.appendChild(imgElement);
            cardElement.appendChild(cardBody);
            itemContainer.appendChild(cardElement);
      
            // Thêm sản phẩm vào container chính
            productsContainer.appendChild(itemContainer);
            totalPrice += parseInt(product.price.replace(/\./g, ''), 10); // Loại bỏ dấu chấm và chuyển sang số nguyên
        });

        // Thêm phần tử hiển thị tổng giá
        const totalPriceContainer = document.createElement("div");
        totalPriceContainer.classList.add("total-price-container");

        const totalPriceTitle = document.createElement("span");
        totalPriceTitle.classList.add("total-price-title");
        totalPriceTitle.innerText = "Tổng cộng (Chưa tính thuế):";

        const totalPriceValue = document.createElement("span");
        totalPriceValue.classList.add("total-price-value");
        totalPriceValue.innerText = `${totalPrice.toLocaleString()} VND`; // Định dạng số với dấu chấm

        totalPriceContainer.appendChild(totalPriceTitle);
        totalPriceContainer.appendChild(totalPriceValue);
        checkoutContainer.appendChild(totalPriceContainer);

        // Tạo nút "Mua tất cả sản phẩm"
        const checkoutButton = document.createElement("button");
        checkoutButton.classList.add("btn", "btn-primary", "checkout-button"); // Thêm lớp checkout-button
        checkoutButton.innerText = "Đặt hàng";
        checkoutButton.onclick = () => {
            placeOrder(cartItems, totalPrice);
        };

        // Thêm nút vào container
        checkoutContainer.appendChild(checkoutButton);
    } else {
        // Hiển thị thông báo nếu giỏ hàng trống
        const emptyMessage = document.createElement("p");
        emptyMessage.innerText = "Bạn chưa đặt hàng nào";
        emptyMessage.classList.add("text-center", "mt-5", "mb-5");
        productsContainer.appendChild(emptyMessage);

        // Ẩn nút đặt hàng nếu không có sản phẩm
        checkoutContainer.style.display = "none";
    }
});

function removeProductFromCart(productId) {
  // Lấy dữ liệu từ localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Lọc các sản phẩm để loại bỏ sản phẩm có id cụ thể
  cart = cart.filter(product => product.id !== productId);

  // Cập nhật lại localStorage với danh sách sản phẩm đã được cập nhật
  localStorage.setItem('cart', JSON.stringify(cart));

  location.reload();
}

function placeOrder(cartItems, totalPrice) {
  
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const userName = auth.currentUser.displayName || "Người dùng";
  
      // Lấy tên và giá của các sản phẩm
      const products = cartItems.map(item => item.name).join(', ');
  
      // Tạo đối tượng đơn hàng
      const order = {
        nameProduct: products,
        priceAllProduct: `${totalPrice.toLocaleString()} VND`
      };
  
      // Lưu đơn hàng vào Firebase Realtime Database
      set(ref(db, 'order/' + userName), order)
      .then(() => {
        alert('Đã đặt hàng thành công');
        // Xóa giỏ hàng sau khi đặt hàng
        localStorage.removeItem('cart');
        location.reload();
        })
        .catch((error) => {
          console.error('Lỗi khi đặt hàng:', error);
          alert('Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.');
        });
    } else {
      alert('Bạn cần đăng nhập để thực hiện đặt hàng.');
    }
  }