// GSAP Navbar Slide
document.addEventListener("DOMContentLoaded", () => {
  // Check if desktop (screen width >= 992px)
  const isDesktop = () => window.matchMedia("(min-width: 992px)").matches;
  // Only run on desktop
  if (isDesktop()) {
    // Select navbars that don't have the blocked attribute
    const navbars = document.querySelectorAll(
      '[data-nav-element="navbar"]:not([data-slide-block="blocked"])',
    );
    if (navbars.length === 0) return;
    const showAnim = gsap
      .from(navbars, {
        yPercent: -100,
        paused: true,
        duration: 0.2,
      })
      .progress(1);
    // Track scroll position and direction
    let lastScrollTop = 0;
    const downScrollThreshold = 200; // Pixels to scroll down before hiding
    const upScrollThreshold = 800; // Pixels to scroll up before showing
    let accumulatedScroll = 0; // Track accumulated scroll in each direction
    let navbarVisible = true;
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollDirection = scrollTop > lastScrollTop ? "down" : "up";
      // Calculate scroll amount since last check
      const scrollAmount = Math.abs(scrollTop - lastScrollTop);

      console.log(`Direction: ${scrollDirection}, Amount: ${scrollAmount}`);

      // If direction changed, reset accumulated scroll
      if (
        (scrollDirection === "down" && accumulatedScroll < 0) ||
        (scrollDirection === "up" && accumulatedScroll > 0)
      ) {
        accumulatedScroll = 0;
        console.log("Direction changed, reset accumulated scroll");
      }
      // Accumulate scroll in the appropriate direction
      accumulatedScroll +=
        scrollDirection === "down" ? scrollAmount : -scrollAmount;

      console.log(`Accumulated: ${accumulatedScroll}`);

      // Check if we've scrolled enough in each direction with separate thresholds
      if (accumulatedScroll > downScrollThreshold && navbarVisible) {
        showAnim.reverse();
        navbarVisible = false;
        accumulatedScroll = 0; // Reset after action
        console.log("Navbar hidden");
      } else if (accumulatedScroll < -upScrollThreshold && !navbarVisible) {
        showAnim.play();
        navbarVisible = true;
        accumulatedScroll = 0; // Reset after action
        console.log("Navbar shown");
      }
      lastScrollTop = scrollTop;
    });
    setTimeout(() => {
      gsap.set(navbars, { yPercent: 0 });
    }, 10);
  }
});

//GSAP for Headings

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (typeof gsap === "undefined" || typeof SplitType === "undefined") {
      console.error("GSAP or SplitType is not loaded.");
      return;
    }

    // Add data attribute to target elements - MODIFIED to exclude elements with data-stagger-block
    document.querySelectorAll("h1, h2, p").forEach((element) => {
      // Only apply to elements that don't have the data-stagger-block attribute
      if (!element.hasAttribute("data-stagger-block")) {
        element.setAttribute("data-stagger-fade", "");
      }
    });
  }, 0);
});

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (typeof gsap === "undefined" || typeof SplitType === "undefined") {
      console.error("GSAP or SplitType is not loaded.");
      return;
    }

    // Split text by LINES ONLY
    const splitLines = new SplitType("[data-stagger-fade]", {
      types: "lines", // Explicitly specify ONLY lines (not words or chars)
      tagName: "span",
    });

    // Create wrappers for each line
    document.querySelectorAll("[data-stagger-fade] .line").forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("u-line-mask");
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    // Create animations
    document.querySelectorAll("[data-stagger-fade]").forEach((element) => {
      const tl = gsap.timeline({ paused: true });
      tl.from(element.querySelectorAll(".line"), {
        y: "200%",
        opacity: 0,
        duration: 0.5,
        ease: "power1.out",
        stagger: 0.1,
      });
      ScrollTrigger.create({
        trigger: element,
        start: "top 90%",
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        once: true,
      });
    });

    // Function to revert split
    function splitRevert() {
      document.querySelectorAll("[data-stagger-fade] .line").forEach((line) => {
        const wrapper = line.parentNode;
        wrapper.replaceWith(...wrapper.childNodes);
      });
      splitLines.revert();
    }

    // Ensure elements are visible
    gsap.set("[data-stagger-fade]", { opacity: 1 });
  }, 0);
});

