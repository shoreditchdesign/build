//Navigation Bar Drawer (Mobile)
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

//Navigation Bar Dropdown (Desktop)
document.addEventListener("DOMContentLoaded", () => {
  // Cache initial values
  let initialWrapHeight = null;
  let originalOverflow = null;
  let closeTimeout = null;

  // Desktop check function
  const isDesktop = () => window.matchMedia("(min-width: 992px)").matches;

  const toggleElement = document.querySelector('[data-nav-element="toggle"]');

  // Function to handle opening the dropdown
  const openDropdown = () => {
    // Only run on desktop
    if (!isDesktop()) return;

    // Clear any pending close timeout
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }

    // Get elements
    const toggle = document.querySelector('[data-nav-element="toggle"]');
    let wrap =
      document.querySelector('[data-nav-element="wrap"]') ||
      document.querySelector('[data-nav-element="navbar"]') ||
      document.querySelector(".c-navbar");
    const drawer = document.querySelector('[data-nav-element="dropdown"]');

    // Store initial values on first hover
    if (initialWrapHeight === null) {
      initialWrapHeight = wrap.offsetHeight;
      originalOverflow = wrap.style.overflow || "";
    }

    // Set state to open
    toggle.setAttribute("data-toggle-state", "open");

    // Set up animation
    const drawerHeight = drawer.offsetHeight;
    wrap.style.overflow = "hidden";

    // Force initial height before transition
    wrap.style.height = initialWrapHeight + "px";

    // Force reflow to ensure initial height is applied
    void wrap.offsetHeight;

    // Now add transition
    wrap.style.transition = "height 0.3s ease";

    // Set target height for open state
    wrap.style.height = initialWrapHeight + drawerHeight + "px";

    // Restore overflow after transition
    setTimeout(() => {
      wrap.style.overflow = originalOverflow;
    }, 350);
  };

  // Function to handle closing the dropdown
  const closeDropdown = () => {
    // Only run on desktop
    if (!isDesktop()) return;

    // Set a 300ms delay before starting the close animation
    closeTimeout = setTimeout(() => {
      // Get elements
      const toggle = document.querySelector('[data-nav-element="toggle"]');
      let wrap =
        document.querySelector('[data-nav-element="wrap"]') ||
        document.querySelector('[data-nav-element="navbar"]') ||
        document.querySelector(".c-navbar");

      // Set state to closed
      toggle.setAttribute("data-toggle-state", "closed");

      // Set up animation
      wrap.style.overflow = "hidden";
      wrap.style.transition = "height 0.3s ease";

      // Set height for closed state
      wrap.style.height = initialWrapHeight + "px";

      // Restore overflow after transition
      setTimeout(() => {
        wrap.style.overflow = originalOverflow;
      }, 350);
    }, 300); // 300ms delay before starting close animation
  };

  // Add hover event listeners
  if (toggleElement) {
    toggleElement.addEventListener("mouseenter", openDropdown);
    toggleElement.addEventListener("mouseleave", closeDropdown);
  }
});

// Navigation Bar Dropdown (Mobile)
document.addEventListener("DOMContentLoaded", () => {
  // Mobile check function
  const isMobile = () => window.matchMedia("(max-width: 991px)").matches;

  document
    .querySelector('[data-nav-element="toggle"]')
    .addEventListener("click", () => {
      // Only run on mobile
      if (!isMobile()) return;

      // Get elements
      const toggle = document.querySelector('[data-nav-element="toggle"]');
      const dropdown = document.querySelector('[data-nav-element="dropdown"]');
      const nest = document.querySelector('[data-nav-element="nest"]');

      // Toggle state
      const currentState = toggle.getAttribute("data-toggle-state");
      const newState = currentState === "open" ? "closed" : "open";
      toggle.setAttribute("data-toggle-state", newState);

      // Toggle display before animating height
      if (newState === "open") {
        dropdown.style.display = "flex";
      }

      // Get the total height needed
      const nestHeight = nest.offsetHeight;

      // Set up animation
      dropdown.style.transition = "height 0.3s ease";
      dropdown.style.overflow = "hidden";

      // Set height based on state
      if (newState === "open") {
        dropdown.style.height = `${nestHeight}px`;
      } else {
        dropdown.style.height = "0px";
        // Wait for animation to complete before hiding
        setTimeout(() => {
          if (toggle.getAttribute("data-toggle-state") === "closed") {
            dropdown.style.display = "none";
          }
        }, 300); // Match the transition duration
      }
    });
});

