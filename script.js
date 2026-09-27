// ======================================================
// SUPABASE SETUP
// ======================================================

const SUPABASE_URL = "https://aanpcyrquzllvqjmcbzw.supabase.co";

const SUPABASE_KEY = "sb_publishable_pH9T1TtZ5Jx8RmGvzqWhJg_huBuXipE";
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ======================================================
// GLOBAL VARIABLES
// ======================================================

let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


// ======================================================
// LOAD PRODUCTS FROM SUPABASE
// ======================================================

async function loadProducts() {

    const { data: products, error } = await supabaseClient
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Products loading error:", error);
        allProducts = [];
        return;
    }

    allProducts = products || [];

    console.log("Products loaded:", allProducts);

    displayProducts(allProducts);
}


// ======================================================
// DISPLAY PRODUCTS ON HOMEPAGE
// ======================================================

function displayProducts(products = allProducts) {

    const productList = document.getElementById("product-list");

    if (!productList) {
        return;
    }

    if (!products || products.length === 0) {
        productList.innerHTML = `
            <p>No products found.</p>
        `;
        return;
    }

    productList.innerHTML = products.map(product => {

        const isFavorite = favorites.includes(String(product.id));

        return `
            <div class="product-card">

                <img
                    src="${product.image_url || "https://via.placeholder.com/300"}"
                    alt="${product.name}"
                >

                <h3>${product.name}</h3>

                <p>
                    €${Number(product.price).toFixed(2)}
                </p>

                <p>
                    ${product.category || "Other"}
                </p>

                <div class="product-buttons">

                    <a href="product.html?id=${product.id}">
                        👀 View Product
                    </a>

                    <button onclick="addToCart(${product.id})">
                        🛒 Add to Cart
                    </button>

                    <button onclick="toggleFavorite(${product.id})">
                        ${isFavorite ? "💔 Remove Favorite" : "❤️ Favorite"}
                    </button>

                </div>

            </div>
        `;

    }).join("");
}


// ======================================================
// PRODUCT DETAILS PAGE
// ======================================================

async function displayProductDetails() {

    const container = document.getElementById("productDetails");

    if (!container) {
        return;
    }

    const params = new URLSearchParams(window.location.search);

    const productId = params.get("id");

    console.log("Product ID:", productId);

    if (!productId) {

        container.innerHTML = `
            <p>Product not found.</p>
        `;

        return;
    }

    container.innerHTML = `
        <p>Loading product...</p>
    `;

    const { data: product, error } = await supabaseClient
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

    if (error) {

        console.error("Product loading error:", error);

        container.innerHTML = `
            <p>Product not found.</p>
        `;

        return;
    }

    if (!product) {

        container.innerHTML = `
            <p>Product not found.</p>
        `;

        return;
    }

    const isFavorite = favorites.includes(String(product.id));

    container.innerHTML = `

        <div class="product-details">

            <img
                src="${product.image_url || "https://via.placeholder.com/400"}"
                alt="${product.name}"
                class="product-detail-image"
            >

            <div class="product-info">

                <h2>${product.name}</h2>

                <h3>
                    €${Number(product.price).toFixed(2)}
                </h3>

                <p>
                    <strong>Category:</strong>
                    ${product.category || "Other"}
                </p>

                <p>
                    ${product.description || "No description available."}
                </p>

                <button onclick="addToCart(${product.id})">
                    🛒 Add to Cart
                </button>

                <button onclick="toggleFavorite(${product.id})">
                    ${isFavorite ? "💔 Remove Favorite" : "❤️ Add to Favorites"}
                </button>

            </div>

        </div>

    `;
}


// ======================================================
// SEARCH
// ======================================================

function searchProducts() {

    const searchInput = document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }

    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    if (!searchText) {

        displayProducts(allProducts);

        return;
    }

    const filteredProducts = allProducts.filter(product => {

        return (
            (product.name || "").toLowerCase().includes(searchText) ||
            (product.description || "").toLowerCase().includes(searchText) ||
            (product.category || "").toLowerCase().includes(searchText)
        );

    });

    displayProducts(filteredProducts);
}


// ======================================================
// CATEGORY FILTER
// ======================================================

function filterByCategory() {

    const categoryFilter =
        document.getElementById("categoryFilter");

    if (!categoryFilter) {
        return;
    }

    const category = categoryFilter.value;

    if (!category) {

        displayProducts(allProducts);

        return;
    }

    const filteredProducts = allProducts.filter(product => {

        return product.category === category;

    });

    displayProducts(filteredProducts);
}


// ======================================================
// SORT PRODUCTS
// ======================================================