//GSAP for Fading Grid
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined") {
    return;
  }

  if (typeof ScrollTrigger === "undefined") {
    return;
  }

  const grid = document.querySelector(".s-hm8_grid");
  if (!grid) {
    return;
  }

  const imageContainers = Array.from(grid.querySelectorAll(".s-hm8_image"));
  if (!imageContainers.length) {
    return;
  }

  gsap.set(imageContainers, { autoAlpha: 0, y: 20 });

  const randomizedImages = [...imageContainers].sort(() => Math.random() - 0.5);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: grid,
      start: "top 80%",
      once: true,
      toggleActions: "play none none none",
      markers: false,
    },
  });

  tl.to(randomizedImages, {
    duration: 0.8,
    autoAlpha: 1,
    y: 0,
    ease: "power2.out",
    stagger: {
      each: 0.15,
      from: "random",
    },
  });

  ScrollTrigger.refresh();
});

//GSAP for Text Reveal
document.addEventListener("DOMContentLoaded", function () {
  // Make sure GSAP and plugins are loaded
  if (
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined" ||
    typeof SplitType === "undefined"
  ) {
    console.error(
      "Required libraries (GSAP, ScrollTrigger, or SplitType) are not loaded",
    );
    return;
  }

  // Wait a moment to ensure the DOM is fully processed
  setTimeout(() => {
    // Target elements with data-motion-text="reveal" attribute
    const textElements = document.querySelectorAll(
      '[data-motion-text="reveal"]',
    );

    // Debug: Check if elements exist
    if (!textElements || textElements.length === 0) {
      console.error('Could not find elements with data-motion-text="reveal"');
      return;
    }

    // Process each element
    textElements.forEach((textElement, elementIndex) => {
      try {
        // Initialize SplitType to split the text into words
        const splitText = new SplitType(textElement, {
          types: "words",
          tagName: "span",
        });

        // Debug: Check if words were created
        if (!splitText.words || splitText.words.length === 0) {
          console.error(
            "SplitType did not create any word elements for",
            textElement,
          );
          return;
        }

        // Set initial state of all words - maintaining the 0.5 opacity
        gsap.set(splitText.words, {
          opacity: 0.5, // Match the CSS opacity
          y: "0px",
          ease: "power2.out",
        });

        // Set parent back to full opacity since children now have the opacity
        gsap.set(textElement, {
          opacity: 1,
        });

        // Get offset value from data attribute or use default 80%
        const offsetValue =
          textElement.getAttribute("data-motion-offset") || "80";
        const startTrigger = `top ${offsetValue}%`;

        // Create the scroll-triggered animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: textElement,
            start: startTrigger,
            end: "bottom 5%",
            scrub: 0.5,
            markers: false,
          },
        });

        // Add the animation to the timeline - animate from 0.5 to 1
        tl.to(splitText.words, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "power2.out",
          className: "+=active",
        });
      } catch (error) {
        console.error(
          `Error in text animation setup for element ${elementIndex + 1}:`,
          error,
        );
      }
    });
  }, 500); // Wait 500ms for everything to be properly loaded
});

