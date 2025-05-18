const thumbnails = document.querySelectorAll(".thumbnail");
const overlay = document.getElementById("overlay");
const enlargedThumbnail = document.getElementById("enlarged-thumbnail");

function showEnlargedThumbnail(e) {
    const imgSrc = this.querySelector("img").getAttribute("src");
    enlargedThumbnail.innerHTML = `<img src="${imgSrc}" alt="Enlarged Thumbnail">`;
    overlay.style.display = "flex";
}

function hideEnlargedThumbnail() {
    overlay.style.display = "none";
    enlargedThumbnail.innerHTML = ""; // Clear the enlarged thumbnail content
}

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener("mouseenter", showEnlargedThumbnail);
    thumbnail.addEventListener("click", function() {
        window.location.href = `edit.html`;
    });
});

// Hide the enlarged thumbnail when mouse moves away
document.addEventListener("mousemove", function(e) {
    const isOverThumbnail = Array.from(thumbnails).some(thumbnail => thumbnail.contains(e.target));
    const isOverEnlarged = enlargedThumbnail.contains(e.target);

    if (overlay.style.display === "flex" && !isOverThumbnail && !isOverEnlarged) {
        hideEnlargedThumbnail();
    }
});

// Click event for enlarged
enlargedThumbnail.addEventListener("click", function() {
    window.location.href = `edit.html`;
});

// Ensure overlay is hidden on page load
document.addEventListener("DOMContentLoaded", hideEnlargedThumbnail);
