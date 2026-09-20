// ==============================
// PRODUCTS
// ==============================

let products =
    JSON.parse(localStorage.getItem("products")) || [];


// ==============================
// POST PRODUCT
// ==============================

function postItem() {

    const nameInput =
        document.getElementById("productName");

    const priceInput =
        document.getElementById("productPrice");

    const categoryInput =
        document.getElementById("productCategory");

    const descriptionInput =
        document.getElementById("productDescription");

    const imageInput =
        document.getElementById("productImage");

    if (
        !nameInput ||
        !priceInput ||
        !categoryInput ||
        !descriptionInput ||
        !imageInput
    ) {
        return;
    }

    const name =
        nameInput.value.trim();

    const price =
        priceInput.value;

    const category =
        categoryInput.value;

    const description =
        descriptionInput.value.trim();

    if (
        name === "" ||
        price === "" ||
        description === ""
    ) {
        alert(
            "Please fill in all product fields."
        );

        return;
    }

    const file =
        imageInput.files[0];

    if (file) {

        const reader =
            new FileReader();

        reader.onload =
            function(event) {

                saveProduct(
                    name,
                    price,
                    category,
                    description,
                    event.target.result
                );

            };

        reader.readAsDataURL(file);

    } else {

        saveProduct(
            name,
            price,
            category,
            description,
            ""
        );

    }
}


// ==============================
// SAVE PRODUCT
// ==============================

function saveProduct(
    name,
    price,
    category,
    description,
    image
) {

    const product = {

        id: Date.now(),

        name: name,

        price: Number(price),

        category: category,

        description: description,

        image: image

    };

    products.push(product);

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    alert(
        "Product posted successfully!"
    );

    window.location.href =
        "index.html";
}


// ==============================
// DISPLAY PRODUCTS
// ==============================

function displayProducts(productList) {

    const newProduct =
        document.getElementById(
            "newProduct"
        );

    if (!newProduct) {
        return;
    }

    newProduct.innerHTML = "";

    if (productList.length === 0) {

        newProduct.innerHTML =
            "<p>No products found.</p>";

        return;
    }

    productList.forEach(
        function(product) {

            newProduct.innerHTML += `

                <div class="product">

                    ${
                        product.image
                        ?
                        `<img
                            src="${product.image}"
                            alt="${product.name}"
                        >`
                        :
                        ""
                    }

                    <h3>
                        ${product.name}
                    </h3>

                    <p class="price">
                        💰 $${product.price}
                    </p>

                    <p class="category">
                        🏷️
                        ${product.category || "Other"}
                    </p>

                    <p class="description">
                        ${product.description}
                    </p>

                    <a
                        href="posted-product.html?id=${product.id}"
                    >
                        <button type="button">
                            👀 View Product
                        </button>
                    </a>

                    <button
                        type="button"
                        onclick="addToCart(${product.id})"
                    >
                        🛒 Add to Cart
                    </button>

                    <button
                        type="button"
                        onclick="addToFavorites(${product.id})"
                    >
                        ❤️ Favorite
                    </button>

                    <button
                        type="button"
                        onclick="deleteProduct(${product.id})"
                    >
                        🗑️ Delete
                    </button>

                </div>

            `;
        }
    );
}


// ==============================
// PRODUCT DETAILS
// ==============================

function displayProductDetails() {

    const productDetails =
        document.getElementById(
            "productDetails"
        );

    if (!productDetails) {
        return;
    }

    const params =
        new URLSearchParams(
            window.location.search
        );

    const productId =
        Number(params.get("id"));

    const product =
        products.find(
            function(product) {

                return product.id === productId;

            }
        );

    if (!product) {

        productDetails.innerHTML =
            "<p>Product not found.</p>";

        return;
    }

    productDetails.innerHTML = `

        <div class="product">

            ${
                product.image
                ?
                `<img
                    src="${product.image}"
                    alt="${product.name}"
                >`
                :
                ""
            }

            <h2>
                ${product.name}
            </h2>

            <p class="price">
                💰 $${product.price}
            </p>

            <p class="category">
                🏷️
                ${product.category || "Other"}
            </p>

            <p class="description">
                ${product.description}
            </p>

            <button
                type="button"
                onclick="addToCart(${product.id})"
            >
                🛒 Add to Cart
            </button>

            <button
                type="button"
                onclick="addToFavorites(${product.id})"
            >
                ❤️ Add to Favorites
            </button>

        </div>

    `;
}