//GSAP for Cards
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    // Check if required libraries exist
    if (typeof gsap === "undefined" || typeof SplitType === "undefined") {
      console.error("GSAP or SplitType is not loaded.");
      return;
    }

    // Check if desktop (screen width >= 992px)
    const isDesktop = () => window.matchMedia("(min-width: 992px)").matches;

    // Only run on desktop
    if (!isDesktop()) {
      console.log("Card hover animations disabled on mobile");
      return;
    }

    // Set up text splitting for hover hide effect
    const splitTextLines = new SplitType("[data-hover-text]", {
      types: "lines", // Explicitly specify ONLY lines
      tagName: "span",
    });

    // Create wrappers for each line - these act as masks
    document.querySelectorAll("[data-hover-text] .line").forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("u-line-mask");
      wrapper.style.overflow = "hidden"; // Ensure the mask hides overflowing content
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    // Set up hover interactions for cards
    document.querySelectorAll("[data-hover-card]").forEach((card) => {
      // Get associated elements
      const textElements = card.querySelectorAll("[data-hover-text]");
      const bgElement = card.querySelector("[data-hover-bg]");
      const arrowElement = card.querySelector("[data-hover-arrow]");

      // Skip if required elements are missing
      if (!bgElement || !arrowElement) {
        console.warn(
          `Card ${card.id || "unnamed"} is missing required elements`,
        );
        return;
      }

      // Store initial and target heights
      const parentHeight = card.parentElement.offsetHeight;
      const initialHeight = parentHeight * 0.7; // 70% of parent height
      const targetHeight = parentHeight; // 100% of parent height

      // Set initial height
      gsap.set(card, { height: initialHeight, overflow: "hidden" });

      // Create quickTo animations for smooth transitions
      const arrowOpacity = gsap.quickTo(arrowElement, "opacity", {
        duration: 0.3,
        ease: "power2.inOut",
      });
      const bgOpacity = gsap.quickTo(bgElement, "opacity", {
        duration: 0.3,
        ease: "power2.inOut",
      });
      const cardHeight = gsap.quickTo(card, "height", {
        duration: 0.3,
        ease: "power2.inOut",
      });

      // Create text animation timeline for each text element
      const textTimelines = [];

      textElements.forEach((textElement) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(textElement.querySelectorAll(".line"), {
          y: "20px", // Move down to hide behind mask
          duration: 0.3,
          ease: "power2.inOut",
          stagger: 0.05,
        });
        textTimelines.push(tl);
      });

      // Add hover event listeners
      card.addEventListener("mouseenter", () => {
        card.classList.add("active");
        arrowOpacity(1);
        bgOpacity(1);
        cardHeight(targetHeight);
        textTimelines.forEach((tl) => tl.play());
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("active");
        arrowOpacity(0);
        bgOpacity(0);
        cardHeight(initialHeight);
        textTimelines.forEach((tl) => tl.reverse());
      });

      // Set initial properties
      gsap.set(arrowElement, { opacity: 0 });
      gsap.set(bgElement, { opacity: 0 });

      // Handle text elements properly (textElements is a NodeList, not a single element)
      textElements.forEach((textElement) => {
        gsap.set(textElement.querySelectorAll(".line"), { y: 0, opacity: 1 });
      });
    });

    // Function to revert split if needed (for cleanup)
    function revertSplitText() {
      document.querySelectorAll("[data-hover-text] .line").forEach((line) => {
        const wrapper = line.parentNode;
        wrapper.replaceWith(...wrapper.childNodes);
      });
      splitTextLines.revert();
    }

    // Listen for window resize to recalculate heights
    window.addEventListener(
      "resize",
      _.debounce(() => {
        // Only update if we're still on desktop
        if (isDesktop()) {
          document.querySelectorAll("[data-hover-card]").forEach((card) => {
            const parentHeight = card.parentElement.offsetHeight;
            const initialHeight = parentHeight * 0.7;

            // Check if card is currently hovered/active
            if (card.classList.contains("active")) {
              gsap.set(card, { height: parentHeight });
            } else {
              gsap.set(card, { height: initialHeight });
            }
          });
        }
      }, 250),
    );
  }, 0);
});

