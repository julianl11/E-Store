// Produktdetails basierend auf der ID aus der URL laden
const loadProductDetails = async () => {
    // URL-Parameter abfragen
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // Produkt-ID aus der URL extrahieren

    try {
        const response = await fetch('singles.json'); // JSON-Datei mit den Produkten laden
        const data = await response.json();
        const product = data.products.find(p => p.id == productId); // Produkt anhand der ID finden

        if (product) {
            renderProductDetails(product); // Produktdetails anzeigen
        } else {
            console.error("Produkt nicht gefunden");
        }
    } catch (error) {
        console.error("Fehler beim Laden der Produktdetails:", error);
    }
};

// Produktdetails rendern
const renderProductDetails = (product) => {
    const detailsContainer = document.getElementById('product-details-container');
    detailsContainer.innerHTML = `
        <div class="row">
            <div class="col-2">
                <img src="${product.images[0]}" width="100%" id="ProductImg">
                <div class="small-img-row">
                </div>
            </div>
            <div class="col-2">
                <p>Home / ${product.name}</p>
                <h1>${product.name}</h1>
                <h4>${product.price}€</h4>
                <a href="#" class="addCart">Add To Cart</a>
                <h3 class="product-info">Product Information</h3>
                <br>
                <p>${product.description}</p>
            </div>
        </div>
    `;

        // Event-Listener für den "Add To Cart"-Button
        const addToCartBtn = detailsContainer.querySelector('.addCart');
        addToCartBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Standard-Aktion des Links verhindern
            addToCart(product.id); // Produkt zum Warenkorb hinzufügen
        });
};

// Produktdetails laden, wenn die Seite geladen wird
document.addEventListener('DOMContentLoaded', loadProductDetails);