// ==============================
// DELETE PRODUCT
// ==============================

function deleteProduct(productId) {

    products =
        products.filter(
            function(product) {

                return product.id !== productId;

            }
        );

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    alert(
        "Product deleted successfully!"
    );

    displayProducts(products);
}


// ==============================
// SEARCH
// ==============================

function searchProducts() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const searchResults =
        document.getElementById(
            "searchResults"
        );

    if (
        !searchInput ||
        !searchResults
    ) {
        return;
    }

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();

    const results =
        products.filter(
            function(product) {

                return (

                    product.name
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    product.description
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    (product.category || "")
                        .toLowerCase()
                        .includes(searchText)

                );

            }
        );

    displaySearchResults(results);
}


// ==============================
// DISPLAY SEARCH RESULTS
// ==============================

function displaySearchResults(results) {

    const searchResults =
        document.getElementById(
            "searchResults"
        );

    if (!searchResults) {
        return;
    }

    searchResults.innerHTML = "";

    if (results.length === 0) {

        searchResults.innerHTML =
            "<p>No products found.</p>";

        return;
    }

    results.forEach(
        function(product) {

            searchResults.innerHTML += `

                <div class="product">

                    ${
                        product.image
                        ?
                        `<img
                            src="${product.image}"
                            alt="${product.name}"
                        >`
                        :
                        ""
                    }

                    <h3>
                        ${product.name}
                    </h3>

                    <p class="price">
                        💰 $${product.price}
                    </p>

                    <p class="category">
                        🏷️
                        ${product.category || "Other"}
                    </p>

                    <p class="description">
                        ${product.description}
                    </p>

                    <a
                        href="posted-product.html?id=${product.id}"
                    >
                        <button type="button">
                            👀 View Product
                        </button>
                    </a>

                    <button
                        type="button"
                        onclick="addToCart(${product.id})"
                    >
                        🛒 Add to Cart
                    </button>

                    <button
                        type="button"
                        onclick="addToFavorites(${product.id})"
                    >
                        ❤️ Favorite
                    </button>

                </div>

            `;
        }
    );
}


// ==============================
// CATEGORY FILTER
// ==============================

function filterByCategory() {

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );

    if (!categoryFilter) {
        return;
    }

    const category =
        categoryFilter.value;

    if (category === "") {

        displayProducts(products);

        return;
    }

    const filteredProducts =
        products.filter(
            function(product) {

                return product.category === category;

            }
        );

    displayProducts(
        filteredProducts
    );
}


// ==============================
// SORT PRODUCTS
// ==============================

function sortProducts() {

    const sortSelect =
        document.getElementById(
            "sortProducts"
        );

    if (!sortSelect) {
        return;
    }

    const sortValue =
        sortSelect.value;

    let sortedProducts =
        [...products];

    if (sortValue === "newest") {

        sortedProducts.sort(
            function(a, b) {

                return b.id - a.id;

            }
        );
    }

    if (sortValue === "priceLow") {

        sortedProducts.sort(
            function(a, b) {

                return a.price - b.price;

            }
        );
    }

    if (sortValue === "priceHigh") {

        sortedProducts.sort(
            function(a, b) {

                return b.price - a.price;

            }
        );
    }

    if (sortValue === "nameAZ") {

        sortedProducts.sort(
            function(a, b) {

                return a.name.localeCompare(
                    b.name
                );

            }
        );
    }

    displayProducts(
        sortedProducts
    );
}


// ==============================
// CART
// ==============================

function addToCart(productId) {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    const product =
        products.find(
            function(product) {

                return product.id === productId;

            }
        );

    if (!product) {
        return;
    }

    const existingProduct =
        cart.find(
            function(item) {

                return item.id === productId;

            }
        );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    alert(
        product.name +
        " added to cart!"
    );
}


// ==============================
// DISPLAY CART
// ==============================

function displayCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );

    if (!cartItems) {
        return;
    }

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    let total = 0;

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";
    }

    cart.forEach(
        function(product, index) {

            const quantity =
                product.quantity || 1;

            const itemTotal =
                Number(product.price) *
                quantity;

            total += itemTotal;

            cartItems.innerHTML += `

                <div class="product">

                    ${
                        product.image
                        ?
                        `<img
                            src="${product.image}"
                            alt="${product.name}"
                        >`
                        :
                        ""
                    }

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        Price:
                        $${product.price}
                    </p>

                    <p>
                        Quantity:
                        ${quantity}
                    </p>

                    <p>
                        Item Total:
                        $${itemTotal}
                    </p>

                    <button
                        type="button"
                        onclick="decreaseQuantity(${index})"
                    >
                        ➖
                    </button>

                    <button
                        type="button"
                        onclick="increaseQuantity(${index})"
                    >
                        ➕
                    </button>

                    <button
                        type="button"
                        onclick="removeFromCart(${index})"
                    >
                        Remove
                    </button>

                </div>

            `;
        }
    );

    const cartTotal =
        document.getElementById(
            "cartTotal"
        );

    if (cartTotal) {

        cartTotal.textContent =
            "Total: $" + total;

    }

    updateCartCount();
}


// ==============================
// INCREASE QUANTITY
// ==============================

function increaseQuantity(index) {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    cart[index].quantity =
        (cart[index].quantity || 1) + 1;

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}


// ==============================
// DECREASE QUANTITY
// ==============================

function decreaseQuantity(index) {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    cart[index].quantity =
        (cart[index].quantity || 1) - 1;

    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(index, 1);

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}


// ==============================
// REMOVE FROM CART
// ==============================

function removeFromCart(index) {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}


// ==============================
// CART COUNT
// ==============================

function updateCartCount() {

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    if (!cartCount) {
        return;
    }

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    let count = 0;

    cart.forEach(
        function(product) {

            count +=
                product.quantity || 1;

        }
    );

    cartCount.textContent =
        count;
}


// ==============================
// CHECKOUT
// ==============================

function displayCheckout() {

    const checkoutItems =
        document.getElementById(
            "checkoutItems"
        );

    if (!checkoutItems) {
        return;
    }

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    let total = 0;

    checkoutItems.innerHTML = "";

    if (cart.length === 0) {

        checkoutItems.innerHTML =
            "<p>Your cart is empty.</p>";
    }

    cart.forEach(
        function(product) {

            const quantity =
                product.quantity || 1;

            const itemTotal =
                Number(product.price) *
                quantity;

            total += itemTotal;

            checkoutItems.innerHTML += `

                <div class="product">

                    ${
                        product.image
                        ?
                        `<img
                            src="${product.image}"
                            alt="${product.name}"
                        >`
                        :
                        ""
                    }

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        Price per item:
                        $${product.price}
                    </p>

                    <p>
                        Quantity:
                        ${quantity}
                    </p>

                    <p>
                        Item Total:
                        $${itemTotal}
                    </p>

                </div>

            `;
        }
    );

    const checkoutTotal =
        document.getElementById(
            "checkoutTotal"
        );

    if (checkoutTotal) {

        checkoutTotal.textContent =
            "Order Total: $" + total;

    }

    updateCheckoutTotal();
}


// ==============================
// CHECKOUT TOTAL
// ==============================

function updateCheckoutTotal() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    let total = 0;

    cart.forEach(
        function(product) {

            const quantity =
                product.quantity || 1;

            total +=
                Number(product.price) *
                quantity;

        }
    );

    const shippingMethod =
        document.getElementById(
            "shippingMethod"
        );

    const shippingCost =
        shippingMethod
        ?
        Number(shippingMethod.value)
        :
        0;

    total += shippingCost;

    const checkoutTotal =
        document.getElementById(
            "checkoutTotal"
        );

    if (checkoutTotal) {

        checkoutTotal.textContent =
            "Order Total: $" + total;

    }
}


// ==============================
// PLACE ORDER
// ==============================