//GSAP for Images
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) are not loaded");
    return;
  }

  // Register ScrollTrigger plugin to be safe
  gsap.registerPlugin(ScrollTrigger);

  // Target all elements with data-motion-element="image" attribute
  const imageContainers = document.querySelectorAll(
    '[data-motion-element="image"]',
  );

  // Debug: Check if elements exist
  if (!imageContainers || imageContainers.length === 0) {
    console.error('Could not find elements with data-motion-element="image"');
    return;
  }

  // Process each image container individually
  imageContainers.forEach((container, index) => {
    try {
      // Find the child element (the image)
      const imageElement = container.children[0];

      if (!imageElement) {
        console.error(`Container ${index + 1} has no child elements`);
        return;
      }

      // Check if we're dealing with an image element
      const isImg = imageElement.tagName.toLowerCase() === "img";

      // Function to set up and animate the container
      const setupAndAnimate = () => {
        // Get the original height of the container
        const finalHeight = container.offsetHeight;

        // Set the container's height explicitly to prevent layout shifts
        container.style.height = `${finalHeight}px`;
        container.style.overflow = "hidden";

        // Create a curtain wrapper
        const curtain = document.createElement("div");
        curtain.setAttribute("data-motion-element", "curtain");
        curtain.style.overflow = "hidden";
        curtain.style.width = "100%";
        curtain.style.position = "relative";

        // Move the image into the curtain
        container.appendChild(curtain);
        curtain.appendChild(imageElement);

        // Set initial state - curtain height 0 and opacity 0
        gsap.set(curtain, {
          height: 0,
          opacity: 0.4,
        });

        // Create individual ScrollTrigger for each container
        ScrollTrigger.create({
          trigger: container,
          start: "top 85%", // Start when top of container reaches 85% of viewport
          markers: false, // Enable for debugging
          once: true, // Only play once
          onEnter: () => {
            // Create and play animation when this specific element enters viewport
            gsap.to(curtain, {
              height: finalHeight,
              opacity: 1,
              duration: 1.2,
              ease: "power2.inOut",
            });
          },
        });
      };

      // If it's an image element, check if it's loaded
      if (isImg) {
        if (imageElement.complete) {
          setupAndAnimate();
        } else {
          imageElement.addEventListener("load", () => {
            setupAndAnimate();
          });

          // Also handle error case
          imageElement.addEventListener("error", () => {
            console.error(
              `Image ${index + 1} failed to load, setting up animation anyway`,
            );
            setupAndAnimate();
          });
        }
      } else {
        // Not an image element, proceed with setup
        setupAndAnimate();
      }
    } catch (error) {
      console.error(
        `Error in image animation setup for element ${index + 1}:`,
        error,
      );
    }
  });
});

//GSAP for Objects
document.addEventListener("DOMContentLoaded", function () {
  // Make sure GSAP and ScrollTrigger are loaded
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) are not loaded");
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Wait a moment to ensure everything is loaded
  setTimeout(() => {
    // Target all elements with data-motion-element="objects" attribute
    const cardContainers = document.querySelectorAll(
      '[data-motion-element="objects"]',
    );

    if (!cardContainers || cardContainers.length === 0) {
      console.error(
        'Could not find elements with data-motion-element="objects"',
      );
      return;
    }

    // Process each card container
    cardContainers.forEach((container, containerIndex) => {
      try {
        // Get all direct children
        const cardElements = Array.from(container.children);

        if (!cardElements || cardElements.length === 0) {
          console.error(
            `Container ${containerIndex + 1} has no child elements`,
          );
          return;
        }

        // Set initial state - all cards invisible
        gsap.set(cardElements, {
          opacity: 0,
          y: 20,
        });

        // Create the animation timeline (paused until scrolled to)
        const tl = gsap.timeline({
          paused: true,
        });

        // Add the staggered animation
        tl.to(cardElements, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: "power2.out",
        });

        // Create ScrollTrigger
        ScrollTrigger.create({
          trigger: container,
          start: "top 95%", // Start when the top of the container reaches 75% of viewport
          markers: false, // Set to true for debugging
          once: true, // Add once: true to prevent replaying the animation
          onEnter: () => {
            tl.play(0); // Play from the beginning
          },
          // Deliberately NOT using onRefresh to avoid playing for elements already in view
        });
      } catch (error) {
        console.error(
          `Error in card animation setup for container ${containerIndex + 1}:`,
          error,
        );
      }
    });
  }, 200);
});

