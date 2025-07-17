console.log("ix deployed");

//Navigation Bar
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector('[data-nav-element="menu"]')
    .addEventListener("click", () => {
      const navbar = document.querySelector('[data-nav-element="navbar"]');
      const currentState = navbar.getAttribute("data-nav-state");
      navbar.setAttribute(
        "data-nav-state",
        currentState === "open" ? "closed" : "open",
      );
    });
});

//Navigation Banner
document.addEventListener("DOMContentLoaded", function () {
  const closeButton = document.querySelector('[data-banner-element="close"]');
  if (!closeButton) return;

  closeButton.addEventListener("click", () => {
    const banner = document.querySelector('[data-banner-element="banner"]');
    const currentState = banner.getAttribute("data-banner-state");
    banner.setAttribute(
      "data-banner-state",
      currentState === "visible" ? "hidden" : "visible",
    );
  });
});

//Navbar Border
document.addEventListener("DOMContentLoaded", () => {
  const navbarElement = document.querySelector("[data-navbar-border]");
  const triggerElement = document.querySelector("[data-border-trigger]");

  if (navbarElement && triggerElement) {
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 160",
      onEnter: () => {
        navbarElement.setAttribute("data-navbar-border", "on");
      },
      onLeaveBack: () => {
        navbarElement.setAttribute("data-navbar-border", "off");
      },
    });
  }
});

//Cookie Wrap
document.addEventListener("DOMContentLoaded", function () {
  // Initialize banner with delay
  const wrap = document.querySelector('[data-cc-item="wrap"]');
  if (wrap) {
    const delay = parseInt(wrap.getAttribute("data-cc-delay")) || 0;

    setTimeout(() => {
      wrap.setAttribute("data-cc-state", "show");
    }, delay * 1000);
  }

  // Wrap triggers
  document.querySelectorAll("[data-cc-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const wrap = document.querySelector('[data-cc-item="wrap"]');
      const triggerType = trigger.getAttribute("data-cc-trigger");
      if (wrap) {
        const newState = triggerType === "open" ? "show" : "hide";
        wrap.setAttribute("data-cc-state", newState);
      }
    });
  });
  // Pref triggers
  document.querySelectorAll("[data-pref-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const pref = document.querySelector('[data-cc-item="pref"]');
      const triggerType = trigger.getAttribute("data-pref-trigger");
      if (pref) {
        const newState = triggerType === "open" ? "show" : "hide";
        pref.setAttribute("data-pref-state", newState);
      }
    });
  });
});