function placeOrder() {

    const nameInput =
        document.getElementById(
            "customerName"
        );

    const emailInput =
        document.getElementById(
            "customerEmail"
        );

    const shippingMethod =
        document.getElementById(
            "shippingMethod"
        );

    if (
        !nameInput ||
        !emailInput ||
        !shippingMethod
    ) {
        return;
    }

    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim();

    if (
        name === "" ||
        email === ""
    ) {

        alert(
            "Please enter your name and email."
        );

        return;
    }

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }

    const shippingCost =
        Number(
            shippingMethod.value
        );

    const shippingText =
        shippingMethod.options[
            shippingMethod.selectedIndex
        ].text;

    let total = 0;

    cart.forEach(
        function(product) {

            const quantity =
                product.quantity || 1;

            total +=
                Number(product.price) *
                quantity;

        }
    );

    total += shippingCost;

    const order = {

        id: Date.now(),

        name: name,

        email: email,

        products: cart,

        shippingMethod:
            shippingText,

        shippingCost:
            shippingCost,

        total: total,

        date:
            new Date()
                .toLocaleDateString(),

        time:
            new Date()
                .toLocaleTimeString(),

        status:
            "Order Placed"

    };

    localStorage.setItem(
        "lastOrder",
        JSON.stringify(order)
    );

    let orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];

    orders.push(order);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    localStorage.removeItem(
        "cart"
    );

    alert(
        "Order placed successfully! Thank you, "
        + name
        + "!"
    );

    window.location.href =
        "order-confirmation.html";
}


// ==============================
// ORDER CONFIRMATION
// ==============================

function displayOrderConfirmation() {

    const orderConfirmation =
        document.getElementById(
            "orderConfirmation"
        );

    if (!orderConfirmation) {
        return;
    }

    const order =
        JSON.parse(
            localStorage.getItem("lastOrder")
        );

    if (!order) {

        orderConfirmation.innerHTML =
            "<p>No recent order found.</p>";

        return;
    }

    let productsHTML = "";

    order.products.forEach(
        function(product) {

            const quantity =
                product.quantity || 1;

            const itemTotal =
                Number(product.price) *
                quantity;

            productsHTML += `

                <div class="product">

                    ${
                        product.image
                        ?
                        `<img
                            src="${product.image}"
                            alt="${product.name}"
                        >`
                        :
                        ""
                    }

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        Quantity:
                        ${quantity}
                    </p>

                    <p>
                        Item Total:
                        $${itemTotal}
                    </p>

                </div>

            `;
        }
    );

    orderConfirmation.innerHTML = `

        <div class="product">

            <h2>
                🎉 Order Confirmed!
            </h2>

            <p>
                <strong>Name:</strong>
                ${order.name}
            </p>

            <p>
                <strong>Email:</strong>
                ${order.email}
            </p>

            <p>
                <strong>Date:</strong>
                ${order.date}
            </p>

            <p>
                <strong>Time:</strong>
                ${order.time}
            </p>

            <p>
                <strong>Status:</strong>
                ${order.status}
            </p>

            <p>
                <strong>Shipping:</strong>
                ${order.shippingMethod}
            </p>

            <h3>
                Total:
                $${order.total}
            </h3>

        </div>

        ${productsHTML}

    `;
}


// ==============================
// ORDER HISTORY
// ==============================

function displayOrderHistory() {

    const orderHistory =
        document.getElementById(
            "orderHistory"
        );

    if (!orderHistory) {
        return;
    }

    const orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];

    orderHistory.innerHTML = "";

    if (orders.length === 0) {

        orderHistory.innerHTML =
            "<p>No orders yet.</p>";

        return;
    }

    orders.forEach(
        function(order, index) {

            let productsHTML = "";

            order.products.forEach(
                function(product) {

                    const quantity =
                        product.quantity || 1;

                    const itemTotal =
                        Number(product.price) *
                        quantity;

                    productsHTML += `

                        <div>

                            <p>
                                <strong>
                                    ${product.name}
                                </strong>
                            </p>

                            <p>
                                Quantity:
                                ${quantity}
                            </p>

                            <p>
                                Item Total:
                                $${itemTotal}
                            </p>

                        </div>

                    `;
                }
            );

            orderHistory.innerHTML += `

                <div class="product">

                    <h2>
                        📦 Order #${index + 1}
                    </h2>

                    <p>
                        Date:
                        ${order.date}
                    </p>

                    <p>
                        Time:
                        ${order.time}
                    </p>

                    <p>
                        Customer:
                        ${order.name}
                    </p>

                    <p>
                        Email:
                        ${order.email}
                    </p>

                    <p>
                        Shipping:
                        ${order.shippingMethod}
                    </p>

                    <p>
                        Total:
                        $${order.total}
                    </p>

                    <label>
                        Status:
                    </label>

                    <select
                        onchange="
                            updateOrderStatus(
                                ${order.id},
                                this.value
                            )
                        "
                    >

                        <option
                            value="Order Placed"
                            ${
                                order.status ===
                                "Order Placed"
                                ?
                                "selected"
                                :
                                ""
                            }
                        >
                            Order Placed
                        </option>

                        <option
                            value="Processing"
                            ${
                                order.status ===
                                "Processing"
                                ?
                                "selected"
                                :
                                ""
                            }
                        >
                            Processing
                        </option>

                        <option
                            value="Shipped"
                            ${
                                order.status ===
                                "Shipped"
                                ?
                                "selected"
                                :
                                ""
                            }
                        >
                            Shipped
                        </option>

                        <option
                            value="Delivered"
                            ${
                                order.status ===
                                "Delivered"
                                ?
                                "selected"
                                :
                                ""
                            }
                        >
                            Delivered
                        </option>

                    </select>

                    <h3>
                        Products
                    </h3>

                    ${productsHTML}

                </div>

            `;
        }
    );
}


