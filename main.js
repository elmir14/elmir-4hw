const products = document.querySelector(".products");
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const desc = document.querySelector("#desc");
const category = document.querySelector("#category");
const add_btn = document.querySelector("#add_btn");

function getProduct() {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(json =>
            json?.forEach((item, i) => {
                products.innerHTML += `
                    <div class="product" data-id="${item.id}">
                        <img src="${item.image}"/>
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <p class="price">Price: $${item.price}</p>
                        <button class="edit-btn" onclick="editProduct('${item.id}')">Edit</button>
                        <button class="del-btn" onclick="delProduct('${item.title}')">Delete</button>
                    `;
            }),
        );
}


add_btn.addEventListener("click", (event) => {
    event.preventDefault();
    postData(
        title.value,
        price.value,
        desc.value, 
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTguiaORqINItLBkL6r4V8k9LaAbTgu3xGhGQ&usqp=CAU",
        category.value
    );
});

function postData(title, price, description, image, category) {
    const data = {
        title, 
        price, 
        description, 
        image, 
        category,
    };
    addProduct(data);
}

getProduct();

function addProduct({ title, price, description, image, category }) {
    fetch("https://fakestoreapi.com/products", {
        method: "POST",
        body: JSON.stringify({
            title,
            price,
            description,
            image,
            category,
        }),
        headers: {
            "Content-type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((json) => {
            products.innerHTML += `
                <div class="product" data-id="${json.id}">
                    <img src="${json.image}"/>
                    <h3>${json.title}</h3>
                    <p>${json.description}</p>
                    <p class="price">Price: $${json.price}</p>
                    <button class="edit-btn" onclick="editProduct('${json.id}')">Edit</button>
                    <button class="del-btn" onclick="delProduct('${json.title}')">Delete</button>
                `;
        });
}

function saveEditedProduct(productId, inputTitle, inputDescription, inputPrice) {
    const updatedTitle = inputTitle.value;
    const updatedDescription = inputDescription.value;
    const updatedPrice = inputPrice.value;

    // Отправьте запрос на сервер для обновления товара
    fetch(`https://fakestoreapi.com/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify({
            title: updatedTitle,
            description: updatedDescription,
            price: updatedPrice,
        }),
        headers: {
            "Content-type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((updatedProduct) => {
            // Замените input-поля на обновленные данные
            inputTitle.replaceWith(updatedProduct.title);
            inputDescription.replaceWith(updatedProduct.description);
            inputPrice.replaceWith(`Price: $${updatedProduct.price}`);

            // Замените кнопку "Сохранить" на кнопку "Edit"
            const productDiv = document.querySelector(`.product[data-id="${productId}"]`);
            const saveButton = productDiv.querySelector(".edit-btn");
            saveButton.textContent = "Edit"; // Используйте .textContent вместо .replaceWith
        });
}


function delProduct(title) {
    const productDiv = document.querySelectorAll(".product");
    productDiv.forEach((product) => {
        const productTitle = product.querySelector("h3").textContent;
        if (productTitle === title) {
            product.remove();
        }
    });
}

//Edit 
function editProduct(productId) {
    const productDiv = document.querySelector(`.product[data-id="${productId}`);
    const productTitle = productDiv.querySelector("h3");
    const productDescription = productDiv.querySelector("p");
    const productPrice = productDiv.querySelector(".price");

    // Создайте input-поля для редактирования
    const inputTitle = document.createElement("input");
    inputTitle.value = productTitle.textContent;
    const inputDescription = document.createElement("input");
    inputDescription.value = productDescription.textContent;
    const inputPrice = document.createElement("input");
    inputPrice.value = productPrice.textContent;

    // Замените текстовые элементы на input-поля
    productTitle.replaceWith(inputTitle);
    productDescription.replaceWith(inputDescription);
    productPrice.replaceWith(inputPrice);

    // Создайте кнопку "Сохранить" для сохранения изменений
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => saveEditedProduct(productId, inputTitle, inputDescription, inputPrice));

    // Замените кнопку "Edit" на кнопку "Сохранить"
    const editButton = productDiv.querySelector(".edit-btn");
    editButton.replaceWith(saveButton);
}

// 3. Добавьте функцию saveEditedProduct
// В вашем файле JavaScript, после функции editProduct, добавьте следующий код:
function saveEditedProduct(productId, inputTitle, inputDescription, inputPrice) {
    const updatedTitle = inputTitle.value;
    const updatedDescription = inputDescription.value;
    const updatedPrice = inputPrice.value;

    // Отправьте запрос на сервер для обновления товара
    fetch(`https://fakestoreapi.com/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify({
            title: updatedTitle,
            description: updatedDescription,
            price: updatedPrice
        }),
        headers: {
            "Content-type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((updatedProduct) => {
        // Замените input-поля на обновленные данные
        inputTitle.replaceWith(updatedProduct.title);
        inputDescription.replaceWith(updatedProduct.description);
        inputPrice.replaceWith(`Price: $${updatedProduct.price}`);

 
        const productDiv = document.querySelector(`.product[data-id="${productId}"]`);
        const saveButton = productDiv.querySelector(".save-btn");
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editProduct(productId));
        saveButton.replaceWith(editButton);
    });
}