const gallery = document.getElementById('gallery');

fetch('json/data.min.json')
    .then(response => response.json())
    .then(data => {
        const images = data;
        let smallImagesLoaded = 0;
        const totalImages = images.length;

        // Function to render small images
        const renderImages = () => {
            images.forEach(image => {
                const card = document.createElement('div');
                card.className = 'card';
                const minSrc = image.src.replace('.jpg', '.min.jpg');
                card.innerHTML = `<img data-src="${image.src}" src="${minSrc}" alt="${image.title}" loading="lazy" width="${image.width}" height="${image.height}" class="lazy-img">`;
                gallery.appendChild(card);

                // Add event listener for modal and fade-in effect
                const img = card.querySelector('img');
                img.addEventListener('click', function () {
                    modal.style.display = "block";
                    modalImg.src = this.src;
                    modalTitle.textContent = image.title;
                    modalText.textContent = image.description;
                });

                img.addEventListener('load', function () {
                    this.classList.add('fade-in');
                    smallImagesLoaded++;
                    if (smallImagesLoaded == totalImages) {
                        renderLargeImages();
                    }
                });
            });
        };

        // Function to load large images
        const renderLargeImages = () => {
            document.querySelectorAll('img.lazy-img').forEach(img => {
                const largeSrc = img.dataset.src;
                const largeImage = new Image();
                largeImage.src = largeSrc;
                largeImage.onload = () => {
                    img.src = largeSrc;
                    img.removeAttribute('data-src');
                };
            });
        };

        renderImages();
        const modal = document.getElementById("imageModal");

        // Get the image and insert it inside the modal - use its "alt" text as a caption
        const modalImg = document.getElementById("modalImage");
        const modalTitle = document.getElementById("modalTitle");
        const modalText = document.getElementById("modalText");

        // Get the <span> element that closes the modal
        const span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    })
    .catch(error => console.error('Error fetching JSON:', error));