//GSAP for single elememts
document.addEventListener("DOMContentLoaded", function () {
  // Make sure GSAP and ScrollTrigger are loaded
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) are not loaded");
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Target all elements with data-motion-element="single" attribute
  const singleElements = document.querySelectorAll(
    '[data-motion-element="single"]',
  );

  if (!singleElements || singleElements.length === 0) {
    console.error('Could not find elements with data-motion-element="single"');
    return;
  }

  // Filter elements that don't have data-motion-state="blocked"
  const animatableElements = Array.from(singleElements).filter((element) => {
    const motionState = element.getAttribute("data-motion-state");
    const isBlocked = motionState === "blocked";
    return !isBlocked;
  });

  // Process each eligible element
  animatableElements.forEach((element, index) => {
    try {
      // Set initial state - invisible and slightly moved down
      gsap.set(element, {
        opacity: 0,
        y: 20,
      });

      // Create the animation timeline (paused until scrolled to)
      const tl = gsap.timeline({
        paused: true,
      });

      // Add the animation
      tl.to(element, {
        opacity: 1,
        delay: 0.2,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      // Create ScrollTrigger
      ScrollTrigger.create({
        trigger: element,
        start: "top 95%", // Start when the top of the element reaches 80% of viewport
        markers: false, // Set to true for debugging
        once: true, // Set replay to false by using once: true
        onEnter: () => {
          tl.play(0); // Play from the beginning
        },
      });
    } catch (error) {
      console.error(
        `Error in animation setup for element ${index + 1}:`,
        error,
      );
    }
  });
});

//GSAP for Navigation (Features Sequence)
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) not loaded");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Get all nav cells
  const navCells = document.querySelectorAll("[data-motion-seq='cell']");
  if (!navCells.length) {
    console.error("No nav cells found with [data-motion-seq='cell']");
    return;
  }

  // Initialize first cell as active
  const firstCell = document.querySelector(
    "[data-seq-index='1'][data-motion-seq='cell']",
  );
  if (firstCell) {
    firstCell.classList.add("active");
  } else {
    console.error("First nav cell not found");
  }

  // Setup scroll triggers for all cells except the first one
  navCells.forEach((cell) => {
    const seqIndex = cell.getAttribute("data-seq-index");
    if (seqIndex === "1") return; // Skip first cell

    const scrollUnit = document.querySelector(
      `[data-seq-index='${seqIndex}'][data-motion-seq='scroll']`,
    );
    if (!scrollUnit) {
      console.error(`No scroll unit found for nav cell ${seqIndex}`);
      return;
    }

    // Create ScrollTrigger for this nav cell
    ScrollTrigger.create({
      trigger: scrollUnit,
      start: "top 40%", // Activate when scroll unit is 10% in view
      markers: false,
      onEnter: () => {
        // Remove active class from previous cell
        const prevIndex = parseInt(seqIndex) - 1;
        const prevCell = document.querySelector(
          `[data-seq-index='${prevIndex}'][data-motion-seq='cell']`,
        );
        if (prevCell) {
          prevCell.classList.remove("active");
        }

        // Add active class to current cell
        cell.classList.add("active");
      },
      onLeaveBack: () => {
        // Remove active class from current cell
        cell.classList.remove("active");

        // Add active class to previous cell
        const prevIndex = parseInt(seqIndex) - 1;
        const prevCell = document.querySelector(
          `[data-seq-index='${prevIndex}'][data-motion-seq='cell']`,
        );
        if (prevCell) {
          prevCell.classList.add("active");
        }
      },
    });

    // Add click functionality to nav cells
    cell.addEventListener("click", () => {
      const scrollTo = document.querySelector(
        `[data-seq-index='${seqIndex}'][data-motion-seq='scroll']`,
      );
      if (scrollTo) {
        scrollTo.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Add click functionality to first cell
  if (firstCell) {
    firstCell.addEventListener("click", () => {
      const scrollTo = document.querySelector(
        "[data-seq-index='1'][data-motion-seq='scroll']",
      );
      if (scrollTo) {
        scrollTo.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});

//GSAP for Scale Hover
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined") {
    console.error("GSAP library is not loaded");
    return;
  }
  const scaleElements = document.querySelectorAll("[data-motion-scale]");
  if (!scaleElements || scaleElements.length === 0) {
    return;
  }
  scaleElements.forEach((element, index) => {
    try {
      // Use simple tweens instead of quickTo
      element.addEventListener("mouseenter", () => {
        gsap.to(element, {
          scale: 1.05,
          duration: 0.6,
          ease: "power2.inOut",
        });
      });
      element.addEventListener("mouseleave", () => {
        gsap.to(element, {
          scale: 1,
          duration: 0.6,
          ease: "power2.inOut",
        });
      });
    } catch (error) {
      console.error(
        `Error in scale animation setup for element ${index + 1}:`,
        error,
      );
    }
  });
});

//GSAP for blog progress
document.addEventListener("DOMContentLoaded", function () {
  // Get references to the elements
  const progressContainer = document.querySelector(
    '[data-duration-el="progress"]',
  );
  const progressBar = document.querySelector('[data-duration-el="bar"]');
  const scrollContent = document.querySelector('[data-duration-el="scroll"]');

  // Initialize GSAP
  gsap.registerPlugin(ScrollTrigger);

  // Check if content is long enough to need a progress bar
  const checkContentHeight = () => {
    if (!scrollContent || !progressBar) return;

    // Get content height and viewport height
    const contentHeight = scrollContent.offsetHeight;
    const viewportHeight = window.innerHeight;

    // If content is less than 120vh, hide progress bar and skip animation
    if (contentHeight < viewportHeight * 1.2) {
      console.log("Content too short for progress bar, hiding");
      gsap.set(progressBar, { width: 0 });
      if (progressContainer) {
        progressContainer.style.display = "none";
      }
      return false;
    }

    return true;
  };

  // Set initial state
  gsap.set(progressBar, { width: 0 });

  // Only create scroll animation if content is long enough
  if (checkContentHeight()) {
    // Create the scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContent,
        start: "top top",
        end: "bottom 70%",
        scrub: true,
        onEnter: () => console.log("Scroll content entered viewport"),
        onLeave: () => console.log("Scroll content left viewport"),
        onEnterBack: () => console.log("Scroll content entered viewport again"),
        onLeaveBack: () => console.log("Scroll content left viewport again"),
      },
    });

    // Animation to scale the progress bar
    tl.to(progressBar, {
      width: "100%",
      ease: "none",
    });
  }

  // Update on resize
  window.addEventListener("resize", checkContentHeight);
});

/*
//GSAP for Cards (Features Sequence)
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) not loaded");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Set initial state for all cards
  const cardGroups = document.querySelectorAll("[data-motion-seq='cards']");
  if (!cardGroups.length) {
    console.error("No card groups found with [data-motion-seq='cards']");
    return;
  }

  // Initialize all card groups to be hidden initially
  cardGroups.forEach((cardGroup) => {
    const seqIndex = cardGroup.getAttribute("data-seq-index");
    gsap.set(cardGroup, {
      y: "100%",
    });

    // Set z-index based on sequence index
    const zIndex = parseInt(seqIndex) * 2;
    cardGroup.style.zIndex = zIndex;
  });

  // Create scroll animations for each card group
  cardGroups.forEach((cardGroup) => {
    const seqIndex = cardGroup.getAttribute("data-seq-index");
    const scrollUnit = document.querySelector(
      `[data-seq-index='${seqIndex}'][data-motion-seq='scroll']`,
    );

    if (!scrollUnit) {
      console.error(`No scroll unit found for card group ${seqIndex}`);
      return;
    }

    // Create card animation timeline
    const tl = gsap.timeline({ paused: true });
    tl.to(cardGroup, {
      y: 0,
      duration: 0.8,
      ease: "power2.inOut",
    });

    // Create ScrollTrigger
    ScrollTrigger.create({
      trigger: scrollUnit,
      start: "top 80%",
      end: "top 20%",
      markers: false,
      onEnter: () => {
        tl.play();
      },
      onLeaveBack: () => {
        tl.reverse();
      },
    });
  });
});

//GSAP for Images (Features Section)
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) not loaded");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Get all image containers
  const imageContainers = document.querySelectorAll(
    "[data-motion-seq='image']",
  );
  if (!imageContainers.length) {
    console.error("No image containers found with [data-motion-seq='image']");
    return;
  }

  // Setup all image containers with curtains
  imageContainers.forEach((container) => {
    try {
      const seqIndex = container.getAttribute("data-seq-index");

      // Find the child element (the image)
      const imageElement = container.children[0];
      if (!imageElement) {
        console.error(`Image container ${seqIndex} has no child elements`);
        return;
      }

      // Get original height and set container style
      const finalHeight = container.offsetHeight;
      container.style.height = `${finalHeight}px`;
      container.style.overflow = "hidden";

      // Set z-index based on sequence index
      const zIndex = parseInt(seqIndex) * 2;
      container.style.zIndex = zIndex;

      // Create curtain wrapper
      const curtain = document.createElement("div");
      curtain.setAttribute("data-motion-element", "curtain");
      curtain.style.overflow = "hidden";
      curtain.style.width = "100%";
      curtain.style.position = "relative";

      // Move image into curtain
      container.appendChild(curtain);
      curtain.appendChild(imageElement);

      // Set initial state - curtain height 0
      gsap.set(curtain, {
        height: 0,
      });

      // Find corresponding scroll unit
      const scrollUnit = document.querySelector(
        `[data-seq-index='${seqIndex}'][data-motion-seq='scroll']`,
      );
      if (!scrollUnit) {
        console.error(`No scroll unit found for image ${seqIndex}`);
        return;
      }

      // Create animation timeline
      const tl = gsap.timeline({ paused: true });
      tl.to(curtain, {
        height: finalHeight,
        duration: 1.6,
        ease: "power2.out",
      });

      // Create ScrollTrigger
      ScrollTrigger.create({
        trigger: scrollUnit,
        start: "top 40%",
        markers: false,
        onEnter: () => {
          tl.play();
        },
        onLeaveBack: () => {
          tl.reverse();
        },
      });
    } catch (error) {
      console.error(`Error in image animation setup: ${error.message}`);
    }
  });
});

//GSAP for Text (Features Section)
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) not loaded");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Find all heading blocks
  const headingBlocks = document.querySelectorAll(
    "[data-motion-seq='heading']",
  );
  if (!headingBlocks.length) {
    console.error("No heading blocks found with [data-motion-seq='heading']");
    return;
  }

  // Get all sequence indexes and sort them
  const seqIndexes = [];
  headingBlocks.forEach((block) => {
    const index = block.getAttribute("data-seq-index");
    if (!seqIndexes.includes(index)) {
      seqIndexes.push(index);
    }
  });
  seqIndexes.sort((a, b) => parseInt(a) - parseInt(b));

  // Initialize all heading blocks (except first)
  headingBlocks.forEach((block) => {
    const seqIndex = block.getAttribute("data-seq-index");

    // Set z-index
    const zIndex = parseInt(seqIndex) * 2;
    block.style.zIndex = zIndex;

    // Set initial state (first block visible, others hidden)
    if (seqIndex !== "1") {
      gsap.set(block, { opacity: 0 });
    }
  });

  // Create animations for each heading block
  seqIndexes.forEach((seqIndex, i) => {
    const block = document.querySelector(
      `[data-seq-index='${seqIndex}'][data-motion-seq='heading']`,
    );
    const currentScrollUnit = document.querySelector(
      `[data-seq-index='${seqIndex}'][data-motion-seq='scroll']`,
    );

    if (!block || !currentScrollUnit) {
      console.error(`Missing elements for chapter ${seqIndex}`);
      return;
    }

    // Create entry animation
    const entryTimeline = gsap.timeline({ paused: true });
    entryTimeline.to(block, {
      opacity: 1,
      duration: 0.2,
      ease: "power1.out",
    });

    // If not the first chapter, trigger entry based on PREVIOUS scroll unit
    if (seqIndex !== "1") {
      const prevIndex = seqIndexes[i - 1];
      const prevScrollUnit = document.querySelector(
        `[data-seq-index='${prevIndex}'][data-motion-seq='scroll']`,
      );

      if (prevScrollUnit) {
        // Create ScrollTrigger for entry based on PREVIOUS scroll unit
        ScrollTrigger.create({
          trigger: prevScrollUnit,
          start: "bottom 40%", // When previous unit is 60% scrolled out
          markers: false,
          onEnter: () => {
            entryTimeline.play();
          },
          onLeaveBack: () => {
            entryTimeline.reverse();
          },
        });
      }
    }

    // Create exit animation (if not the last block)
    if (i < seqIndexes.length - 1) {
      const exitTimeline = gsap.timeline({ paused: true });
      exitTimeline.to(block, {
        opacity: 0,
        duration: 0.2,
        ease: "power1.in",
      });

      // Create ScrollTrigger for exit based on CURRENT scroll unit
      ScrollTrigger.create({
        trigger: currentScrollUnit,
        start: "bottom 80%", // When 40% of current unit remains visible
        markers: false,
        onEnter: () => {
          exitTimeline.play();
          console.log(
            `Heading block ${seqIndex} exit triggered by current scroll unit`,
          );
        },
        onLeaveBack: () => {
          exitTimeline.reverse();
          console.log(`Heading block ${seqIndex} exit reversed`);
        },
      });
    }
  });
});

*/
