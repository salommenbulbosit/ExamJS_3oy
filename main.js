document.addEventListener("DOMContentLoaded", () => {
    const productsContainer = document.getElementById("products");
    const loadingIndicator = document.getElementById("loading");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceSort = document.getElementById("priceSort");
    const searchInput = document.getElementById("search");
    const searchButton = document.getElementById("searchButton");
    const themeToggle = document.getElementById("theme-toggle");
    let productsData = [];

    async function fetchProducts() {
        try {
            const response = await fetch("https://fakestoreapi.com/products");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            productsData = await response.json();
            console.log("Fetched products:", productsData);
            renderProducts(productsData);
            populateCategories(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
            productsContainer.innerHTML = "<p>Error loading products. Please try again later.</p>";
        } finally {
            loadingIndicator.style.display = "none";
        }
    }

    function renderProducts(products) {
        if (!products || products.length === 0) {
            productsContainer.innerHTML = "<p>No products found.</p>";
            return;
        }
        productsContainer.innerHTML = "";
        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.setAttribute("data-aos", "fade-up");
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.description.substring(0, 100)}...</p>
                <p><strong>$${product.price}</strong></p>
                <button>Buy Now</button>
            `;
            productCard.addEventListener("mouseover", () => {
                productCard.style.transform = "scale(1.05)";
                productCard.style.boxShadow = "0px 10px 15px rgba(0, 0, 0, 0.2)";
            });
            productCard.addEventListener("mouseleave", () => {
                productCard.style.transform = "scale(1)";
                productCard.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
            });
            productsContainer.appendChild(productCard);
        });
        AOS.refresh();
    }

    function populateCategories(products) {
        const categories = ["all", ...new Set(products.map(p => p.category))];
        categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
    }

    function toggleTheme() {
        document.body.classList.toggle("dark-mode");
        themeToggle.textContent = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
    }

    categoryFilter.addEventListener("change", () => {
        let filteredProducts = categoryFilter.value === "all" ? productsData : productsData.filter(p => p.category === categoryFilter.value);
        renderProducts(filteredProducts);
    });

    priceSort.addEventListener("change", () => {
        let sortedProducts = [...productsData];
        if (priceSort.value === "low") {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (priceSort.value === "high") {
            sortedProducts.sort((a, b) => b.price - a.price);
        }
        renderProducts(sortedProducts);
    });

    searchButton.addEventListener("click", () => {
        loadingIndicator.style.display = "block";
        setTimeout(() => {
            const searchText = searchInput.value.toLowerCase();
            const filteredProducts = productsData.filter(p => p.title.toLowerCase().includes(searchText));
            renderProducts(filteredProducts);
            loadingIndicator.style.display = "none";
        }, 500);
    });

    themeToggle.addEventListener("click", toggleTheme);

    fetchProducts();
});