//Swiper (Reviews)
document.addEventListener("DOMContentLoaded", function () {
  const isMobile = window.innerWidth < 991;
  let reviewsSwiper;

  function updateFractions(swiper) {
    const currentSlide = swiper.realIndex + 1;
    const totalSlides = swiper.slides.filter(
      (slide) => !slide.classList.contains("swiper-slide-duplicate"),
    ).length;
    const currentEl = document.getElementById("reviews-current-slide");
    const totalEl = document.getElementById("reviews-total-slides");
    if (currentEl) currentEl.textContent = currentSlide;
    if (totalEl) totalEl.textContent = totalSlides;
  }

  function calculateSlidesPerView() {
    const swiperContainer = document.querySelector("#reviews-swiper");
    const slides = swiperContainer.querySelectorAll(".swiper-slide");
    if (slides.length === 0) return 1;
    const containerHeight = swiperContainer.offsetHeight;
    // console.log("Container height:", containerHeight);
    let maxSlideHeight = 0;
    slides.forEach((slide) => {
      const slideHeight = slide.offsetHeight;
      if (slideHeight > maxSlideHeight) {
        maxSlideHeight = slideHeight;
      }
    });
    // console.log("Max slide height:", maxSlideHeight);
    if (maxSlideHeight === 0) return 1;
    const spaceBetween = 20;
    const availableHeight = containerHeight;
    const slidesCount = Math.floor(
      availableHeight / (maxSlideHeight + spaceBetween),
    );
    // console.log("Calculated slides per view:", Math.max(1, slidesCount));
    return Math.max(1, slidesCount);
  }

  function initSwiper() {
    const slidesPerView = isMobile ? 1.1 : calculateSlidesPerView();

    reviewsSwiper = new Swiper("#reviews-swiper", {
      direction: "vertical",
      slidesPerView: slidesPerView,
      spaceBetween: 12,
      mousewheel: false,
      grabCursor: true,
      loop: true,
      slidesOffsetBefore: 0,
      navigation: {
        nextEl: "#reviews-next",
        prevEl: "#reviews-prev",
      },
      pagination: {
        el: "#reviews-pagination",
        clickable: true,
        type: "bullets",
      },
      centeredSlides: false,
      autoplay: {
        delay: isMobile ? 8000 : 10000,
        disableOnInteraction: false,
      },
      speed: 800,
      allowTouchMove: window.innerWidth >= 991,
      a11y: {
        enabled: true,
        containerRole: null,
        slideRole: null,
      },
      on: {
        init: function () {
          updateFractions(this);
        },
        slideChange: function () {
          updateFractions(this);
        },
      },
    });
  }

  function reinitSwiper() {
    console.log("Reinitializing swiper for new dimensions");
    if (reviewsSwiper) {
      reviewsSwiper.destroy(true, true);
    }
    setTimeout(initSwiper, 100);
  }

  // Wait 200ms for all elements to render in DOM before initializing swiper
  setTimeout(initSwiper, 200);

  let resizeTimeout;
  if (!isMobile) {
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(reinitSwiper, 300);
    });
  }
});

//Swiper (Benefits)
document.addEventListener("DOMContentLoaded", function () {
  var mySwiper = new Swiper("#benefits-swiper", {
    slidesPerView: 4,
    slidesPerGroup: 1,
    spaceBetween: 16,
    grabCursor: true,
    allowTouchMove: true,
    autoHeight: false,
    watchOverflow: true,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
    centeredSlides: false,
    loopedSlides: null,
    resistanceRatio: 0,
    pagination: {
      el: "#benefits-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: "#benefits-next",
      prevEl: "#benefits-prev",
    },

    // Accessibility module
    a11y: {
      enabled: true,
      prevSlideMessage: "Previous benefit",
      nextSlideMessage: "Next benefit",
      firstSlideMessage: "This is the first benefit",
      lastSlideMessage: "This is the last benefit",
      paginationBulletMessage: "Go to benefit {{index}}",
      notificationClass: "swiper-notification",
      containerMessage: "Benefits carousel",
      containerRoleDescriptionMessage: "carousel",
      itemRoleDescriptionMessage: "benefit slide",
      containerRole: null,
      slideRole: null,
    },

    // Keyboard control
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    // Focus handling
    watchSlidesProgress: true,
    watchSlidesVisibility: true,

    breakpoints: {
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
      480: {
        slidesPerView: 2,
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
      767: {
        slidesPerView: 2,
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
      992: {
        slidesPerView: 3,
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
      1200: {
        slidesPerView: 4,
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
    },
  });
});

//Lightbox
document.addEventListener("DOMContentLoaded", function () {
  // Only initialize on desktop (screen width > 991px)
  if (window.innerWidth <= 991) {
    console.log("Lightbox disabled on mobile");
    return;
  }

  const autoplayVideo = document.querySelector("[data-player-desktop]");
  const lightboxWrap = document.querySelector("[data-lbox-wrap]");
  const openToggle = document.querySelector('[data-lbox-toggle="open"]');
  const closeToggle = document.querySelector('[data-lbox-toggle="close"]');

  if (!autoplayVideo || !lightboxWrap || !openToggle || !closeToggle) {
    console.warn("Missing required lightbox elements");
    return;
  }

  let modalIframe = null;
  let vimeoPlayer = null;
  let isLightboxOpen = false;

  // Get Vimeo iframe element
  function getModalPlayer() {
    const modalContainer = document.querySelector("[data-player-modal]");
    if (modalContainer) {
      modalIframe = modalContainer.querySelector("iframe");
      if (modalIframe) {
        // Initialize Vimeo Player API
        vimeoPlayer = new Vimeo.Player(modalIframe);
      } else {
        console.warn("Vimeo iframe not found in modal container");
      }
    } else {
      console.warn("Modal container not found");
    }
  }

  // Wait for Vimeo Player API to load, then initialize
  if (typeof Vimeo !== "undefined") {
    getModalPlayer();
  } else {
    // Load Vimeo Player API if not already loaded
    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.onload = getModalPlayer;
    document.head.appendChild(script);
  }

  function openLightbox() {
    if (isLightboxOpen) return;

    console.log("Opening lightbox");
    document.body.style.overflow = "hidden";

    // Pause background video
    if (autoplayVideo) {
      autoplayVideo.pause();
    }

    lightboxWrap.setAttribute("data-lbox-state", "show");
    isLightboxOpen = true;

    // Start modal video from beginning with sound
    if (vimeoPlayer) {
      vimeoPlayer.setCurrentTime(0);
      vimeoPlayer.setVolume(1);
      vimeoPlayer
        .play()
        .catch((err) => console.warn("Modal video play error:", err));
    }
  }

  function closeLightbox() {
    if (!isLightboxOpen) return;

    console.log("Closing lightbox");
    document.body.style.overflow = "";
    lightboxWrap.setAttribute("data-lbox-state", "hide");
    isLightboxOpen = false;

    // Pause, mute and reset modal video
    if (vimeoPlayer) {
      vimeoPlayer.pause();
      vimeoPlayer.setCurrentTime(0);
    }

    // Resume background video
    if (autoplayVideo) {
      autoplayVideo
        .play()
        .catch((err) => console.warn("Background video resume error:", err));
    }
  }

  // Event listeners
  openToggle.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    openLightbox();
  });

  closeToggle.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeLightbox();
  });

  // Close on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isLightboxOpen) {
      closeLightbox();
    }
  });

  // Close on backdrop click
  lightboxWrap.addEventListener("click", function (e) {
    if (e.target === lightboxWrap) {
      closeLightbox();
    }
  });
});

