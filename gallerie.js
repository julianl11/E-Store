// Warten, bis das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", function() {
    // Holen der Produkt-ID aus der URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'), 10);  // Konvertiere die ID in eine Zahl

    // Lade die JSON-Daten mit fetch
    fetch('singles.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Fehler beim Laden der JSON-Datei: ' + response.statusText);
            }
            return response.json();  // Parst die JSON-Daten
        })
        .then(data => {
            // Debugging: Überprüfe die geladenen Daten
            console.log('Geladene Daten:', data);

            // Stellen sicher, dass das "products"-Array vorhanden ist und mindestens ein Produkt enthält
            if (data && Array.isArray(data.products) && data.products.length > 0) {
                // Suche das Produkt anhand der ID
                const product = data.products.find(p => p.id === productId);

                if (product) {
                    // Sicherstellen, dass die "images"-Eigenschaft existiert
                    if (product.images && Array.isArray(product.images)) {
                        // Funktion zur Erstellung der Gallerie
                        function createGallery() {
                            const galleryContainer = document.getElementById("galleryContainer");
                            const images = product.images.slice(-4); // Letzte 4 Bilder
                            images.forEach(imageUrl => {
                                const imgElement = document.createElement("img");
                                imgElement.src = imageUrl;  // Setze das Bild
                                imgElement.alt = "Produktbild"; // Alternativtext
                                imgElement.addEventListener("click", () => openModal(imageUrl)); // Klick-Event
                                galleryContainer.appendChild(imgElement); // Füge das Bild zur Gallerie hinzu
                            });
                        }

                        // Gallerie erstellen
                        createGallery();
                    } else {
                        console.error('Fehler: Die "images"-Eigenschaft existiert nicht oder ist keine Array.');
                    }
                } else {
                    console.error('Fehler: Kein Produkt mit der ID ' + productId + ' gefunden.');
                }
            } else {
                console.error('Fehler: Das "products"-Array ist leer oder existiert nicht.');
            }
        })
        .catch(error => {
            console.error('Fehler:', error);
        });

    // Modal-Funktionalität
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const closeModal = document.getElementById("closeModal");

    // Funktion, um das Modal zu öffnen
    function openModal(imageUrl) {
        modal.style.display = "flex"; // Modal sichtbar machen
        modalImage.src = imageUrl;   // Setze das große Bild
    }

    // Schließen des Modals
    closeModal.addEventListener("click", () => {
        modal.style.display = "none"; // Modal schließen
    });

    // Schließen des Modals, wenn der Benutzer außerhalb des Bildes klickt
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none"; // Modal schließen
        }
    });
});