//Swiper Component
document.addEventListener("DOMContentLoaded", function () {
  const component = document.getElementById("swiper-component");
  if (component) {
    // Force loop mode to false for finite swiper
    const loopMode = false;

    let sliderDuration = 300;
    if (component.getAttribute("slider-duration") !== undefined) {
      sliderDuration = +component.getAttribute("slider-duration");
    }

    const swiperElement = document.getElementById("swiper");
    const swiper = new Swiper(swiperElement, {
      speed: sliderDuration,
      autoHeight: false,
      centeredSlides: false, // Don't center - align to left
      followFinger: true,
      freeMode: false,
      slideToClickedSlide: true, // Allow clicking on slides to navigate
      slidesPerView: 1,
      spaceBetween: "4%",
      rewind: false,
      loop: false, // Set to false for finite swiper
      direction: "horizontal",
      mousewheel: {
        forceToAxis: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      a11y: {
        slideRole: "link",
      },
      breakpoints: {
        // mobile landscape
        480: {
          slidesPerView: 1,
          spaceBetween: 8,
        },
        // tablet
        768: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        // desktop
        992: {
          slidesPerView: 3,
          spaceBetween: 16,
        },
      },
      navigation: {
        nextEl: "#swiper-next",
        prevEl: "#swiper-prev",
        disabledClass: "is-disabled", // Will be applied at start/end
      },
      scrollbar: {
        el: "#swiper-drag-wrapper",
        draggable: true,
        dragClass: "swiper-drag",
        snapOnRelease: true,
        dragSize: "auto",
      },
      slideActiveClass: "is-active",
      slideDuplicateActiveClass: "is-active",
    });
  }
});

//Blog Articles Filters
document.addEventListener("DOMContentLoaded", function () {
  const allFilter = document.querySelector('[data-cmsfilter-element="all"]');
  const categoryFilters = document.querySelectorAll(
    '[data-cmsfilter-element]:not([data-cmsfilter-element="all"])',
  );

  // Add a direct click handler for the all filter to ensure it becomes active when clicked
  allFilter.addEventListener(
    "click",
    function () {
      // Ensure "all" is active when clicked
      if (!allFilter.classList.contains("is-active")) {
        allFilter.classList.add("is-active");
      }

      // Optional: Deactivate all categories when "all" is clicked
      categoryFilters.forEach((el) => el.classList.remove("is-active"));
    },
    true,
  ); // Using capture phase to try to run before other handlers

  // Set up a MutationObserver to watch for class changes on categories
  const observer = new MutationObserver(function (mutations) {
    // Process mutations to check if any category became active
    const categoryMutations = mutations.filter(
      (m) => m.target !== allFilter && m.attributeName === "class",
    );

    if (categoryMutations.length > 0) {
      // Check if any category has the is-active class
      const anyActiveCategories = Array.from(categoryFilters).some((el) =>
        el.classList.contains("is-active"),
      );

      // If any category is active, remove is-active from "all"
      if (anyActiveCategories && allFilter.classList.contains("is-active")) {
        allFilter.classList.remove("is-active");
      }
    }
  });

  // Observe category filters for class changes
  categoryFilters.forEach((el) => {
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
  });
});

//FAQ Accordions
document.addEventListener("DOMContentLoaded", function () {
  // Heights storage object
  const drawerHeights = {};

  function initializeAccordions() {
    const toggles = document.querySelectorAll("[data-acc-toggle]");
    toggles.forEach((toggle, index) => {
      // Get drawer element
      const drawer = toggle.querySelector("[data-acc-drawer]");
      if (drawer) {
        // Store the drawer's content height
        const drawerContent = drawer.firstElementChild;
        const height = drawerContent.offsetHeight;
        // Store height in our object using a unique key
        const drawerId = "drawer-" + index;
        drawerHeights[drawerId] = height;
        // Set initial height to 0
        drawer.style.height = "0px";
        drawer.style.overflow = "hidden";
        drawer.style.transition = "height 0.3s ease-in-out";
        // Add data attribute to link toggle with drawer
        toggle.setAttribute("data-drawer-id", drawerId);
      }
      // Add click event listener
      toggle.addEventListener("click", handleAccordionClick);
    });
  }

  function openAccordion(toggle) {
    const drawerId = toggle.getAttribute("data-drawer-id");
    const drawer = toggle.querySelector("[data-acc-drawer]");
    // Update toggle state
    toggle.setAttribute("data-toggle-state", "open");
    // Animate height
    drawer.style.height = drawerHeights[drawerId] + "px";
  }

  function closeAccordion(toggle) {
    const drawer = toggle.querySelector("[data-acc-drawer]");
    // Update toggle state
    toggle.setAttribute("data-toggle-state", "closed");
    // Animate height back to 0
    drawer.style.height = "0px";
  }

  function handleAccordionClick(event) {
    const toggle = event.currentTarget;

    const toggleState = toggle.getAttribute("data-toggle-state");
    if (toggleState === "closed") {
      // Close all other accordions in all components
      closeAllOtherAccordions(toggle);
      // Open this accordion
      openAccordion(toggle);
    } else {
      // Close this accordion
      closeAccordion(toggle);
    }
  }

  function closeAllOtherAccordions(currentToggle) {
    // Find all open accordions across all components
    const allOpenToggles = document.querySelectorAll(
      '[data-acc-toggle][data-toggle-state="open"]',
    );
    allOpenToggles.forEach((toggle) => {
      if (toggle !== currentToggle) {
        closeAccordion(toggle);
      }
    });
  }

  // Initialize accordions on page load
  initializeAccordions();

  // Add click event listener for pagination button
  document.addEventListener("click", function (event) {
    if (
      event.target.hasAttribute("data-acc-load") ||
      event.target.closest("[data-acc-load]")
    ) {
      // When pagination button is clicked, reinitialize accordions
      // after a small delay to allow for DOM updates
      setTimeout(function () {
        initializeAccordions();
      }, 300);
    }
  });
});

//Policy Accordions
document.addEventListener("DOMContentLoaded", () => {
  // Height storage maps
  const summaryHeights = new Map();
  const overviewHeights = new Map();

  // Calculate heights function
  function calculateAccordionHeights() {
    console.log("Calculating accordion heights...");

    // Summary accordions
    document.querySelectorAll("[data-summ-offset]").forEach((element) => {
      const id = element.getAttribute("data-summ-offset");
      const height = element.scrollHeight;
      summaryHeights.set(id, height);
      console.log(`Summary accordion ${id} height: ${height}px`);
    });

    // Overview accordions
    document.querySelectorAll("[data-ow-offset]").forEach((element) => {
      const id = element.getAttribute("data-ow-offset");
      const height = element.scrollHeight;
      overviewHeights.set(id, height);
      console.log(`Overview accordion ${id} height: ${height}px`);
    });
  }

  // Function to update heights of already-open accordions
  function updateOpenAccordions() {
    document
      .querySelectorAll("[data-toggle-state='open']")
      .forEach((toggle) => {
        const type = toggle.hasAttribute("data-summ-toggle") ? "summ" : "ow";
        const id = toggle.getAttribute(`data-${type}-toggle`);
        const drawer = document.querySelector(`[data-${type}-drawer="${id}"]`);
        const heights = type === "summ" ? summaryHeights : overviewHeights;

        if (drawer && heights.get(id)) {
          drawer.style.height = `${heights.get(id)}px`;
          console.log(
            `Updated ${type} accordion ${id} with new height: ${heights.get(id)}px`,
          );
        }
      });
  }

  // Toggle accordion states
  function toggleAccordion(type, id, forceState = null) {
    const toggle = document.querySelector(`[data-${type}-toggle="${id}"]`);
    const drawer = document.querySelector(`[data-${type}-drawer="${id}"]`);
    const heights = type === "summ" ? summaryHeights : overviewHeights;

    if (!toggle || !drawer) {
      console.log(`Toggle or drawer not found for ${type} ${id}`);
      return;
    }

    const currentState = toggle.getAttribute("data-toggle-state");
    const newState =
      forceState || (currentState === "closed" ? "open" : "closed");

    console.log(
      `Toggling ${type} accordion ${id} from ${currentState} to ${newState}`,
    );

    toggle.setAttribute("data-toggle-state", newState);
    drawer.style.height = newState === "open" ? `${heights.get(id)}px` : "0px";

    // Rotate indicator
    const indicator = toggle.querySelector(`[data-${type}-bar]`);
    if (indicator) {
      indicator.style.transform = newState === "open" ? "rotate(90deg)" : "";
    }
  }

  // Handle opposite state for summary/overview (updated for symmetrical behavior)
  function handleOppositeState(type, id) {
    console.log(`Handling opposite state for ${type} ${id}`);

    if (type === "summ") {
      // Get summary state and set overview to opposite
      const summaryState = document
        .querySelector(`[data-summ-toggle="${id}"]`)
        .getAttribute("data-toggle-state");
      toggleAccordion("ow", id, summaryState === "open" ? "closed" : "open");
    } else if (type === "ow") {
      // Get overview state and set summary to opposite
      const overviewState = document
        .querySelector(`[data-ow-toggle="${id}"]`)
        .getAttribute("data-toggle-state");
      toggleAccordion("summ", id, overviewState === "open" ? "closed" : "open");
    }
  }

  // Initialize accordion states
  function initializeAccordions() {
    console.log("Initializing accordions...");
    calculateAccordionHeights();

    // Set initial states
    document.querySelectorAll("[data-ow-toggle]").forEach((toggle) => {
      const id = toggle.getAttribute("data-ow-toggle");
      toggle.setAttribute("data-toggle-state", "open");
      const drawer = document.querySelector(`[data-ow-drawer="${id}"]`);
      drawer.style.height = `${overviewHeights.get(id)}px`;
    });

    document.querySelectorAll("[data-summ-toggle]").forEach((toggle) => {
      const id = toggle.getAttribute("data-summ-toggle");
      toggle.setAttribute("data-toggle-state", "closed");
      const drawer = document.querySelector(`[data-summ-drawer="${id}"]`);
      drawer.style.height = "0px";
    });
  }

  // Set up observers to detect display and size changes
  const accordionContainers = document.querySelectorAll(
    "[data-summ-offset], [data-ow-offset]",
  );

  // Get all tab panes that contain accordions
  const tabPanes = document.querySelectorAll("[data-tab-pane]");
  console.log("Found tab panes:", tabPanes.length);

  // Track visibility of panes
  const paneVisibility = new Map();
  tabPanes.forEach((pane) => {
    const id = pane.getAttribute("data-tab-pane");
    const isVisible = window.getComputedStyle(pane).display !== "none";
    paneVisibility.set(id, isVisible);
    console.log(`Initial pane ${id} visibility:`, isVisible);
  });

  // Set up ResizeObserver to detect when elements become visible
  const resizeObserver = new ResizeObserver((entries) => {
    console.log("ResizeObserver triggered");
    let visibilityChanged = false;

    // Check each observed element
    entries.forEach((entry) => {
      if (entry.target.hasAttribute("data-tab-pane")) {
        const id = entry.target.getAttribute("data-tab-pane");
        const wasVisible = paneVisibility.get(id);
        const isVisible =
          window.getComputedStyle(entry.target).display !== "none";

        // Update our tracked visibility
        paneVisibility.set(id, isVisible);

        if (!wasVisible && isVisible) {
          console.log(`Pane ${id} became visible`);
          visibilityChanged = true;
        }
      }
    });

    if (visibilityChanged) {
      console.log("Visibility changed, recalculating heights");
      setTimeout(() => {
        calculateAccordionHeights();
        updateOpenAccordions();
      }, 150);
    }
  });

  // Observe all tab panes for size changes
  tabPanes.forEach((pane) => {
    resizeObserver.observe(pane);
    console.log(
      `Observing size changes for pane ${pane.getAttribute("data-tab-pane")}`,
    );
  });

  // Also get parent containers that might change visibility
  const parentContainers = [];
  accordionContainers.forEach((accordion) => {
    let parent = accordion.parentElement;
    while (parent && !parentContainers.includes(parent)) {
      parentContainers.push(parent);
      parent = parent.parentElement;
    }
  });

  // Set up observer for display changes
  // Set up MutationObserver for attribute changes
  const observer = new MutationObserver((mutations) => {
    let displayChanged = false;

    mutations.forEach((mutation) => {
      // Check for tab pane state changes
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-tab-state"
      ) {
        const newValue = mutation.target.getAttribute("data-tab-state");
        console.log(`Tab pane state attribute changed to: ${newValue}`);
        if (newValue === "show") {
          displayChanged = true;
        }
      }
      // Check for direct style changes too
      else if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        console.log("Style attribute changed:", mutation.target);
        // Force check computed style
        const style = window.getComputedStyle(mutation.target);
        console.log("New computed display:", style.display);
        if (style.display !== "none") {
          displayChanged = true;
        }
      }
    });

    if (displayChanged) {
      console.log("Display change detected via MutationObserver");
      setTimeout(() => {
        calculateAccordionHeights();
        updateOpenAccordions();
      }, 150);
    }
  });

  // Check DOM periodically as a fallback
  function pollForVisibilityChanges() {
    tabPanes.forEach((pane) => {
      const id = pane.getAttribute("data-tab-pane");
      const wasVisible = paneVisibility.get(id);
      const isVisible = window.getComputedStyle(pane).display !== "none";

      if (!wasVisible && isVisible) {
        console.log(`Pane ${id} became visible (detected by polling)`);
        paneVisibility.set(id, isVisible);

        // Recalculate heights
        calculateAccordionHeights();
        updateOpenAccordions();
      }

      // Update current state
      paneVisibility.set(id, isVisible);
    });
  }

  // Poll every 500ms as absolute fallback
  const pollInterval = setInterval(pollForVisibilityChanges, 500);

  // Observe tab panes for attribute changes (especially data-tab-state)
  tabPanes.forEach((pane) => {
    observer.observe(pane, {
      attributes: true,
      attributeFilter: ["data-tab-state", "style", "class"],
    });
    console.log("Observing tab pane for visibility changes:", pane);
  });

  // Also observe parents for style and class changes
  parentContainers.forEach((container) => {
    observer.observe(container, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    console.log("Observing container for display changes:", container);
  });

  // Event Listeners (updated for symmetrical behavior)
  document.querySelectorAll("[data-summ-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const id = toggle.getAttribute("data-summ-toggle");
      toggleAccordion("summ", id);
      handleOppositeState("summ", id);
    });
  });

  document.querySelectorAll("[data-ow-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const id = toggle.getAttribute("data-ow-toggle");
      toggleAccordion("ow", id);
      handleOppositeState("ow", id); // Added this call for symmetrical behavior
    });
  });

  // Tab change listeners
  document.querySelectorAll("[data-tab-link]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab-link");
      console.log(`Tab click detected for tab ${tabId}`);

      // Force recalculation after tab click with increased delay
      setTimeout(() => {
        console.log(`Forced recalculation after tab ${tabId} click`);

        // Force visibility check on all panes
        tabPanes.forEach((pane) => {
          const paneId = pane.getAttribute("data-tab-pane");
          const isVisible = window.getComputedStyle(pane).display !== "none";
          console.log(`Pane ${paneId} visibility:`, isVisible);
        });

        initializeAccordions();
      }, 300);
    });
  });

  // Initial setup
  initializeAccordions();
});

//Blog Share Snippet
document.addEventListener("DOMContentLoaded", () => {
  // Find all elements with data-blog-share attribute
  const shareElements = document.querySelectorAll("[data-blog-share]");

  // Add click event listeners to each element
  shareElements.forEach((element) => {
    element.addEventListener("click", function () {
      const shareType = this.getAttribute("data-blog-share");

      if (shareType === "copy") {
        // Copy current URL to clipboard
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => {
            showToast("Copied to clipboard");
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
//