function sortProducts() {

    const sortSelect =
        document.getElementById("sortProducts");

    if (!sortSelect) {
        return;
    }

    const sortValue = sortSelect.value;

    let products = [...allProducts];

    if (sortValue === "priceLow") {

        products.sort((a, b) =>
            Number(a.price) - Number(b.price)
        );

    }

    else if (sortValue === "priceHigh") {

        products.sort((a, b) =>
            Number(b.price) - Number(a.price)
        );

    }

    else if (sortValue === "nameAZ") {

        products.sort((a, b) =>
            (a.name || "").localeCompare(b.name || "")
        );

    }

    else if (sortValue === "newest") {

        products.sort((a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at)
        );

    }

    displayProducts(products);
}


// ======================================================
// CART
// ======================================================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


function addToCart(productId) {

    const product = allProducts.find(
        p => String(p.id) === String(productId)
    );

    if (!product) {

        alert("Product not found.");

        return;
    }

    const existingItem = cart.find(
        item => String(item.id) === String(productId)
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image_url: product.image_url,
            quantity: 1
        });

    }

    saveCart();

    alert("Product added to cart! 🛒");
}


function removeFromCart(productId) {

    cart = cart.filter(
        item => String(item.id) !== String(productId)
    );

    saveCart();

    displayCart();
}


function changeCartQuantity(productId, change) {

    const item = cart.find(
        item => String(item.id) === String(productId)
    );

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;
    }

    saveCart();

    displayCart();
}


function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }

    const count = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    cartCount.textContent = count;
}


// ======================================================
// DISPLAY CART
// ======================================================

function displayCart() {

    const cartContainer =
        document.getElementById("cartItems");

    if (!cartContainer) {
        return;
    }

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        return;
    }

    cartContainer.innerHTML = cart.map(item => {

        return `
            <div class="cart-item">

                <img
                    src="${item.image_url || "https://via.placeholder.com/150"}"
                    alt="${item.name}"
                >

                <div>

                    <h3>${item.name}</h3>

                    <p>
                        €${Number(item.price).toFixed(2)}
                    </p>

                    <button
                        onclick="changeCartQuantity(${item.id}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeCartQuantity(${item.id}, 1)"
                    >
                        +
                    </button>

                    <button
                        onclick="removeFromCart(${item.id})"
                    >
                        🗑️ Remove
                    </button>

                </div>

            </div>
        `;

    }).join("");
}


// ======================================================
// FAVORITES
// ======================================================

function saveFavorites() {

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    updateFavoritesCount();
}


function toggleFavorite(productId) {

    const id = String(productId);

    if (favorites.includes(id)) {

        favorites = favorites.filter(
            item => item !== id
        );

    } else {

        favorites.push(id);

    }

    saveFavorites();

    displayProducts(allProducts);

    displayProductDetails();
}


function addToFavorites(productId) {

    const id = String(productId);

    if (!favorites.includes(id)) {

        favorites.push(id);

        saveFavorites();

        alert("Added to favorites ❤️");
    }
}


function updateFavoritesCount() {

    const favoritesCount =
        document.getElementById("favoritesCount");

    if (!favoritesCount) {
        return;
    }

    favoritesCount.textContent =
        favorites.length;
}


function displayFavorites() {

    const container =
        document.getElementById("favoritesList");

    if (!container) {
        return;
    }

    const favoriteProducts =
        allProducts.filter(product =>
            favorites.includes(String(product.id))
        );

    if (favoriteProducts.length === 0) {

        container.innerHTML = `
            <p>No favorite products yet.</p>
        `;

        return;
    }

    container.innerHTML =
        favoriteProducts.map(product => {

            return `
                <div class="product-card">

                    <img
                        src="${product.image_url || "https://via.placeholder.com/300"}"
                        alt="${product.name}"
                    >

                    <h3>${product.name}</h3>

                    <p>
                        €${Number(product.price).toFixed(2)}
                    </p>

                    <a href="product.html?id=${product.id}">
                        👀 View Product
                    </a>

                    <button
                        onclick="toggleFavorite(${product.id})"
                    >
                        💔 Remove
                    </button>

                </div>
            `;

        }).join("");
}


// ======================================================
// SIGN UP
// ======================================================