// Marquee
document.addEventListener("DOMContentLoaded", () => {
  // Configuration
  const OPEN_CARD_INTERVAL = 4;
  // Mobile detection
  function isMobile() {
    return window.innerWidth <= 991;
  }

  function getMarqueeType() {
    const marqueeWrap = document.querySelector("[data-marquee-wrap]");
    return marqueeWrap ? marqueeWrap.getAttribute("data-marquee-type") : null;
  }

  // Clone cards function
  function cloneCards() {
    const marqueeWrap = document.querySelector("[data-marquee-wrap]");
    const marqueeItem = document.querySelector("[data-marquee-item]");
    if (!marqueeWrap || !marqueeItem) {
      console.warn("Marquee elements not found");
      return;
    }

    const marqueeType = getMarqueeType();
    const originalContent = marqueeItem.outerHTML;

    function calculateRequiredCopies() {
      // Banner type logic
      if (marqueeType === "banner") {
        if (isMobile()) {
          return {
            viewportWidth: window.innerWidth,
            itemWidth: marqueeItem.offsetWidth,
            copiesNeeded: 3,
          };
        } else {
          // Desktop: calculated copies
          const viewportWidth = window.innerWidth;
          const itemWidth = marqueeItem.offsetWidth;
          const copiesNeeded = Math.ceil((viewportWidth * 5) / itemWidth) + 2;
          return {
            viewportWidth,
            itemWidth,
            copiesNeeded,
          };
        }
      }

      // Ticker type logic
      if (marqueeType === "ticker") {
        if (isMobile()) {
          // Mobile: calculated copies
          const viewportWidth = window.innerWidth;
          const itemWidth = marqueeItem.offsetWidth;
          const copiesNeeded = Math.ceil((viewportWidth * 5) / itemWidth) + 2;
          return {
            viewportWidth,
            itemWidth,
            copiesNeeded,
          };
        } else {
          // Desktop: no copies (original only)
          return {
            viewportWidth: window.innerWidth,
            itemWidth: marqueeItem.offsetWidth,
            copiesNeeded: 1,
          };
        }
      }

      // Default fallback
      const viewportWidth = window.innerWidth;
      const itemWidth = marqueeItem.offsetWidth;
      const copiesNeeded = Math.ceil((viewportWidth * 5) / itemWidth) + 2;
      return {
        viewportWidth,
        itemWidth,
        copiesNeeded,
      };
    }

    const { copiesNeeded, itemWidth } = calculateRequiredCopies();

    marqueeWrap.innerHTML = "";
    for (let i = 0; i < copiesNeeded; i++) {
      const clone = document.createElement("div");
      clone.innerHTML = originalContent;
      const clonedItem = clone.firstElementChild;
      marqueeWrap.appendChild(clonedItem);
    }

    return { itemWidth, copiesNeeded };
  }

  // Move cards function
  function moveCards(itemWidth, copiesNeeded) {
    const marqueeWrap = document.querySelector("[data-marquee-wrap]");
    if (!marqueeWrap) {
      console.warn("News Marquee not found");
      return;
    }

    const marqueeType = getMarqueeType();

    // Banner type: animate on desktop, skip on mobile
    if (marqueeType === "banner") {
      if (isMobile()) {
        return;
      }
    }

    // Ticker type: animate on mobile, skip on desktop
    if (marqueeType === "ticker") {
      if (!isMobile()) {
        return;
      }
    }

    // Run animation
    const totalWidth = itemWidth * copiesNeeded;
    gsap.to(marqueeWrap, {
      x: -totalWidth + itemWidth,
      duration: totalWidth / 25,
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        gsap.set(marqueeWrap, { x: 0 });
      },
    });
  }

  // Open cards function
  function openCards() {
    const cards = document.querySelectorAll("[data-marquee-card]");
    if (!cards.length) {
      console.warn("No marquee cards found");
      return;
    }

    cards.forEach((card, index) => {
      card.setAttribute("data-marquee-card", "off");
      if (index % 4 === 0) {
        card.setAttribute("data-marquee-card", "on");
      }
    });
  }

  // Main initialization
  function runCards() {
    const cloneData = cloneCards();
    if (!cloneData) return;

    const { itemWidth, copiesNeeded } = cloneData;
    moveCards(itemWidth, copiesNeeded);
    openCards();
  }

  // Start the initialization
  runCards();
});

