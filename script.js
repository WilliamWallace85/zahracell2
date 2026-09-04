document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navbar = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
    const sections = [...document.querySelectorAll("main section[id]")];

    const closeMenu = () => {
        if (!menuToggle || !navMenu) return;
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Buka menu navigasi");
        body.classList.remove("menu-open");
    };

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute("aria-label", isOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
            body.classList.toggle("menu-open", isOpen);
        });

        navLinks.forEach((link) => link.addEventListener("click", closeMenu));

        document.addEventListener("click", (event) => {
            if (navMenu.classList.contains("active") && !event.target.closest(".nav-container")) {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 850) closeMenu();
        });
    }

    const updateNavbar = () => {
        navbar?.classList.toggle("scrolled", window.scrollY > 18);
    };

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: "-35% 0px -55%", threshold: 0 });

        sections.forEach((section) => sectionObserver.observe(section));

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

        document.querySelectorAll(".reveal").forEach((element, index) => {
            element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
            revealObserver.observe(element);
        });
    } else {
        document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
    }

    const statusText = document.querySelector("#store-status");
    const statusPill = statusText?.closest(".status-pill");

    if (statusText && statusPill) {
        const jakartaTime = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Jakarta",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }).formatToParts(new Date());
        const hour = Number(jakartaTime.find((part) => part.type === "hour")?.value ?? 0);
        const isOpen = hour >= 7 && hour < 19;

        statusText.textContent = isOpen ? "Buka sekarang · hingga 19.00 WIB" : "Sedang tutup · buka kembali 07.00 WIB";
        statusPill.classList.toggle("closed", !isOpen);
    }

    const filterButtons = [...document.querySelectorAll(".filter-button")];
    const productPhotos = [...document.querySelectorAll(".product-photo")];

    const electricSubcategories = document.querySelector("#electric-subcategories");
    const electricSubcategoryButtons = [...document.querySelectorAll(".electric-subcategory-button")];

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            filterButtons.forEach((item) => {
                const selected = item === button;
                item.classList.toggle("active", selected);
                item.setAttribute("aria-pressed", String(selected));
            });

            if (electricSubcategories) {
                electricSubcategories.hidden = filter !== "listrik";
            }

            electricSubcategoryButtons.forEach((item) => {
                item.classList.remove("active");
                item.setAttribute("aria-pressed", "false");
            });

            productPhotos.forEach((photo) => {
                let shouldShow = false;

                if (filter === "all") {
                    shouldShow = photo.dataset.category !== "listrik";
                } else if (filter === "atk") {
                    shouldShow = photo.dataset.category === "atk";
                } else if (filter === "accessories") {
                    shouldShow = photo.dataset.category === "accessories";
                } else if (filter === "listrik") {
                    shouldShow = false;
                }

                photo.classList.toggle("filtered-out", !shouldShow);
                photo.classList.toggle(
                    "atk-visible",
                    filter === "atk" && photo.dataset.category === "atk"
                );
            });
        });
    });

    electricSubcategoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const subcategory = button.dataset.subcategory;

            electricSubcategoryButtons.forEach((item) => {
                const selected = item === button;
                item.classList.toggle("active", selected);
                item.setAttribute("aria-pressed", String(selected));
            });

            productPhotos.forEach((photo) => {
                const shouldShow =
                    photo.dataset.category === "listrik" &&
                    photo.dataset.subcategory === subcategory;

                photo.classList.toggle("filtered-out", !shouldShow);
                photo.classList.remove("atk-visible");
            });
        });
    });

    productPhotos.forEach((photo) => {
        photo.classList.add("filtered-out");
    });

    const lightbox = document.querySelector("#lightbox");
    const lightboxImage = document.querySelector("#lightbox-image");
    const lightboxTitle = document.querySelector("#lightbox-title");
    const lightboxClose = document.querySelector(".lightbox-close");
    let lightboxTrigger = null;

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.hidden = true;
        body.classList.remove("lightbox-open");
        if (lightboxImage) lightboxImage.src = "";
        lightboxTrigger?.focus();
    };

    productPhotos.forEach((photo) => {
        photo.addEventListener("click", () => {
            if (!lightbox || !lightboxImage || !lightboxTitle) return;

            const imagePath = photo.dataset.image;
            const imageName = photo.dataset.name;
            lightboxTrigger = photo;
            lightboxImage.src = `/.netlify/images?url=/${imagePath}&w=1200&q=88`;
            lightboxImage.alt = imageName;
            lightboxTitle.textContent = imageName;
            lightbox.hidden = false;
            body.classList.add("lightbox-open");
            lightboxClose?.focus();
        });
    });

    lightboxClose?.addEventListener("click", closeLightbox);
    lightbox?.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            if (lightbox && !lightbox.hidden) closeLightbox();
        }

        if (event.key === "Tab" && lightbox && !lightbox.hidden) {
            event.preventDefault();
            lightboxClose?.focus();
        }
    });

    const whatsappForm = document.querySelector("#whatsapp-form");

    whatsappForm?.querySelectorAll("input, select, textarea").forEach((field) => {
        field.addEventListener("input", () => {
            field.removeAttribute("aria-invalid");
            const error = field.closest(".field-group")?.querySelector(".field-error");
            if (error) error.textContent = "";
        });
    });

    whatsappForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameInput = document.querySelector("#customer-name");
        const needInput = document.querySelector("#customer-need");
        const messageInput = document.querySelector("#customer-message");
        const nameError = document.querySelector("#name-error");
        const needError = document.querySelector("#need-error");
        const name = nameInput.value.trim();
        const need = needInput.value;
        const details = messageInput.value.trim();
        let valid = true;

        nameError.textContent = "";
        needError.textContent = "";
        nameInput.removeAttribute("aria-invalid");
        needInput.removeAttribute("aria-invalid");

        if (name.length < 2) {
            nameError.textContent = "Masukkan nama minimal 2 karakter.";
            nameInput.setAttribute("aria-invalid", "true");
            valid = false;
        }

        if (!need) {
            needError.textContent = "Pilih kebutuhan yang ingin ditanyakan.";
            needInput.setAttribute("aria-invalid", "true");
            valid = false;
        }

        if (!valid) {
            whatsappForm.querySelector('[aria-invalid="true"]')?.focus();
            return;
        }

        const detailText = details ? ` Detail: ${details}` : "";
        const message = `Halo ZahraCell2, saya ${name}. Saya ingin bertanya tentang ${need}.${detailText}`;
        window.open(`https://wa.me/6282121100045?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    });

    const currentYear = document.querySelector("#current-year");
    if (currentYear) currentYear.textContent = String(new Date().getFullYear());
});
