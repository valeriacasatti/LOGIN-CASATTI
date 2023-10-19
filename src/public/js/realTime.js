const socketClient = io();

const productList = document.getElementById("productList");
const addProductForm = document.getElementById("addProductForm");

addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(addProductForm);
  const jsonData = {};
  for (const [key, value] of formData.entries()) {
    jsonData[key] = value;
  }

  jsonData.price = parseInt(jsonData.price);
  jsonData.stock = parseInt(jsonData.stock);

  socketClient.emit("addProduct", jsonData);
  addProductForm.reset();

  Swal.fire({
    title: `${jsonData.title} added successfully!`,
    showConfirmButton: false,
    timer: 1000,
  });
});

socketClient.on("products", (data) => {
  let productElm = "";

  data.forEach((product) => {
    productElm += `
  <li>
 <img src="${product.thumbnail}"  />
    <h4 class="productTitle">${product.title}</h4>
    <h4>${product.description}</h4>
    <h5>$ ${product.price}</h5>
    <h6>stock: ${product.stock}</h6>
    <button onClick="deleteProduct('${product._id}')">delete</button>
  </li>`;
  });

  productList.innerHTML = productElm;
});

const deleteProduct = (id) => {
  socketClient.emit("deleteProduct", id);
};