// Cards Overlays
document.addEventListener("DOMContentLoaded", () => {
  // Animation Constants
  const ANIMATION = {
    duration: 0.4,
    opacityDuration: 0.3,
    ease: "power2.out",
  };

  // Select all card elements using data attribute
  const cards = document.querySelectorAll("[data-ab-card='card']");

  // Track currently open card
  let currentlyOpenCard = null;

  // Store previous window width to detect actual layout changes
  let prevWidth = window.innerWidth;

  // Check if device is mobile
  const isMobile = () => window.innerWidth <= 991;

  // Setup for each card
  cards.forEach((card, index) => {
    const overlay = card.querySelector("[data-ab-card='overlay']");
    const content = card.querySelector("[data-ab-card='content']");
    const button = card.querySelector("[data-ab-card='button']");

    // Check if elements exist
    if (!overlay) {
      console.error(
        `Card #${index} is missing overlay element ([data-ab-card='overlay'])`,
      );
      return;
    }
    if (!content) {
      console.error(
        `Card #${index} is missing content element ([data-ab-card='content'])`,
      );
      return;
    }
    if (!button) {
      console.error(
        `Card #${index} is missing button element ([data-ab-card='button'])`,
      );
      return;
    }

    // Initial state - check data-card-state attribute
    let isOpen = overlay.getAttribute("data-card-state") === "open";

    // Height variables
    let initialOverlayHeight;
    let finalOverlayHeight;
    let contentHeight;

    // Function to calculate heights - different for mobile vs desktop
    const calculateHeights = () => {
      initialOverlayHeight = parseFloat(
        window.getComputedStyle(overlay).height,
      );

      // For mobile: initialHeight + contentHeight
      // For desktop: use card's full height
      if (isMobile()) {
        // Make content temporarily visible to measure height
        const contentDisplay = window.getComputedStyle(content).display;
        const contentOpacity = window.getComputedStyle(content).opacity;

        gsap.set(content, { display: "flex", opacity: 0 });
        contentHeight = parseFloat(window.getComputedStyle(content).height);

        // Reset content to original state
        gsap.set(content, { display: contentDisplay, opacity: contentOpacity });

        finalOverlayHeight = initialOverlayHeight + contentHeight;
      } else {
        // Desktop behavior - use card's full height
        finalOverlayHeight = parseFloat(window.getComputedStyle(card).height);
      }
    };

    // Calculate on page load
    calculateHeights();

    // Set initial styles
    gsap.set(content, {
      display: isOpen ? "flex" : "none",
      opacity: isOpen ? 1 : 0,
    });

    gsap.set(overlay, {
      height: isOpen ? finalOverlayHeight : initialOverlayHeight,
      overflow: isOpen && !isMobile() ? "scroll" : "hidden",
    });

    // Create quickTo function for the overlay height
    const animateHeight = gsap.quickTo(overlay, "height", {
      duration: ANIMATION.duration,
      ease: ANIMATION.ease,
    });

    // Create quickTo function for content opacity
    const animateOpacity = gsap.quickTo(content, "opacity", {
      duration: ANIMATION.opacityDuration,
      ease: ANIMATION.ease,
    });

    // Function to open the card
    const openCard = () => {
      if (overlay.getAttribute("data-card-state") === "open") return;

      // If another card is open, close it first
      if (currentlyOpenCard && currentlyOpenCard !== card) {
        currentlyOpenCard.closeCard();
      }

      // Recalculate heights to ensure correct measurements
      calculateHeights();

      // Update card state attribute
      overlay.setAttribute("data-card-state", "open");

      // Animate overlay height using quickTo
      animateHeight(finalOverlayHeight);

      // Show content and animate opacity
      gsap.set(content, { display: "flex" });
      animateOpacity(1);

      // Set overflow to scroll ONLY on desktop
      if (!isMobile()) {
        gsap.delayedCall(ANIMATION.opacityDuration, () => {
          gsap.set(overlay, { overflowY: "scroll" });
        });
      }

      currentlyOpenCard = card;
      console.log(
        `Card #${index} opened (${isMobile() ? "Mobile" : "Desktop"} mode)`,
      );
    };

    // Function to close the card
    const closeCard = () => {
      if (overlay.getAttribute("data-card-state") === "closed") return;

      // Update card state attribute
      overlay.setAttribute("data-card-state", "closed");

      // Reset overflow immediately
      gsap.set(overlay, { overflowY: "hidden" });

      // Animate overlay back to initial height using quickTo
      animateHeight(initialOverlayHeight);

      // Fade out content
      animateOpacity(0);

      // Hide content after fade completes
      gsap.delayedCall(ANIMATION.opacityDuration, () => {
        gsap.set(content, { display: "none" });
      });

      if (currentlyOpenCard === card) {
        currentlyOpenCard = null;
      }

      console.log(`Card #${index} closed`);
    };

    // Attach the functions to the card object so they can be called externally
    card.openCard = openCard;
    card.closeCard = closeCard;

    // Button click handler
    button.addEventListener("click", () => {
      if (overlay.getAttribute("data-card-state") === "open") {
        closeCard();
      } else {
        openCard();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth !== prevWidth) {
        const wasMobile = overlay.hasAttribute("data-mobile");
        const nowMobile = isMobile();

        if (wasMobile !== nowMobile) {
          if (nowMobile) {
            overlay.setAttribute("data-mobile", "true");
          } else {
            overlay.removeAttribute("data-mobile");
          }

          if (overlay.getAttribute("data-card-state") === "open") {
            gsap.set(overlay, { overflowY: nowMobile ? "hidden" : "auto" });
          }
        }

        calculateHeights();

        if (overlay.getAttribute("data-card-state") === "open") {
          gsap.set(overlay, { height: finalOverlayHeight });
        } else {
          gsap.set(overlay, { height: initialOverlayHeight });
        }

        prevWidth = window.innerWidth;
      }
    });

    if (isMobile()) {
      overlay.setAttribute("data-mobile", "true");
    }
  });
});