async function signupUser() {

    const name =
        document.getElementById("name")?.value.trim();

    const email =
        document.getElementById("email")?.value.trim();

    const password =
        document.getElementById("password")?.value;

    if (!name || !email || !password) {

        alert("Please fill in all fields.");

        return;
    }

    if (password.length < 6) {

        alert("Password must be at least 6 characters.");

        return;
    }

    const { data, error } =
        await supabaseClient.auth.signUp({

            email: email,

            password: password,

            options: {
                data: {
                    name: name
                }
            }

        });

    if (error) {

        console.error(error);

        alert(error.message);

        return;
    }

    if (data.user) {

        const { error: profileError } =
            await supabaseClient
                .from("profiles")
                .upsert({
                    id: data.user.id,
                    name: name,
                    email: email
                });

        if (profileError) {

            console.error(
                "Profile creation error:",
                profileError
            );

        }
    }

    alert("Account created successfully! 🎉");

    window.location.href = "index.html";
}


// ======================================================
// CREATE ACCOUNT ALIAS
// ======================================================

function createAccount() {

    signupUser();
}


// ======================================================
// LOGIN
// ======================================================

async function loginUser() {

    const email =
        document.getElementById("loginEmail")?.value.trim();

    const password =
        document.getElementById("loginPassword")?.value;

    if (!email || !password) {

        alert("Please enter your email and password.");

        return;
    }

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });

    if (error) {

        console.error(error);

        alert(error.message);

        return;
    }

    alert("Login successful! 🎉");

    window.location.href = "index.html";
}


// ======================================================
// LOGOUT
// ======================================================

async function logoutUser() {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {

        console.error(error);

        alert(error.message);

        return;
    }

    window.location.href = "index.html";
}


// ======================================================
// LOGIN STATUS
// ======================================================

async function updateLoginStatus() {

    const loginLinks =
        document.querySelectorAll(
            'a[href="login.html"]'
        );

    const { data: { user } } =
        await supabaseClient.auth.getUser();

    loginLinks.forEach(link => {

        if (user) {

            link.textContent = "👤 Profile";

            link.href = "profile.html";

        } else {

            link.textContent = "👤 Login";

            link.href = "login.html";

        }

    });
}


// ======================================================
// PROFILE
// ======================================================

async function displayProfile() {

    const nameElement =
        document.getElementById("profileName");

    const emailElement =
        document.getElementById("profileEmail");

    const statusElement =
        document.getElementById("profileStatus");

    if (
        !nameElement ||
        !emailElement ||
        !statusElement
    ) {
        return;
    }

    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {

        nameElement.textContent = "Not logged in";
        emailElement.textContent = "Not logged in";
        statusElement.textContent = "Please log in";

        return;
    }

    const { data: profile, error: profileError } =
        await supabaseClient
            .from("profiles")
            .select("name, email")
            .eq("id", user.id)
            .single();

    if (profileError) {

        console.error(profileError);

        nameElement.textContent =
            user.user_metadata?.name || "User";

        emailElement.textContent =
            user.email || "";

        statusElement.textContent =
            "Logged in";

        return;
    }

    nameElement.textContent =
        profile.name || "User";

    emailElement.textContent =
        profile.email || user.email || "";

    statusElement.textContent =
        "Logged in";
}


// ======================================================
// UPDATE PROFILE
// ======================================================

async function updateProfile() {

    const name =
        document.getElementById("editName")?.value.trim();

    const email =
        document.getElementById("editEmail")?.value.trim();

    const password =
        document.getElementById("editPassword")?.value;

    if (!name || !email) {

        alert("Please enter your name and email.");

        return;
    }

    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {

        alert("Please log in first.");

        return;
    }

    const { error: profileError } =
        await supabaseClient
            .from("profiles")
            .update({
                name: name,
                email: email
            })
            .eq("id", user.id);

    if (profileError) {

        console.error(profileError);

        alert("Could not update your profile.");

        return;
    }

    if (email !== user.email) {

        const { error: emailError } =
            await supabaseClient.auth.updateUser({
                email: email
            });

        if (emailError) {

            console.error(emailError);

            alert(emailError.message);

            return;
        }
    }

    if (password) {

        if (password.length < 6) {

            alert(
                "New password must be at least 6 characters."
            );

            return;
        }

        const { error: passwordError } =
            await supabaseClient.auth.updateUser({
                password: password
            });

        if (passwordError) {

            console.error(passwordError);

            alert(passwordError.message);

            return;
        }
    }

    document.getElementById("editPassword").value = "";

    alert("Profile updated successfully! 🎉");

    await displayProfile();
}


// ======================================================
// ORDERS
// ======================================================