// ==============================
// UPDATE ORDER STATUS
// ==============================

function updateOrderStatus(
    orderId,
    newStatus
) {

    let orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];

    orders =
        orders.map(
            function(order) {

                if (
                    order.id === orderId
                ) {

                    order.status =
                        newStatus;

                }

                return order;

            }
        );

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    const lastOrder =
        JSON.parse(
            localStorage.getItem(
                "lastOrder"
            )
        );

    if (
        lastOrder &&
        lastOrder.id === orderId
    ) {

        lastOrder.status =
            newStatus;

        localStorage.setItem(
            "lastOrder",
            JSON.stringify(lastOrder)
        );

    }

    displayOrderHistory();
}


// ==============================
// FAVORITES
// ==============================

function addToFavorites(productId) {

    let favorites =
        JSON.parse(
            localStorage.getItem(
                "favorites"
            )
        ) || [];

    const product =
        products.find(
            function(product) {

                return product.id === productId;

            }
        );

    if (!product) {
        return;
    }

    const alreadyFavorite =
        favorites.some(
            function(favorite) {

                return favorite.id === productId;

            }
        );

    if (alreadyFavorite) {

        alert(
            "This product is already in your favorites."
        );

        return;
    }

    favorites.push(product);

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    updateFavoritesCount();

    alert(
        product.name +
        " added to favorites!"
    );
}


// ==============================
// FAVORITES COUNT
// ==============================

function updateFavoritesCount() {

    const favoritesCount =
        document.getElementById(
            "favoritesCount"
        );

    if (!favoritesCount) {
        return;
    }

    const favorites =
        JSON.parse(
            localStorage.getItem(
                "favorites"
            )
        ) || [];

    favoritesCount.textContent =
        favorites.length;
}


// ==============================
// DISPLAY FAVORITES
// ==============================

function displayFavorites() {

    const favoriteItems =
        document.getElementById(
            "favoriteItems"
        );

    if (!favoriteItems) {
        return;
    }

    const favorites =
        JSON.parse(
            localStorage.getItem(
                "favorites"
            )
        ) || [];

    favoriteItems.innerHTML = "";

    if (favorites.length === 0) {

        favoriteItems.innerHTML =
            "<p>You have no favorite products yet.</p>";

        return;
    }

    favorites.forEach(
        function(product) {

            favoriteItems.innerHTML += `

                <div class="product">

                    ${
                        product.image
                        ?
                        `<img
                            src="${product.image}"
                            alt="${product.name}"
                        >`
                        :
                        ""
                    }

                    <h3>
                        ${product.name}
                    </h3>

                    <p class="price">
                        💰 $${product.price}
                    </p>

                    <p class="category">
                        🏷️
                        ${product.category || "Other"}
                    </p>

                    <p class="description">
                        ${product.description}
                    </p>

                    <a
                        href="posted-product.html?id=${product.id}"
                    >
                        <button type="button">
                            👀 View Product
                        </button>
                    </a>

                    <button
                        type="button"
                        onclick="addToCart(${product.id})"
                    >
                        🛒 Add to Cart
                    </button>

                    <button
                        type="button"
                        onclick="
                            removeFromFavorites(
                                ${product.id}
                            )
                        "
                    >
                        ❌ Remove from Favorites
                    </button>

                </div>

            `;
        }
    );
}


