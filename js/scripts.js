const gallery = document.getElementById('gallery');

fetch('json/data.min.json')
    .then(response => response.json())
    .then(data => {
        const images = data;

        // Shuffle the images array
        for (let i = images.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [images[i], images[j]] = [images[j], images[i]];
        }

        // Generate the image cards in random order
        images.forEach(image => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<img src="${image.src}" alt="${image.title}" loading="lazy" width="${image.width}" height="${image.height}" class="lazy-img">`;
            gallery.appendChild(card);
        });

        // Get the modal
        const modal = document.getElementById("imageModal");

        // Get the image and insert it inside the modal - use its "alt" text as a caption
        const modalImg = document.getElementById("modalImage");
        const modalTitle = document.getElementById("modalTitle");
        const modalText = document.getElementById("modalText");

        document.querySelectorAll('.card img').forEach((img, index) => {
            img.addEventListener('click', function () {
                modal.style.display = "block";
                modalImg.src = this.src;
                modalTitle.textContent = images[index].title;
                modalText.textContent = images[index].description;
            });

            // Add fade-in effect when image loads
            img.addEventListener('load', function () {
                this.classList.add('fade-in');
            });
        });

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