async function placeOrder() {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {

        alert("Please log in before placing an order.");

        window.location.href = "login.html";

        return;
    }

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }

    const customerName =
        document.getElementById("customerName")?.value.trim();

    const customerEmail =
        document.getElementById("customerEmail")?.value.trim();

    const shippingElement =
        document.getElementById("shipping");

    const shipping =
        shippingElement
            ? Number(shippingElement.value)
            : 0;

    if (!customerName || !customerEmail) {

        alert("Please enter your customer information.");

        return;
    }

    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.price) *
                Number(item.quantity),
            0
        );

    const total =
        subtotal + shipping;

    const { data: order, error } =
        await supabaseClient
            .from("orders")
            .insert({
                user_id: user.id,
                customer_name: customerName,
                customer_email: customerEmail,
                items: cart,
                shipping: shipping,
                total: total
            })
            .select()
            .single();

    if (error) {

        console.error(error);

        alert("Could not place order.");

        return;
    }

    localStorage.setItem(
        "lastOrder",
        JSON.stringify(order)
    );

    cart = [];

    saveCart();

    window.location.href =
        "order-confirmation.html";
}


// ======================================================
// ORDER HISTORY
// ======================================================

async function displayOrderHistory() {

    const container =
        document.getElementById("orderHistory");

    if (!container) {
        return;
    }

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {

        container.innerHTML = `
            <p>Please log in to view your orders.</p>
        `;

        return;
    }

    const { data: orders, error } =
        await supabaseClient
            .from("orders")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", {
                ascending: false
            });

    if (error) {

        console.error(error);

        container.innerHTML = `
            <p>Could not load your orders.</p>
        `;

        return;
    }

    if (!orders || orders.length === 0) {

        container.innerHTML = `
            <p>You have no orders yet.</p>
        `;

        return;
    }

    container.innerHTML = orders.map(order => {

        const items =
            Array.isArray(order.items)
                ? order.items
                : [];

        return `
            <div class="order-card">

                <h3>
                    Order #${order.id}
                </h3>

                <p>
                    ${new Date(order.created_at).toLocaleString()}
                </p>

                <p>
                    <strong>Total:</strong>
                    €${Number(order.total).toFixed(2)}
                </p>

                <div>

                    ${items.map(item => `
                        <p>
                            ${item.name}
                            × ${item.quantity}
                        </p>
                    `).join("")}

                </div>

            </div>
        `;

    }).join("");
}


// ======================================================
// PRODUCT IMAGE UPLOAD + POST PRODUCT
// ======================================================

async function postItem(event) {

    // Stop the form from refreshing the page
    if (event) {
        event.preventDefault();
    }

    const name =
        document.getElementById("productName").value.trim();

    const price =
        Number(document.getElementById("productPrice").value);

    const category =
        document.getElementById("productCategory").value;

    const description =
        document.getElementById("productDescription").value.trim();

    const imageInput =
        document.getElementById("productImage");

    if (!name || !price || !category) {
        alert("Please enter the product name, price and category.");
        return;
    }

    // Make sure the user is logged in
    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        alert("Please log in before posting a product.");
        window.location.href = "login.html";
        return;
    }

    let imageUrl = null;

    // ==================================================
    // UPLOAD IMAGE
    // ==================================================

    if (imageInput && imageInput.files.length > 0) {

        const file = imageInput.files[0];

        const fileExtension =
            file.name.split(".").pop().toLowerCase();

        const fileName =
            `${user.id}-${Date.now()}.${fileExtension}`;

        console.log("Uploading image:", fileName);

        const {
            error: uploadError
        } = await supabaseClient.storage
            .from("product-images")
            .upload(fileName, file);

        if (uploadError) {

            console.error(
                "Image upload failed:",
                uploadError
            );

            // Don't stop the product from being posted
            console.log(
                "Continuing without product image."
            );

        } else {

            const {
                data: publicUrlData
            } = supabaseClient.storage
                .from("product-images")
                .getPublicUrl(fileName);

            imageUrl =
                publicUrlData.publicUrl;

            console.log(
                "Image uploaded:",
                imageUrl
            );
        }
    }

    // ==================================================
    // SAVE PRODUCT TO SUPABASE
    // ==================================================

    console.log("Saving product to Supabase...");

    const {
        data: product,
        error: productError
    } = await supabaseClient
        .from("products")
        .insert({
            name: name,
            price: price,
            description: description,
            category: category,
            image_url: imageUrl
        })
        .select()
        .single();

    if (productError) {

        console.error(
            "Product insert failed:",
            productError
        );

        alert(
            "The product could not be saved. Check the browser console."
        );

        return;
    }

    console.log(
        "Product successfully saved:",
        product
    );

    alert("Product posted successfully! 🎉");

    // Go back to marketplace
    window.location.href = "index.html";
}

// ======================================================
// INITIALIZE WEBSITE
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadProducts();

        await displayProductDetails();

        await displayProfile();

        await displayOrderHistory();

        displayCart();

        displayFavorites();

        updateCartCount();

        updateFavoritesCount();

        await updateLoginStatus();

    }
);