// ==============================
// REMOVE FAVORITE
// ==============================

function removeFromFavorites(productId) {

    let favorites =
        JSON.parse(
            localStorage.getItem(
                "favorites"
            )
        ) || [];

    favorites =
        favorites.filter(
            function(product) {

                return product.id !== productId;

            }
        );

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    displayFavorites();

    updateFavoritesCount();
}


// ==============================
// RATINGS
// ==============================

function rateProduct() {

    const ratingInput =
        document.getElementById(
            "productRating"
        );

    if (!ratingInput) {
        return;
    }

    const rating =
        Number(
            ratingInput.value
        );

    if (rating === 0) {

        alert(
            "Please choose a rating."
        );

        return;
    }

    const params =
        new URLSearchParams(
            window.location.search
        );

    const productId =
        Number(
            params.get("id")
        );

    let ratings =
        JSON.parse(
            localStorage.getItem(
                "ratings"
            )
        ) || {};

    if (!ratings[productId]) {

        ratings[productId] = [];

    }

    ratings[productId].push(
        rating
    );

    localStorage.setItem(
        "ratings",
        JSON.stringify(ratings)
    );

    ratingInput.value = "";

    displayRating(productId);

    alert(
        "Rating submitted!"
    );
}


// ==============================
// DISPLAY RATING
// ==============================

function displayRating(productId) {

    const ratingResult =
        document.getElementById(
            "ratingResult"
        );

    if (!ratingResult) {
        return;
    }

    const ratings =
        JSON.parse(
            localStorage.getItem(
                "ratings"
            )
        ) || {};

    const productRatings =
        ratings[productId] || [];

    if (
        productRatings.length === 0
    ) {

        ratingResult.innerHTML =
            "<p>No ratings yet.</p>";

        return;
    }

    let total = 0;

    productRatings.forEach(
        function(rating) {

            total += rating;

        }
    );

    const average =
        total /
        productRatings.length;

    ratingResult.innerHTML = `

        <h3>
            Average Rating:
            ${average.toFixed(1)}
            ⭐
        </h3>

        <p>
            Number of ratings:
            ${productRatings.length}
        </p>

    `;
}


// ==============================
// CREATE ACCOUNT
// ==============================

function createAccount() {

    const nameInput =
        document.getElementById(
            "signupName"
        );

    const emailInput =
        document.getElementById(
            "signupEmail"
        );

    const passwordInput =
        document.getElementById(
            "signupPassword"
        );

    if (
        !nameInput ||
        !emailInput ||
        !passwordInput
    ) {
        return;
    }

    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    if (
        name === "" ||
        email === "" ||
        password === ""
    ) {

        alert(
            "Please fill in all account fields."
        );

        return;
    }

    const account = {

        name: name,

        email: email,

        password: password

    };

    localStorage.setItem(
        "account",
        JSON.stringify(account)
    );

    alert(
        "Account created successfully!"
    );

    nameInput.value = "";

    emailInput.value = "";

    passwordInput.value = "";
}


// ==============================
// LOGIN
// ==============================

function loginUser() {

    const emailInput =
        document.getElementById(
            "loginEmail"
        );

    const passwordInput =
        document.getElementById(
            "loginPassword"
        );

    if (
        !emailInput ||
        !passwordInput
    ) {
        return;
    }

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    const account =
        JSON.parse(
            localStorage.getItem(
                "account"
            )
        );

    if (!account) {

        alert(
            "No account found. Please create an account first."
        );

        return;
    }

    if (
        email === account.email &&
        password === account.password
    ) {

        localStorage.setItem(
            "loggedIn",
            "true"
        );

        alert(
            "Login successful! Welcome, "
            + account.name
            + "!"
        );

        window.location.href =
            "index.html";

    } else {

        alert(
            "Incorrect email or password."
        );

    }
}


// ==============================
// LOGIN STATUS
// ==============================

