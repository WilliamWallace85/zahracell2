document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.textContent = "☰";
            });
        });

        document.addEventListener("click", event => {
            if (
                !event.target.closest(".nav-container") &&
                navMenu.classList.contains("active")
            ) {
                navMenu.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.textContent = "☰";
            }
        });
    }


    const productButtons = document.querySelectorAll(".product-trigger");
    const productPhotos = document.querySelector(".product-photo-section");

    if (productButtons.length && productPhotos) {

        productButtons.forEach(button => {
            button.addEventListener("click", () => {

                const hidden = productPhotos.hasAttribute("hidden");

                if (hidden) {
                    productPhotos.removeAttribute("hidden");
                    productPhotos.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                } else {
                    productPhotos.setAttribute("hidden", "");
                }

            });
        });

    }

});

document.addEventListener("DOMContentLoaded", () => {

    const galleryProductTrigger =
        document.querySelector(".gallery-product-trigger");

    const galleryProductPanel =
        document.querySelector(".gallery-product-panel");

    if (!galleryProductTrigger || !galleryProductPanel) {
        return;
    }

    galleryProductTrigger.addEventListener("click", () => {

        const isHidden = galleryProductPanel.hasAttribute("hidden");

        if (isHidden) {
            galleryProductPanel.removeAttribute("hidden");
            galleryProductTrigger.setAttribute("aria-expanded", "true");

            galleryProductPanel.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        } else {
            galleryProductPanel.setAttribute("hidden", "");
            galleryProductTrigger.setAttribute("aria-expanded", "false");
        }

    });

});