//Paginations + Filters
document.addEventListener("DOMContentLoaded", function () {
  const allFilter = document.querySelector('[data-filter-element="all"]');
  const radioFilters = document.querySelectorAll(
    '[data-filter-element="radio"]',
  );
  const checkboxFilters = document.querySelectorAll(
    '[data-filter-element="checkbox"]',
  );

  const listPaginate = document.querySelector(
    '[data-pagination-element="list"]',
  );
  const loaderPaginate = document.querySelector(
    '[data-pagination-element="loader"]',
  );
  const loadPaginate = document.querySelector(
    '[data-pagination-element="load"]',
  );

  // PAGINATION CODE

  // Function to initialize and handle pagination
  function initializePagination() {
    // Check if listPaginate exists first
    if (!listPaginate) {
      console.warn("Pagination element not found");
      return;
    }

    listPaginate.style.opacity = 0;

    const items = listPaginate.querySelectorAll("[data-pagination-item]");

    if (!items || items.length === 0) {
      console.warn("No pagination items found");
      return;
    }

    // Get configuration from list element attributes
    const INITIAL_ITEMS =
      parseInt(listPaginate.getAttribute("data-pagination-initial")) || 6;
    const ITEMS_PER_LOAD =
      parseInt(listPaginate.getAttribute("data-pagination-unit")) || 3;
    // console.log("Pagination: Initial items:", INITIAL_ITEMS);
    // console.log("Pagination: Items per load:", ITEMS_PER_LOAD);

    // Initialize data attributes
    const totalItems = items.length;
    listPaginate.setAttribute("data-pagination-total", totalItems);
    listPaginate.setAttribute("data-pagination-visible", INITIAL_ITEMS);

    // Set up items with index and initial visibility
    items.forEach((item, index) => {
      item.setAttribute("data-pagination-index", index);
      item.setAttribute(
        "data-item-state",
        index < INITIAL_ITEMS ? "show" : "hide",
      );
    });

    // Set initial button visibility
    if (INITIAL_ITEMS >= totalItems) {
      loadPaginate.setAttribute("data-load-state", "hide");
    } else {
      loadPaginate.setAttribute("data-load-state", "show");
    }

    // Clear previous click handler if any
    loadPaginate.removeEventListener("click", runPagination);

    // Add click handler
    loadPaginate.addEventListener("click", runPagination);

    // Update filter counts
    filterCount();

    // Fade in with ease after filterCount
    setTimeout(() => {
      listPaginate.style.transition = "opacity 0.3s ease-in";
      listPaginate.style.opacity = 1;
    }, 100);

    // console.log("Pagination:", totalItems, "total items");
  }

  // Function to reset pagination visibility
  function resetPagination() {
    // console.log("Resetting pagination");

    // Get all items
    const items = listPaginate.querySelectorAll("[data-pagination-item]");

    // Reset all items visibility to hide
    items.forEach((item) => {
      item.setAttribute("data-item-state", "hide");
    });

    // Reset visible count to 0
    listPaginate.setAttribute("data-pagination-visible", "0");

    // Reset button states
    if (loadPaginate) {
      loadPaginate.disabled = false;
      loadPaginate.setAttribute("data-load-state", "show");
    }

    if (loaderPaginate) {
      loaderPaginate.setAttribute("data-load-state", "hide");
    }

    // console.log("Pagination reset complete");
  }

  // Function to handle loading more items
  function runPagination(e) {
    e.preventDefault();
    // console.log("Load button clicked");

    // Get current items
    const items = listPaginate.querySelectorAll("[data-pagination-item]");
    const ITEMS_PER_LOAD =
      parseInt(listPaginate.getAttribute("data-pagination-unit")) || 3;

    // Disable button during loading
    loadPaginate.disabled = true;

    // Show loader if it exists
    if (loaderPaginate) {
      loaderPaginate.setAttribute("data-load-state", "show");
    }

    // Get current state
    const currentVisible = parseInt(
      listPaginate.getAttribute("data-pagination-visible"),
    );
    const totalItems = parseInt(
      listPaginate.getAttribute("data-pagination-total"),
    );

    // Calculate next batch
    const newVisible = Math.min(currentVisible + ITEMS_PER_LOAD, totalItems);
    // console.log("Showing items from", currentVisible, "to", newVisible);

    // Show next items
    for (let i = currentVisible; i < newVisible; i++) {
      if (items[i]) {
        items[i].setAttribute("data-item-state", "show");
      }
    }

    // Update count
    listPaginate.setAttribute("data-pagination-visible", newVisible);

    // Hide button immediately if all items are shown
    if (newVisible >= totalItems) {
      loadPaginate.setAttribute("data-load-state", "hide");
    }

    // Add delay for loader animation only
    setTimeout(() => {
      // Hide loader
      if (loaderPaginate) {
        loaderPaginate.setAttribute("data-load-state", "hide");
      }
      // Re-enable button only if there are more items
      if (newVisible < totalItems) {
        loadPaginate.disabled = false;
      }
    }, 500);
  }

  // Function to hide labels with zero results
  function hideZeroResultFilters() {
    const resultCountSpans = document.querySelectorAll(
      '[fs-cmsfilter-element="filter-results-count"]',
    );
    let hiddenCount = 0;
    let shownCount = 0;

    resultCountSpans.forEach((span) => {
      const count = span.textContent.trim();
      const parentLabel = span.closest("label");

      if (parentLabel) {
        if (count === "0") {
          parentLabel.style.display = "none";
          hiddenCount++;
        } else {
          parentLabel.style.display = "";
          shownCount++;
        }
      }
    });

    // console.log(
    //   "Zero results hide complete - Hidden:",
    //   hiddenCount,
    //   "Shown:",
    //   shownCount,
    // );
  }

  // Initialize pagination on load with delay to avoid race condition with Finsweet
  setTimeout(() => {
    initializePagination();
  }, 500);

  // Hide zero result filters after Finsweet has populated counts
  setTimeout(() => {
    hideZeroResultFilters();
  }, 600);

  // FILTER CODE

  // Function to handle filter reset when "all" is clicked
  function filterReset() {
    // Ensure "all" is active when clicked
    if (!allFilter.classList.contains("active")) {
      allFilter.classList.add("active");
    }
    // Deactivate all categories when "all" is clicked
    radioFilters.forEach((el) => el.classList.remove("active"));

    // Simulate clicks on all checkboxes with delay to avoid race condition
    setTimeout(() => {
      checkboxFilters.forEach((checkbox) => {
        checkbox.click();
        // console.log("Simulated click on checkbox:", checkbox.id);
      });
    }, 100);
  }

  // Add a direct click handler for the all filter
  if (allFilter) {
    allFilter.addEventListener("click", filterReset, true);
  }

  // Function to handle automatic "all" filter deactivation
  function allReset(mutations) {
    // Process mutations to check if any category became active
    const categoryMutations = mutations.filter(
      (m) => m.target !== allFilter && m.attributeName === "class",
    );
    if (categoryMutations.length > 0) {
      // Check if any category has the active class
      const anyActiveCategories = Array.from(radioFilters).some((el) =>
        el.classList.contains("active"),
      );
      // If any category is active, remove active from "all"
      if (anyActiveCategories && allFilter.classList.contains("active")) {
        allFilter.classList.remove("active");
        // console.log("All filter deactivated due to category selection");
      }
    }
  }

  const observer = new MutationObserver(allReset);

  // Observe category filters for class changes
  radioFilters.forEach((el) => {
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
  });

  // Function to handle individual checkbox changes
  function checkboxReset() {
    const parentLabel = this.closest("label");
    if (
      this.checked &&
      !parentLabel.classList.contains("fs-cmsfilter_active")
    ) {
      parentLabel.classList.add("fs-cmsfilter_active");
    } else if (
      !this.checked &&
      parentLabel.classList.contains("fs-cmsfilter_active")
    ) {
      parentLabel.classList.remove("fs-cmsfilter_active");
    }
    // console.log("Checkbox toggled:", this.id, "Checked:", this.checked);
  }

  //Commented out checkboxReset() eventListener

  // Function to count checked checkboxes and update dropdown counts
  function filterCount() {
    // console.log("Pagination: Updating filter counts");

    // Find all dropdown containers with count indices
    const dropdowns = document.querySelectorAll(
      '[data-filter-element="dropdown"]',
    );

    dropdowns.forEach((dropdown) => {
      // Get the count index for this dropdown
      const countIndex = dropdown.getAttribute("data-count-index");

      // Count checkboxes with w--redirected-checked class within this dropdown
      const checkedBoxes = dropdown.querySelectorAll(
        ".w-checkbox-input.w--redirected-checked",
      );
      const checkedCount = checkedBoxes.length;

      // Find the corresponding count display element
      const countDisplay = document.querySelector(
        `[data-filter-element="count"][data-count-index="${countIndex}"]`,
      );

      if (countDisplay) {
        countDisplay.textContent = checkedCount;
        // console.log(
        //   `Pagination: Updated count for Dropdown ${countIndex}: ${checkedCount}`,
        // );
      }
    });
  }

  // Function to handle pagination reset and reinitialization when filters change (with checkbox hiding)
  function renderPaginate() {
    // console.log("Filter changed, updating pagination");
    // Reset pagination to initial state
    resetPagination();
    // Reinitialize with new filtered items after delay
    setTimeout(() => {
      initializePagination();
      // Also re-check zero results after filter changes
      setTimeout(() => {
        hideZeroResultFilters();
      }, 200);
    }, 100);
  }

  // Function to handle pagination reset and reinitialization when filters change (without checkbox hiding)
  function refreshPaginate() {
    // console.log("Filter changed, refreshing pagination");
    // Reset pagination to initial state
    resetPagination();
    // Reinitialize with new filtered items after delay
    setTimeout(() => {
      initializePagination();
      // Skip hideZeroResultFilters call here
    }, 100);
  }

  // Add click listeners to all filters for pagination updates
  if (allFilter) {
    allFilter.addEventListener("click", () => {
      // console.log("All filter clicked, rendering pagination");
      renderPaginate();
    });
  }
  radioFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      // console.log("Radio filter clicked, rendering pagination");
      renderPaginate();
    });
  });
  checkboxFilters.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      // console.log("Checkbox filter changed, refreshing pagination");
      refreshPaginate();
    });
  });
});

//Share Snippet
document.addEventListener("DOMContentLoaded", () => {
  // Find all elements with data-blog-share attribute
  const shareElements = document.querySelectorAll("[data-news-share]");

  // Add click event listeners to each element
  shareElements.forEach((element) => {
    element.addEventListener("click", function () {
      const shareType = this.getAttribute("data-news-share");

      if (shareType === "copy") {
        // Copy current URL to clipboard
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => {
            showToast("Copied link");
          })
          .catch((err) => {
            console.error("Failed to copy URL:", err);
          });
      } else if (shareType === "mail") {
        // Create mailto link and trigger it
        const mailtoUrl = `mailto:?subject=Check this out&body=${window.location.href}`;
        window.location.href = mailtoUrl;
      }
    });
  });

  // Simple toast notification function
  function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.padding = "10px 20px";
    toast.style.backgroundColor = "#333";
    toast.style.color = "#fff";
    toast.style.borderRadius = "4px";
    toast.style.zIndex = "1000";

    document.body.appendChild(toast);

    // Remove the toast after 3 seconds
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  }
});
