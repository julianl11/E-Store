// JSON-Daten laden und Produkte in den HTML-Container einfügen
fetch('singles.json')
    .then(response => response.json())
    .then(products => {
        const productContainer = document.getElementById('product-container');

        // Produkte dynamisch hinzufügen
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('col-4');

            productElement.innerHTML = `
            <div class="product-container" data-id="${product.id}">
                <a href="product-details.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                </a>
                <a href="product-details.html?id=${product.id}">
                    <h4>${product.name}</h4>
                </a>
                <p>${product.price}€</p>
            </div>

            `;

            productContainer.appendChild(productElement);
        });
    })

    .catch(error => console.error('Fehler beim Laden der JSON-Datei:', error));

// JSON-Daten laden und Produkte in den HTML-Container einfügen
fetch('singles.json')
    .then(response => response.json())
    .then(data => {
        const products = data.products; // Zugriff auf die "products"-Daten

        const productContainer = document.getElementById('product-container');

        // Produkte dynamisch hinzufügen
        products.forEach(product => {
            const productElement = document.createElement('div');
            // Beibehaltung der Klasse col-4 für das Layout
            productElement.classList.add('col-4');

            productElement.innerHTML = `
                <div class="product-container" data-id="${product.id}">
                    <a href="product-details.html?id=${product.id}">
                        <!-- Zeigt nur das erste Bild an -->
                        <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                    </a>
                    <a href="product-details.html?id=${product.id}">
                        <h4>${product.name}</h4>
                    </a>
                    <p>${product.price}€</p>
                    <p>${product.description}</p>
                </div>
            `;

            productContainer.appendChild(productElement);
        });
    })
    .catch(error => console.error('Fehler beim Laden der JSON-Datei:', error));




    