function updateLoginStatus() {

    const loginLink =
        document.querySelector(
            'a[href="login.html"]'
        );

    if (!loginLink) {
        return;
    }

    const account =
        JSON.parse(
            localStorage.getItem(
                "account"
            )
        );

    const loggedIn =
        localStorage.getItem(
            "loggedIn"
        );

    if (
        loggedIn === "true" &&
        account
    ) {

        loginLink.textContent =
            "🚪 Logout";

        loginLink.href =
            "#";

        loginLink.onclick =
            function(event) {

                event.preventDefault();

                logoutUser();

            };

    } else {

        loginLink.textContent =
            "👤 Login";

        loginLink.href =
            "login.html";

        loginLink.onclick =
            null;

    }
}


// ==============================
// LOGOUT
// ==============================

function logoutUser() {

    localStorage.removeItem(
        "loggedIn"
    );

    alert(
        "You have been logged out."
    );

    updateLoginStatus();
}


// ==============================
// PROFILE
// ==============================

function displayProfile() {

    const profileName =
        document.getElementById(
            "profileName"
        );

    const profileEmail =
        document.getElementById(
            "profileEmail"
        );

    const profileStatus =
        document.getElementById(
            "profileStatus"
        );

    if (
        !profileName ||
        !profileEmail ||
        !profileStatus
    ) {
        return;
    }

    const account =
        JSON.parse(
            localStorage.getItem(
                "account"
            )
        );

    const loggedIn =
        localStorage.getItem(
            "loggedIn"
        );

    if (
        !account ||
        loggedIn !== "true"
    ) {

        profileName.textContent =
            "Not logged in";

        profileEmail.textContent =
            "Not available";

        profileStatus.textContent =
            "Not logged in";

        return;
    }


    // Fill edit boxes
    const editName =
        document.getElementById(
            "editName"
        );

    const editEmail =
        document.getElementById(
            "editEmail"
        );

    if (editName) {

        editName.value =
            account.name;

    }

    if (editEmail) {

        editEmail.value =
            account.email;

    }


    // Display account information
    profileName.textContent =
        account.name;

    profileEmail.textContent =
        account.email;

    profileStatus.textContent =
        "Logged in ✅";
}


// ==============================
// UPDATE PROFILE
// ==============================

function updateProfile() {

    const editName =
        document.getElementById(
            "editName"
        );

    const editEmail =
        document.getElementById(
            "editEmail"
        );

    const editPassword =
        document.getElementById(
            "editPassword"
        );

    if (
        !editName ||
        !editEmail ||
        !editPassword
    ) {
        return;
    }

    const name =
        editName.value.trim();

    const email =
        editEmail.value.trim();

    const password =
        editPassword.value;

    if (
        name === "" ||
        email === ""
    ) {

        alert(
            "Please enter your name and email."
        );

        return;
    }

    const account =
        JSON.parse(
            localStorage.getItem(
                "account"
            )
        );

    if (!account) {

        alert(
            "No account found."
        );

        return;
    }

    account.name =
        name;

    account.email =
        email;

    if (password !== "") {

        account.password =
            password;

    }

    localStorage.setItem(
        "account",
        JSON.stringify(account)
    );

    alert(
        "Profile updated successfully! ✅"
    );

    displayProfile();

    editPassword.value = "";
}


// ==============================
// DELETE ACCOUNT
// ==============================

function deleteAccount() {

    const account =
        JSON.parse(
            localStorage.getItem(
                "account"
            )
        );

    if (!account) {

        alert(
            "No account found."
        );

        return;
    }

    const confirmed =
        confirm(
            "Are you sure you want to delete your account?"
        );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(
        "account"
    );

    localStorage.removeItem(
        "loggedIn"
    );

    alert(
        "Your account has been deleted."
    );

    window.location.href =
        "index.html";
}


// ==============================
// POST BUTTON
// ==============================

const postButton =
    document.getElementById(
        "postButton"
    );

if (postButton) {

    postButton.addEventListener(
        "click",
        postItem
    );

}


// ==============================
// STARTUP
// ==============================

displayProducts(products);

displayProductDetails();

displayCart();

displayCheckout();

displayOrderHistory();

displayFavorites();

displayOrderConfirmation();

displayProfile();

updateCartCount();

updateFavoritesCount();

updateLoginStatus();


const ratingParams =
    new URLSearchParams(
        window.location.search
    );

const ratingProductId =
    Number(
        ratingParams.get("id")
    );

if (ratingProductId) {

    displayRating(
        ratingProductId
    );

}