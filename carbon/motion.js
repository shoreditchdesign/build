console.log("motion deployed");

//GSAP for Popups
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.querySelector("[data-share-popup]");
  if (popup) {
    gsap.registerPlugin(ScrollTrigger);
    const popupHeight = popup.offsetHeight;
    const conversionDistance =
      parseFloat(popup.getAttribute("data-popup-distance")) || 1.5;
    gsap.fromTo(
      popup,
      { y: popupHeight },
      { y: 0, duration: 0.5, paused: true },
    );
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        if (self.scroll() > window.innerHeight * conversionDistance) {
          gsap.to(popup, { y: 0 });
        } else {
          gsap.to(popup, { y: 2 * popupHeight });
        }
      },
    });
  } else {
    console.warn("Share banner not found");
  }
});

//GSAP for Navbar Tuck
document.addEventListener("DOMContentLoaded", () => {
  const navbars = document.querySelectorAll(
    '[data-nav-element="navbar-wrap"]:not([data-tuck-block="blocked"])',
  );
  if (navbars.length === 0) {
    console.warn("No navbar elements found - animation aborted");
    return;
  }

  // Set initial attribute state
  navbars.forEach((navbar) => {
    navbar.setAttribute("data-tuck-state", "default");
  });

  gsap.set(navbars, { yPercent: 0, translateY: "0%" });
  const showAnim = gsap
    .from(navbars, {
      yPercent: -100,
      paused: true,
      duration: 0.2,
    })
    .progress(1);
  let lastScrollTop = 0;
  const downScrollThreshold = 200;
  const upScrollThreshold = 200;
  let accumulatedScroll = 0;
  let navbarVisible = true;
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollDirection = scrollTop > lastScrollTop ? "down" : "up";
    const scrollAmount = Math.abs(scrollTop - lastScrollTop);
    if (
      (scrollDirection === "down" && accumulatedScroll < 0) ||
      (scrollDirection === "up" && accumulatedScroll > 0)
    ) {
      accumulatedScroll = 0;
    }
    accumulatedScroll +=
      scrollDirection === "down" ? scrollAmount : -scrollAmount;
    if (accumulatedScroll > downScrollThreshold && navbarVisible) {
      showAnim.reverse();
      navbarVisible = false;
      accumulatedScroll = 0;

      // Set attribute to default when hiding navbar (reverse animation)
      navbars.forEach((navbar) => {
        navbar.setAttribute("data-tuck-state", "default");
      });
    } else if (accumulatedScroll < -upScrollThreshold && !navbarVisible) {
      showAnim.play();
      navbarVisible = true;
      accumulatedScroll = 0;

      // Set attribute to hidden when showing navbar (play animation)
      navbars.forEach((navbar) => {
        navbar.setAttribute("data-tuck-state", "hidden");
      });
    }
    lastScrollTop = scrollTop;
  });
});

//GSAP for Preloader
document.addEventListener("DOMContentLoaded", () => {
  const preloaderContainer = document.querySelector('[data-pl-shader="wrap"]');

  if (!preloaderContainer) {
    console.warn("Preloader: Component not found, skipping animations");
    return;
  }
  // Animation Constants
  const ANIMATION = {
    shader: {
      initialOpacity: 1,
      finalOpacity: 0,
      initialX: 0,
      finalX: "0px",
      shaderDelay: 2.2,
      shaderFadeOutDuration: 0.6,
      bgDelay: -0.6,
      bgFadeOutDuration: 1.2,
      ease: "power2.inOut",
    },
    hero: {
      swoosh: {
        duration: 0.3,
        initialPosition: "100%",
        finalPosition: "0%",
        ease: "power2.out",
        initialDelay: 2.6,
        staggerDelay: 0.3,
        fadeInDuration: 0.1,
      },
      fade: {
        duration: 0.8,
        initialPosition: "-40px",
        finalPosition: "0px",
        initialOpacity: 0,
        finalOpacity: 1,
        ease: "power2.out",
        initialDelay: 3.2,
        staggerDelay: 0.3,
      },
      text: {
        letterDuration: 0.06,
        initialDelay: 0.1,
        staggerDelay: 0.3,
        ease: "power1.inOut",
      },
    },
    body: {
      duration: 0.2,
      ease: "power2.out",
    },
  };

  // Selectors
  const selectors = {
    shader: {
      wrap: '[data-pl-shader="wrap"]',
      canvas: '[data-pl-shader="canvas"]',
      bg: '[data-pl-shader="bg"]',
    },
    hero: {
      headingContainer: "[data-pl-text]",
      headings: "[data-pl-heading]",
      spans: "[data-pl-span]",
      arrows: "[data-pl-arrow]",
    },
    main: "main",
  };

  function createShaderAnimation() {
    const shaderWrap = document.querySelector(selectors.shader.wrap);
    const shaderCanvas = document.querySelector(selectors.shader.canvas);
    const shaderBg = document.querySelector(selectors.shader.bg);

    if (!shaderWrap || !shaderCanvas) {
      console.warn("Preloader: Shader elements not found");
      return gsap.timeline();
    }

    const tl = gsap.timeline({
      onStart: () => {},
      onComplete: () => {},
    });

    // Set initial state
    gsap.set(shaderWrap, { opacity: 1 });
    gsap.set(shaderCanvas, {
      x: ANIMATION.shader.initialX,
      opacity: ANIMATION.shader.initialOpacity,
      visibility: "visible",
    });

    if (shaderBg) {
      gsap.set(shaderBg, { opacity: 1 });
    }

    // Hold the shader in view for specified duration
    tl.to(shaderCanvas, {
      duration: ANIMATION.shader.shaderDelay,
      onStart: () => {},
    });

    // Then translate and fade out
    tl.to(shaderCanvas, {
      x: ANIMATION.shader.finalX,
      opacity: ANIMATION.shader.finalOpacity,
      duration: ANIMATION.shader.shaderFadeOutDuration,
      ease: ANIMATION.shader.ease,
      onStart: () => {},
    });

    // Wait before fading out background
    if (shaderBg) {
      tl.to({}, { duration: ANIMATION.shader.bgDelay });

      tl.to(shaderBg, {
        opacity: 0,
        duration: ANIMATION.shader.bgFadeOutDuration,
        ease: ANIMATION.shader.ease,
        onStart: () => {},
      });
    }

    return tl;
  }

  function createShowBodyAnimation() {
    const mainElement = document.querySelector(selectors.main);

    if (!mainElement) {
      console.warn("Preloader: Main element not found");
      return gsap.timeline();
    }

    const tl = gsap.timeline({
      onStart: () => {},
      onComplete: () => {},
    });

    // Set initial state
    gsap.set(mainElement, { opacity: 0 });

    // Fade in body
    tl.to(mainElement, {
      opacity: 1,
      duration: ANIMATION.body.duration,
      ease: ANIMATION.body.ease,
      onStart: () => {},
    });

    return tl;
  }

  // Create text animation functions
  function createTextAnimation() {
    const headingContainer = document.querySelector(
      selectors.hero.headingContainer,
    );
    const headings = document.querySelectorAll(selectors.hero.headings);
    const spans = document.querySelectorAll(selectors.hero.spans);

    if (!headingContainer || !headings.length || !spans.length) {
      console.error("Preloader: Hero text elements not found");
      return gsap.timeline();
    }

    const tl = gsap.timeline({
      onStart: () => {},
      onComplete: () => {},
    });

    // Store original widths and split text
    spans.forEach((span) => {
      const width = span.offsetWidth;
      gsap.set(span, { width: width });
    });

    // Split headings into characters
    headings.forEach((heading) => {
      const splitText = new SplitType(heading, { types: "chars" });
      if (splitText.chars) {
        gsap.set(splitText.chars, { opacity: 0 });
      }
    });

    return tl;
  }

  function playSwooshAnimations() {
    const arrows = document.querySelectorAll(selectors.hero.arrows);

    if (!arrows.length) {
      console.error("Preloader: Arrow elements not found");
      return gsap.timeline();
    }

    const tl = gsap.timeline({
      onStart: () => {},
      onComplete: () => {},
    });

    // Set initial state for all arrows
    gsap.set(arrows, {
      right: ANIMATION.hero.swoosh.initialPosition,
      opacity: 0,
    });

    // Animate each arrow with stagger
    arrows.forEach((arrow, index) => {
      // Create individual swoosh animation
      const swooshTl = gsap.timeline();

      // First fade in the arrow
      swooshTl.to(arrow, {
        opacity: 1,
        duration: ANIMATION.hero.swoosh.fadeInDuration,
        onStart: () => {},
      });

      // Then animate from right to left
      swooshTl.to(arrow, {
        right: ANIMATION.hero.swoosh.finalPosition,
        duration: ANIMATION.hero.swoosh.duration,
        ease: ANIMATION.hero.swoosh.ease,
        onStart: () => {},
      });

      // Add to main timeline with stagger
      tl.add(swooshTl, index * ANIMATION.hero.swoosh.staggerDelay);
    });

    return tl;
  }

  function playTextScrambleAnimations() {
    const headings = document.querySelectorAll(selectors.hero.headings);

    if (!headings.length) {
      console.error("Preloader: Text elements not found");
      return gsap.timeline();
    }

    const tl = gsap.timeline({
      onStart: () => {},
      onComplete: () => {},
    });

    // Animate each heading with stagger
    headings.forEach((heading, index) => {
      // Get split characters
      const chars = heading.querySelectorAll(".char");

      if (!chars.length) {
        console.error(`Preloader: Scramble failed at heading ${index + 1}`);
        return;
      }

      // Randomize characters for animation order
      const randomChars = [...chars].sort(() => Math.random() - 0.5);

      // Create individual text animation timeline
      const textTl = gsap.timeline({
        onStart: () => {},
      });

      // Animate each character with fade in
      randomChars.forEach((char, charIndex) => {
        textTl.to(
          char,
          {
            opacity: 1,
            duration: ANIMATION.hero.text.letterDuration,
            ease: ANIMATION.hero.text.ease,
          },
          charIndex * ANIMATION.hero.text.letterDuration,
        );
      });

      // Add to main timeline with stagger after corresponding swoosh
      tl.add(textTl, index * ANIMATION.hero.text.staggerDelay);
    });

    return tl;
  }

  function playTextFadeAnimations() {
    const headings = document.querySelectorAll(selectors.hero.headings);

    if (!headings.length) {
      console.error("Preloader: Heading elements not found");
      return gsap.timeline();
    }

    const tl = gsap.timeline({
      onStart: () => {},
      onComplete: () => {},
    });

    // Set initial state for all headings
    gsap.set(headings, {
      translateX: ANIMATION.hero.fade.initialPosition,
      opacity: ANIMATION.hero.fade.initialOpacity,
    });

    // Animate each heading with stagger
    headings.forEach((heading, index) => {
      // Create individual fade animation
      const fadeTl = gsap.timeline();

      fadeTl.to(heading, {
        translateX: ANIMATION.hero.fade.finalPosition,
        opacity: ANIMATION.hero.fade.finalOpacity,
        duration: ANIMATION.hero.fade.duration,
        ease: ANIMATION.hero.fade.ease,
        onStart: () => {},
      });

      // Add to main timeline with stagger
      tl.add(fadeTl, index * ANIMATION.hero.fade.staggerDelay);
    });

    return tl;
  }

  // Calculate body show timing (halfway between shader and swoosh)
  const bodyShowDelay =
    (ANIMATION.shader.shaderDelay + ANIMATION.hero.swoosh.initialDelay) / 2;

  // Create master timeline
  const masterTimeline = gsap.timeline();

  masterTimeline.add(createShaderAnimation(), 0);
  masterTimeline.add(createShowBodyAnimation(), bodyShowDelay);
  masterTimeline.add(
    playSwooshAnimations(),
    ANIMATION.hero.swoosh.initialDelay,
  );
  masterTimeline.add(
    playTextFadeAnimations(),
    ANIMATION.hero.fade.initialDelay,
  );

  // masterTimeline.add(playTextScrambleAnimations(), ANIMATION.hero.text.initialDelay);

  masterTimeline.play();
});

//GSAP for Graphene Preloader
document.addEventListener("DOMContentLoaded", () => {
  //Variables
  const ANIMATION = {
    duration: 6,
    p1: {
      yStart: "-150vh",
      yEnd: "-80vh",
      startTranslate: 0,
      endTranslate: 6,
      startFade: 0,
      endFade: 1,
      ease: "power1.inOut",
    },
    p2: {
      yStart: "80vh",
      yEnd: "-10vh",
      startTranslate: 0,
      endTranslate: 4,
      startFade: 0,
      endFade: 1.2,
      ease: "power2.out",
    },
    s1: {
      yStart: "30vh",
      yEnd: "0vh",
      startTranslate: 0,
      endTranslate: 5,
      startFade: 0,
      endFade: 1.4,
      ease: "power1.inOut",
    },
    s2: {
      yStart: "0vh",
      yEnd: "0vh",
      startTranslate: 0,
      endTranslate: 5,
      startFade: 0,
      endFade: 1.4,
      ease: "power1.inOut",
    },
    angulars: {
      p1s1: {
        startFade: 0,
        endFade: 12,
        ease: "power2.out",
      },
      p2s2: {
        startFade: 2,
        endFade: 6,
        ease: "power2.out",
      },
    },
  };

  //Query Selectors
  const selectors = {
    component: "[data-gpl-component]",
    hexGroup: "[data-gpl-group]",
    hexElements: {
      p1: '[data-gpl-hex="p1"]',
      p2: '[data-gpl-hex="p2"]',
      s1: '[data-gpl-hex="s1"]',
      s2: '[data-gpl-hex="s2"]',
    },
    angElements: {
      p1: '[data-gpl-ang="p1"]',
      p2: '[data-gpl-ang="p2"]',
      s1: '[data-gpl-ang="s1"]',
      s2: '[data-gpl-ang="s2"]',
    },
  };

  //Initialisers
  const initPreloader = () => {
    const preloaderComponent = document.querySelector(selectors.component);
    if (!preloaderComponent) {
      console.warn("Graphene Preloader: component not found");
      return null;
    }

    if (typeof gsap === "undefined") {
      console.error("GSAP library not loaded");
      return null;
    }

    gsap.set(selectors.hexElements.p1, { y: ANIMATION.p1.yStart, opacity: 0 });
    gsap.set(selectors.hexElements.p2, { y: ANIMATION.p2.yStart, opacity: 0 });
    gsap.set(selectors.hexElements.s1, { y: ANIMATION.s1.yStart, opacity: 0 });
    gsap.set(selectors.hexElements.s2, { y: ANIMATION.s2.yStart, opacity: 0 });
    gsap.set(
      [
        selectors.angElements.p1,
        selectors.angElements.p2,
        selectors.angElements.s1,
        selectors.angElements.s2,
      ],
      { opacity: 1 },
    );

    return createPreloaderAnimation();
  };

  const createPreloaderAnimation = () => {
    const timeline = gsap.timeline({
      onStart: () => {},
      onComplete: () => {},
      onUpdate: () => {},
    });

    timeline.to(
      selectors.hexElements.p1,
      {
        opacity: 1,
        duration: ANIMATION.p1.endFade - ANIMATION.p1.startFade,
        ease: ANIMATION.p1.ease,
        force3D: true,
      },
      ANIMATION.p1.startFade,
    );

    timeline.to(
      selectors.hexElements.p2,
      {
        opacity: 1,
        duration: ANIMATION.p2.endFade - ANIMATION.p2.startFade,
        ease: ANIMATION.p2.ease,
        force3D: true,
      },
      ANIMATION.p2.startFade,
    );

    timeline.to(
      selectors.hexElements.s1,
      {
        opacity: 1,
        duration: ANIMATION.s1.endFade - ANIMATION.s1.startFade,
        ease: ANIMATION.s1.ease,
        force3D: true,
      },
      ANIMATION.s1.startFade,
    );

    timeline.to(
      selectors.hexElements.s2,
      {
        opacity: 1,
        duration: ANIMATION.s2.endFade - ANIMATION.s2.startFade,
        ease: ANIMATION.s2.ease,
        force3D: true,
      },
      ANIMATION.s2.startFade,
    );

    //P1 Aniamtion
    timeline.to(
      selectors.hexElements.p1,
      {
        y: ANIMATION.p1.yEnd,
        duration: ANIMATION.p1.endTranslate - ANIMATION.p1.startTranslate,
        ease: ANIMATION.p1.ease,
        force3D: true,
      },
      ANIMATION.p1.startTranslate,
    );

    //P2 Aniamtion
    timeline.to(
      selectors.hexElements.p2,
      {
        y: ANIMATION.p2.yEnd,
        duration: ANIMATION.p2.endTranslate - ANIMATION.p2.startTranslate,
        ease: ANIMATION.p2.ease,
        force3D: true,
      },
      ANIMATION.p2.startTranslate,
    );

    //S1 Aniamtion
    timeline.to(
      selectors.hexElements.s1,
      {
        y: ANIMATION.s1.yEnd,
        duration: ANIMATION.s1.endTranslate - ANIMATION.s1.startTranslate,
        ease: ANIMATION.s1.ease,
        force3D: true,
      },
      ANIMATION.s1.startTranslate,
    );

    //S2 Aniamtion
    timeline.to(
      selectors.hexElements.s2,
      {
        y: ANIMATION.s2.yEnd,
        duration: ANIMATION.s2.endTranslate - ANIMATION.s2.startTranslate,
        ease: ANIMATION.s2.ease,
        force3D: true,
      },
      ANIMATION.s2.startTranslate,
    );

    //Angulars Aniamtion
    timeline.to(
      [selectors.angElements.p1, selectors.angElements.s1],
      {
        opacity: 0,
        duration:
          ANIMATION.angulars.p1s1.endFade - ANIMATION.angulars.p1s1.startFade,
        ease: ANIMATION.angulars.p1s1.ease,
        onStart: () => {},
      },
      ANIMATION.angulars.p1s1.startFade,
    );

    timeline.to(
      [selectors.angElements.p2, selectors.angElements.s2],
      {
        opacity: 0,
        duration:
          ANIMATION.angulars.p2s2.endFade - ANIMATION.angulars.p2s2.startFade,
        ease: ANIMATION.angulars.p2s2.ease,
        onStart: () => {},
      },
      ANIMATION.angulars.p2s2.startFade,
    );

    return timeline;
  };

  const preloaderTimeline = initPreloader();
  if (preloaderTimeline) {
    preloaderTimeline.play();
  }
});

//GSAP for Graphene Parallax
document.addEventListener("DOMContentLoaded", () => {
  //Variables
  const PARALLAX = {
    scrollDuration: "100%",
    p1: {
      speed: -0.6,
      ease: "none",
    },
    p2: {
      speed: -0.8,
      ease: "none",
    },
    s1: {
      speed: -1,
      ease: "none",
    },
    s2: {
      speed: -0.8,
      ease: "none",
    },
  };

  //Query Selectors
  const selectors = {
    component: "[data-gpl-component]",
    hexGroup: "[data-gpl-group]",
    hexElements: {
      p1: '[data-gpl-hex="p1"]',
      p2: '[data-gpl-hex="p2"]',
      s1: '[data-gpl-hex="s1"]',
      s2: '[data-gpl-hex="s2"]',
    },
    angElements: {
      p1: '[data-gpl-ang="p1"]',
      p2: '[data-gpl-ang="p2"]',
      s1: '[data-gpl-ang="s1"]',
      s2: '[data-gpl-ang="s2"]',
    },
  };

  //Initialisers
  const initParallax = () => {
    const parallaxComponent = document.querySelector(selectors.component);
    if (!parallaxComponent) {
      console.warn("Graphene Preloader: Parallax component not found");
      return null;
    }

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.error("GSAP or ScrollTrigger library not loaded");
      return null;
    }

    gsap.registerPlugin(ScrollTrigger);

    return createParallaxAnimation(parallaxComponent);
  };

  const createParallaxAnimation = (triggerElement) => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "top top",
        end: `bottom+=${window.innerHeight * 2} bottom`,
        scrub: true,
        markers: false,
        onUpdate: (self) => {
          const progress = Math.round(self.progress * 100);
          if (progress % 25 === 0) {
            console.log(`Scroll progress: ${progress}%`);
          }
        },
      },
      onStart: () => console.log("Parallax animation started"),
      onComplete: () => console.log("Parallax animation completed"),
    });

    // Add p1 parallax
    addHexParallax(timeline, selectors.hexElements.p1, PARALLAX.p1);

    // Add p2 parallax
    addHexParallax(timeline, selectors.hexElements.p2, PARALLAX.p2);

    // Add s1 parallax
    addHexParallax(timeline, selectors.hexElements.s1, PARALLAX.s1);

    // Add s2 parallax
    addHexParallax(timeline, selectors.hexElements.s2, PARALLAX.s2);

    return timeline;
  };

  // Composable function for hex parallax
  const addHexParallax = (timeline, selector, config) => {
    const element = document.querySelector(selector);
    if (!element) {
      console.error(`Graphene Preloader: Hex selector failed at: ${selector}`);
      return;
    }

    const yTravel = config.speed * window.innerHeight;

    timeline.to(
      selector,
      {
        y: `+=${yTravel}`,
        ease: config.ease,
        force3D: true,
      },
      0,
    );

    //console.log(`Added parallax for ${selector} with speed ${config.speed}`);
    return timeline;
  };

  // Initialize parallax with a 6-second delay
  setTimeout(() => {
    const parallaxTimeline = initParallax();

    // Handle window resize to update parallax values
    window.addEventListener("resize", () => {
      if (parallaxTimeline) {
        // Refresh ScrollTrigger and update values
        ScrollTrigger.refresh();
        console.log("Parallax values updated after resize");
      }
    });
  }, 6000);
});

//GSAP for Graphene Marquee
document.addEventListener("DOMContentLoaded", () => {
  // Configuration
  const config = {
    animation: {
      duration: 1,
      ease: "power1.inOut",
      scrub: true,
    },
    selectors: {
      wrapper: '[data-parallax-marquee="wrap"]',
      rows: '[data-parallax-marquee="row"]',
    },
    translation: {
      distance: 300, // Translation distance in pixels
    },
  };

  // Selectors
  const elements = {
    wrapper: document.querySelector(config.selectors.wrapper),
    row1: document.querySelector('[data-marquee-id="1"]'),
    row2: document.querySelector('[data-marquee-id="2"]'),
  };

  // Initializers
  function initMarqueeAnimation() {
    // Check if required elements exist
    if (!elements.wrapper || !elements.row1 || !elements.row2) {
      console.warn("Graphene marquee elements not found");
      return;
    }

    // Set initial state
    gsap.set([elements.row1, elements.row2], { x: 0 });

    // Create scroll-triggered animation
    createMarqueeScrollAnimation();
  }

  // Animation creators
  function createMarqueeScrollAnimation() {
    // Create timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: elements.wrapper,
        start: "top bottom",
        end: "bottom top",
        scrub: config.animation.scrub,
        onEnter: () => {},
        onLeave: () => {},
        onEnterBack: () => {},
        onLeaveBack: () => {},
      },
    });

    // Add animations to timeline
    tl.to(
      elements.row1,
      {
        x: -config.translation.distance,
        ease: config.animation.ease,
        duration: config.animation.duration,
      },
      0,
    );

    tl.to(
      elements.row2,
      {
        x: config.translation.distance,
        ease: config.animation.ease,
        duration: config.animation.duration,
      },
      0,
    );
  }

  // Initialize
  initMarqueeAnimation();
});

//GSAP for Graphene Flow
document.addEventListener("DOMContentLoaded", () => {
  // Configuration
  const config = {
    selectors: {
      chapter: {
        container: '[data-sq-list="trigger"]',
        items: '[data-sq-index][data-sq-item="trigger"]',
      },
      video: {
        container: '[data-sq-list="video"]',
        items: '[data-sq-index][data-sq-item="video"]',
      },
      orb: {
        container: '[data-sq-list="trigger"]',
        items: '[data-sq-index][data-sq-item="orb"]',
      },
    },
    animation: {
      duration: 0.75,
      orbDuration: 0.375,
      ease: "power2.inOut",
    },
    triggers: {
      orbStart: "top top",
    },
  };

  // Initializers
  function initChapterAnimations() {
    // Check if GSAP and ScrollTrigger are available
    if (!window.gsap) {
      console.error("GSAP not found. Please ensure it is loaded.");
      return;
    }

    // Register ScrollTrigger plugin
    if (!window.ScrollTrigger) {
      console.error(
        "ScrollTrigger plugin not found. Please ensure it is loaded.",
      );
      return;
    }

    // Register the ScrollTrigger plugin with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Get DOM elements
    const chapterItems = document.querySelectorAll(
      `${config.selectors.chapter.container} ${config.selectors.chapter.items}`,
    );
    const videoItems = document.querySelectorAll(
      `${config.selectors.video.container} ${config.selectors.video.items}`,
    );
    const orbItems = document.querySelectorAll(
      `${config.selectors.orb.container} ${config.selectors.orb.items}`,
    );

    // Validate DOM elements
    if (!chapterItems.length || !videoItems.length || !orbItems.length) {
      console.warn("Graphene flow not found");
      return;
    }

    // Initialize videos and orbs
    initVideoStates(videoItems);
    initOrbStates(orbItems);

    // Set up scroll triggers for each chapter
    createVideoScrollTriggers(chapterItems, videoItems);
    createOrbScrollTriggers(chapterItems, orbItems);
  }

  function initVideoStates(items) {
    // On mobile, show all videos
    if (window.innerWidth <= 991) {
      gsap.set(items, { opacity: 1 });
      return;
    }

    gsap.set(items, { opacity: 0 });
    gsap.set(items[0], { opacity: 1 }); // First video visible
  }

  function initOrbStates(items) {
    gsap.set(items, { opacity: 0 }); // All orbs hidden
    // gsap.set(items[0], { opacity: 1 }); // First orb visible
  }

  // Animation creators
  function createVideoScrollTriggers(chapterItems, videoItems) {
    // Skip video scroll triggers on mobile
    if (window.innerWidth <= 991) {
      return;
    }

    const lastIndex = chapterItems.length;

    chapterItems.forEach((chapter, idx) => {
      // Convert to 1-based index to match data-sq-index
      const currentIndex = idx + 1;

      // For scrolling down - use onEnter
      ScrollTrigger.create({
        trigger: chapter,
        start: "top center",
        onEnter: () => {
          handleItemEnter(currentIndex, lastIndex, videoItems);
        },
        markers: false,
        id: `chapter-${currentIndex}-video-enter`,
      });

      // For scrolling up - use onLeave on the next chapter if it exists
      if (currentIndex < lastIndex) {
        ScrollTrigger.create({
          trigger: chapterItems[idx + 1], // Next chapter
          start: "top bottom",
          onLeaveBack: () => {
            handleItemLeaveBack(currentIndex + 1, lastIndex, videoItems);
          },
          markers: false,
          id: `chapter-${currentIndex + 1}-video-leave`,
        });
      }
    });
  }

  function createOrbScrollTriggers(chapterItems, orbItems) {
    chapterItems.forEach((chapter, idx) => {
      // Convert to 1-based index to match data-sq-index
      const currentIndex = idx + 1;
      const currentOrb = orbItems[idx]; // 0-based array index

      // Create single ScrollTrigger for enter and leaveBack
      ScrollTrigger.create({
        trigger: chapter,
        start: config.triggers.orbStart,
        onEnter: () => {
          handleOrbEnter(currentOrb, currentIndex);
        },
        onLeaveBack: () => {
          handleOrbLeaveBack(currentOrb, currentIndex);
        },
        markers: false,
        id: `chapter-${currentIndex}-orb`,
      });
    });
  }

  function handleOrbEnter(orbItem, index) {
    if (!orbItem) {
      console.error(`Orb ${index} not found`);
      return;
    }

    gsap.to(orbItem, {
      opacity: 1,
      duration: config.animation.orbDuration,
      ease: config.animation.ease,
      onStart: () => console.log(`Orb ${index} fading in`),
    });
  }

  function handleOrbLeaveBack(orbItem, index) {
    if (!orbItem) {
      console.error(`Orb ${index} not found`);
      return;
    }

    gsap.to(orbItem, {
      opacity: 0,
      duration: config.animation.orbDuration,
      ease: config.animation.ease,
      onStart: () => console.log(`Orb ${index} fading out`),
    });
  }

  function handleItemEnter(currentIndex, lastIndex, items) {
    // Create and play transition animation
    const timeline = createTransitionTimeline(
      items[currentIndex - 2], // Previous item (currentIndex-1)-1 due to 0-based array
      items[currentIndex - 1], // Current item (currentIndex-1) due to 0-based array
    );

    timeline.play();
  }

  function handleItemLeaveBack(currentIndex, lastIndex, items) {
    // Skip animation for first chapter
    if (currentIndex <= 1) {
      return;
    }

    // Create and play transition animation (reverse direction)
    const timeline = createTransitionTimeline(
      items[currentIndex - 1], // Current item
      items[currentIndex - 2], // Previous item
    );

    timeline.play();
  }

  function createTransitionTimeline(fadeOutItem, fadeInItem) {
    const tl = gsap.timeline({
      onStart: () => {},
      onComplete: () => {},
    });

    tl.to(fadeOutItem, {
      opacity: 0,
      duration: config.animation.duration / 2,
      ease: config.animation.ease,
      onStart: () => {},
    });

    tl.to(
      fadeInItem,
      {
        opacity: 1,
        duration: config.animation.duration / 2,
        ease: config.animation.ease,
        onStart: () => {},
      },
      `-=${config.animation.duration / 4}`,
    ); // Slight overlap for smoother transition

    return tl;
  }

  // Initialize animation
  initChapterAnimations();

  // Cleanup function for SPA environments
  function cleanup() {
    ScrollTrigger.killAll();
  }

  // Expose cleanup for external use if needed
  window.grapheneFlowCleanup = cleanup;
});

//GSAP for Graphene Cursor
document.addEventListener("DOMContentLoaded", () => {
  // Animation Constants
  const ANIMATION = {
    cursor: {
      // Tracking settings
      duration: 0.6, // Animation duration
      ease: "power3", // Easing function
      fadeInDelay: 0.3, // Delay before fading in
      fadeInDuration: 0.8, // Duration for fade in

      // Pulsating effect
      pulseDuration: 2, // Duration of one pulse cycle
      pulseMinScale: 0.95, // Min scale during pulse
      pulseMaxScale: 1.05, // Max scale during pulse
      pulseMinOpacity: 0.85, // Min opacity during pulse
      pulseMaxOpacity: 1, // Max opacity during pulse
      pulseEase: "sine.inOut", // Smooth sine wave for pulsating
    },
  };

  // Selectors
  const selectors = {
    cursor: {
      wrap: "[data-cursor-wrap]",
      orb: "[data-cursor-orb]",
    },
  };

  // Initialize cursor tracking
  function initCursorTracking() {
    const cursorWrap = document.querySelector(selectors.cursor.wrap);
    const cursorOrb = document.querySelector(selectors.cursor.orb);

    if (!cursorWrap || !cursorOrb) {
      console.warn("Cursor elements not found");
      return;
    }

    // Set initial state - hide cursor wrap
    gsap.set(cursorWrap, {
      opacity: 0,
    });

    // Center alignment for the orb
    gsap.set(cursorOrb, {
      xPercent: -50,
      yPercent: -50,
    });

    // Create optimized animation functions using quickTo for the orb
    const xTo = gsap.quickTo(cursorOrb, "x", {
      duration: ANIMATION.cursor.duration,
      ease: ANIMATION.cursor.ease,
    });

    const yTo = gsap.quickTo(cursorOrb, "y", {
      duration: ANIMATION.cursor.duration,
      ease: ANIMATION.cursor.ease,
    });

    // Get initial cursor position (center of screen if not available)
    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;

    // Position orb at initial position immediately
    xTo(initialX);
    yTo(initialY);

    // Add mouse tracking
    window.addEventListener("mousemove", (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    // Fade in cursor wrap after a short delay
    gsap.to(cursorWrap, {
      opacity: 1,
      duration: ANIMATION.cursor.fadeInDuration,
      delay: ANIMATION.cursor.fadeInDelay,
      ease: "power2.out",
    });

    // Create pulsating animation for the orb
    createCursorPulseAnimation(cursorOrb);
  }

  // Create the pulsating animation
  function createCursorPulseAnimation(cursorElement) {
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
    });

    tl.to(cursorElement, {
      scale: ANIMATION.cursor.pulseMaxScale,
      opacity: ANIMATION.cursor.pulseMaxOpacity,
      duration: ANIMATION.cursor.pulseDuration / 2,
      ease: ANIMATION.cursor.pulseEase,
    }).to(cursorElement, {
      scale: ANIMATION.cursor.pulseMinScale,
      opacity: ANIMATION.cursor.pulseMinOpacity,
      duration: ANIMATION.cursor.pulseDuration / 2,
      ease: ANIMATION.cursor.pulseEase,
    });

    return tl;
  }

  // Initialize the animations
  initCursorTracking();
});

//GSAP for Headings
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (typeof gsap === "undefined" || typeof SplitType === "undefined") {
      console.error("GSAP or SplitType is not loaded.");
      return;
    }
    document.querySelectorAll("h1, p").forEach((element) => {
      if (element.getAttribute("data-motion-state") !== "blocked") {
        element.setAttribute("data-motion-text", "");
      }
    });
  }, 0);
});

// window.addEventListener("DOMContentLoaded", () => {
//   function isAboveFold(element) {
//     const rect = element.getBoundingClientRect();
//     const windowHeight = window.innerHeight;
//     return rect.top < windowHeight && rect.bottom > 0;
//   }

//   setTimeout(() => {
//     if (
//       typeof gsap === "undefined" ||
//       typeof SplitType === "undefined" ||
//       typeof ScrollTrigger === "undefined"
//     ) {
//       console.error(
//         "Required libraries (GSAP, SplitType, or ScrollTrigger) are not loaded",
//       );
//       return;
//     }

//     gsap.registerPlugin(ScrollTrigger);

//     const splitLines = new SplitType("[data-motion-text]", {
//       types: "lines",
//       tagName: "span",
//     });

//     document
//       .querySelectorAll("[data-motion-text] .line")
//       .forEach((line, index) => {
//         const wrapper = document.createElement("div");
//         wrapper.classList.add("u-line-mask");
//         line.parentNode.insertBefore(wrapper, line);
//         wrapper.appendChild(line);
//       });

//     const textElements = document.querySelectorAll("[data-motion-text]");

//     textElements.forEach((element, index) => {
//       const delay = element.getAttribute("data-motion-delay")
//         ? parseFloat(element.getAttribute("data-motion-delay"))
//         : 0;

//       const tl = gsap.timeline({
//         paused: true,
//         onStart: () => {},
//         onComplete: () => {},
//       });

//       tl.from(element.querySelectorAll(".line"), {
//         y: "0%",
//         opacity: 0,
//         duration: 0.8,
//         ease: "power1.out",
//         stagger: 0.15,
//       });

//       const isAbove = isAboveFold(element);

//       if (isAbove) {
//         setTimeout(() => {
//           tl.play();
//         }, delay * 1000);
//       } else {
//         ScrollTrigger.create({
//           trigger: element,
//           start: "top 90%",
//           markers: false,
//           once: true,
//           onEnter: () => {
//             tl.play(0);
//           },
//         });
//       }
//     });

//     function partialCleanup() {
//       // Only clean up ScrollTrigger instances, keep DOM structure
//       ScrollTrigger.getAll().forEach((trigger) => {
//         if (
//           trigger.vars.trigger &&
//           trigger.vars.trigger.hasAttribute("data-motion-text")
//         ) {
//           trigger.kill();
//         }
//       });
//       // Don't call splitLines.revert() or DOM manipulation to preserve layout
//     }

//     // Expose partial cleanup for external use
//     window.grapheneTextCleanup = partialCleanup;

//     gsap.set("[data-motion-text]", { opacity: 1 });
//   }, 0);
// });

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    function isAboveFold(element) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      return rect.top < windowHeight && rect.bottom > 0;
    }

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.error(
        "Required libraries (GSAP or ScrollTrigger) are not loaded",
      );
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const textElements = document.querySelectorAll("[data-motion-text]");

    if (!textElements || textElements.length === 0) {
      console.warn("Motion: Text elements not found");
      return;
    }

    textElements.forEach((element, index) => {
      try {
        const delay = element.getAttribute("data-motion-delay")
          ? parseFloat(element.getAttribute("data-motion-delay"))
          : 0;

        // Set initial state
        gsap.set(element, {
          opacity: 0,
          y: 0,
        });

        // Create timeline
        const tl = gsap.timeline({
          paused: true,
        });

        tl.to(element, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        });

        const isAbove = isAboveFold(element);

        if (isAbove) {
          setTimeout(() => {
            tl.play(0);
          }, delay * 1000);
        } else {
          ScrollTrigger.create({
            trigger: element,
            start: "top 95%",
            markers: false,
            once: true,
            onEnter: () => {
              tl.play(0);
            },
          });
        }
      } catch (error) {
        console.error(
          `Motion: Text animation setup failed at ${index + 1}:`,
          error,
        );
      }
    });
  }, 100);
});

//GSAP for Arrays
document.addEventListener("DOMContentLoaded", function () {
  function isAboveFold(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    return rect.top < windowHeight && rect.bottom > 0;
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) are not loaded");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  setTimeout(() => {
    const cardContainers = document.querySelectorAll(
      '[data-motion-element="array"]',
    );

    if (!cardContainers || cardContainers.length === 0) {
      console.warn('Motion: Array elements not found"');
      return;
    }

    cardContainers.forEach((container, containerIndex) => {
      try {
        const delay = container.getAttribute("data-motion-delay")
          ? parseFloat(container.getAttribute("data-motion-delay"))
          : 0;

        const cardElements = Array.from(container.children);

        if (!cardElements || cardElements.length === 0) {
          console.error(`Array ${containerIndex + 1} has no child elements`);
          return;
        }

        gsap.set(cardElements, {
          opacity: 0,
          y: 0,
        });

        const tl = gsap.timeline({
          paused: true,
        });

        tl.to(cardElements, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
        });

        const isAbove = isAboveFold(container);

        if (isAbove) {
          setTimeout(() => {
            tl.play(0);
          }, delay * 1000);
        } else {
          ScrollTrigger.create({
            trigger: container,
            start: "top 95%",
            markers: false,
            once: true,
            onEnter: () => {
              tl.play(0);
            },
          });
        }
      } catch (error) {
        console.error(
          `Motion: Array setup failed at ${containerIndex + 1}:`,
          error,
        );
      }
    });
  }, 200);
});

//GSAP for Single Elements
document.addEventListener("DOMContentLoaded", function () {
  function isAboveFold(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    return rect.top < windowHeight && rect.bottom > 0;
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) are not loaded");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const singleElements = document.querySelectorAll(
    '[data-motion-element="single"]',
  );

  if (!singleElements || singleElements.length === 0) {
    console.warn("Moiton: Single elements not found");
    return;
  }

  const animatableElements = Array.from(singleElements).filter((element) => {
    const motionState = element.getAttribute("data-motion-state");
    const isBlocked = motionState === "blocked";
    return !isBlocked;
  });

  animatableElements.forEach((element, index) => {
    try {
      const delay = element.getAttribute("data-motion-delay")
        ? parseFloat(element.getAttribute("data-motion-delay"))
        : 0;

      // Set initial state
      gsap.set(element, {
        opacity: 0,
        y: 0,
      });

      // Create timeline
      const tl = gsap.timeline({
        paused: true,
      });

      tl.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      const isAbove = isAboveFold(element);

      if (isAbove) {
        // For above-fold elements, wait delay seconds after DOM load
        setTimeout(() => {
          tl.play(0);
        }, delay * 1000);
      } else {
        // For below-fold elements, use ScrollTrigger with NO DELAY
        ScrollTrigger.create({
          trigger: element,
          start: "top 95%",
          markers: false,
          once: true,
          onEnter: () => {
            tl.play(0); // No delay here!
          },
        });
      }
    } catch (error) {
      console.error(
        `Motion: Single animation setup failed at ${index + 1}:`,
        error,
      );
    }
  });
});

//GSAP for Fade Up Elements
document.addEventListener("DOMContentLoaded", function () {
  function isAboveFold(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    return rect.top < windowHeight && rect.bottom > 0;
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) are not loaded");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const fadeUpElements = document.querySelectorAll(
    '[data-motion-element="fadeup"]',
  );

  if (!fadeUpElements || fadeUpElements.length === 0) {
    console.warn("Motion: Fade up elements not found");
    return;
  }

  const animatableElements = Array.from(fadeUpElements).filter((element) => {
    const motionState = element.getAttribute("data-motion-state");
    const isBlocked = motionState === "blocked";
    return !isBlocked;
  });

  animatableElements.forEach((element, index) => {
    try {
      const delay = element.getAttribute("data-motion-delay")
        ? parseFloat(element.getAttribute("data-motion-delay"))
        : 0;

      // Set initial state
      gsap.set(element, {
        opacity: 0,
        yPercent: 50,
      });

      // Create timeline
      const tl = gsap.timeline({
        paused: true,
      });

      tl.to(element, {
        opacity: 1,
        yPercent: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      const isAbove = isAboveFold(element);

      if (isAbove) {
        // For above-fold elements, wait delay seconds after DOM load
        setTimeout(() => {
          tl.play(0);
        }, delay * 1000);
      } else {
        // For below-fold elements, use ScrollTrigger with NO DELAY
        ScrollTrigger.create({
          trigger: element,
          start: "top 80%",
          markers: false,
          once: true,
          onEnter: () => {
            tl.play(0); // No delay here!
          },
        });
      }
    } catch (error) {
      console.error(
        `Motion: Fade up animation setup failed at ${index + 1}:`,
        error,
      );
    }
  });
});

//GSAP for Draw
document.addEventListener("DOMContentLoaded", function () {
  if (typeof ScrollTrigger === "undefined") {
    console.error("Required library (ScrollTrigger) is not loaded");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const drawElements = document.querySelectorAll(
    '[data-motion-element="draw"]',
  );

  if (!drawElements || drawElements.length === 0) {
    console.warn("Motion: Draw elements not found");
    return;
  }

  const animatableElements = Array.from(drawElements).filter((element) => {
    const motionState = element.getAttribute("data-motion-state");
    const isBlocked = motionState === "blocked";
    return !isBlocked;
  });

  // Set initial data-draw-state attribute
  animatableElements.forEach((element) => {
    element.setAttribute("data-draw-state", "start");
  });

  animatableElements.forEach((element, index) => {
    try {
      ScrollTrigger.create({
        trigger: element,
        start: "top 95%",
        markers: false,
        once: true,
        onEnter: () => {
          element.setAttribute("data-draw-state", "end");
        },
      });
    } catch (error) {
      console.error(`Motion: Draw animation failed at ${index + 1}:`, error);
    }
  });
});

//GSAP for Stacking Card
document.addEventListener("DOMContentLoaded", () => {
  // Check if on desktop (screen width > 991px)
  const isDesktop = window.innerWidth > 991;

  if (!isDesktop) {
    return;
  }

  // Animation Constants
  const ANIMATION = {
    fade: {
      duration: 0.2,
      ease: "power2.out",
      opacity: {
        start: 1,
        end: 0,
      },
    },
    trigger: {
      start: "top 30%",
    },
  };

  // Selectors
  const selectors = {
    heading: '[data-stack-element="heading"]',
    grid: '[data-stack-element="grid"]',
  };

  function initStackFadeAnimation() {
    const headingElement = document.querySelector(selectors.heading);
    const gridElement = document.querySelector(selectors.grid);

    if (!headingElement) {
      console.warn("Stack heading element not found");
      return;
    }

    if (!gridElement) {
      console.error("Stacking cards section not found");
      return;
    }

    console.log("Stack elements found - creating animation");

    // Set initial state
    gsap.set(headingElement, { opacity: ANIMATION.fade.opacity.start });

    // Create ScrollTrigger animation
    gsap.to(headingElement, {
      opacity: ANIMATION.fade.opacity.end,
      duration: ANIMATION.fade.duration,
      ease: ANIMATION.fade.ease,
      scrollTrigger: {
        trigger: gridElement,
        start: ANIMATION.trigger.start,
        toggleActions: "play none none reverse",
        markers: false,
      },
    });

    console.log("Stack fade animation initialized");
  }

  // Initialize animation
  initStackFadeAnimation();
});

//GSAP to Slide Down
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) are not loaded");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const slideElements = document.querySelectorAll(
    '[data-motion-element="slide"]',
  );

  if (!slideElements || slideElements.length === 0) {
    console.warn("Motion: Slide elements not found");
    return;
  }

  const animatableElements = Array.from(slideElements).filter((element) => {
    const motionState = element.getAttribute("data-motion-state");
    const isBlocked = motionState === "blocked";
    return !isBlocked;
  });

  animatableElements.forEach((element, index) => {
    try {
      const delay = element.getAttribute("data-motion-delay")
        ? parseFloat(element.getAttribute("data-motion-delay"))
        : 0;

      gsap.set(element, {
        opacity: 1,
        y: "-120%",
      });

      const tl = gsap.timeline({
        paused: true,
      });

      tl.to(element, {
        opacity: 1,
        y: "0%",
        duration: 0.8,
        ease: "power2.out",
      });

      ScrollTrigger.create({
        trigger: element,
        start: "top 95%",
        markers: false,
        once: true,
        onEnter: () => {
          setTimeout(() => {
            tl.play(0);
          }, delay * 1000);
        },
      });
    } catch (error) {
      console.error(`Motion: Slide animation failed at ${index + 1}:`, error);
    }
  });
});

//GSAP to Pop Up
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) are not loaded");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  const popElements = document.querySelectorAll('[data-motion-element="pop"]');
  if (!popElements || popElements.length === 0) {
    console.warn("Motion: Pop elements not found");
    return;
  }
  const animatableElements = Array.from(popElements).filter((element) => {
    const motionState = element.getAttribute("data-motion-state");
    const isBlocked = motionState === "blocked";
    return !isBlocked;
  });
  animatableElements.forEach((element, index) => {
    try {
      const delay = element.getAttribute("data-motion-delay")
        ? parseFloat(element.getAttribute("data-motion-delay"))
        : 0;
      gsap.set(element, {
        opacity: 1,
        y: 100,
      });
      const tl = gsap.timeline({
        paused: true,
      });
      tl.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      });
      ScrollTrigger.create({
        trigger: element,
        start: "top 95%",
        markers: false,
        once: true,
        onEnter: () => {
          setTimeout(() => {
            tl.play(0);
          }, delay * 1000);
        },
      });
    } catch (error) {
      console.error(`Motion: Pop animation failed at ${index + 1}:`, error);
    }
  });
});

//GSAP for Fading Grid
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined") {
    return;
  }

  if (typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const grid = document.querySelector("[data-random-grid]");
  if (!grid) {
    return;
  }

  const imageContainers = Array.from(
    grid.querySelectorAll("[data-random-cell]"),
  );
  if (!imageContainers.length) {
    return;
  }

  gsap.set(imageContainers, { autoAlpha: 0, y: 0 });

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

//GSAP for Ticker
document.addEventListener("DOMContentLoaded", () => {
  const isMobile = window.innerWidth <= 991;

  if (!isMobile) {
    return;
  }

  const tickerWrap = document.querySelector("[data-ticker-wrap]");
  const tickerItem = document.querySelector("[data-ticker-item]");

  if (!tickerWrap || !tickerItem) {
    console.warn("Ticker elements not found");
    return;
  }

  console.log("Found ticker elements");
  const originalContent = tickerItem.outerHTML;

  function calculateRequiredCopies() {
    const viewportWidth = window.innerWidth;
    const itemWidth = tickerItem.offsetWidth;
    // Create a sequence 5 times the viewport width
    const copiesNeeded = Math.ceil((viewportWidth * 5) / itemWidth) + 2;

    console.log(
      `Viewport width: ${viewportWidth}, Item width: ${itemWidth}, Copies needed: ${copiesNeeded}`,
    );

    return {
      viewportWidth,
      itemWidth,
      copiesNeeded,
    };
  }

  function setupTicker() {
    if (!isMobile) {
      console.log("Not mobile, ticker setup aborted");
      return;
    }

    console.log("Setting up ticker");
    const { copiesNeeded, itemWidth } = calculateRequiredCopies();

    tickerWrap.innerHTML = "";

    for (let i = 0; i < copiesNeeded; i++) {
      const clone = document.createElement("div");
      clone.innerHTML = originalContent;
      const clonedItem = clone.firstElementChild;
      tickerWrap.appendChild(clonedItem);
    }

    // Total width of the sequence
    const totalWidth = itemWidth * copiesNeeded;
    console.log(`Total ticker width: ${totalWidth}px`);

    gsap.to(tickerWrap, {
      x: -totalWidth + itemWidth, // Subtract one item width to ensure smooth loop
      duration: totalWidth / 100, // Increased speed by reducing duration divisor from 25 to 100
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        gsap.set(tickerWrap, { x: 0 });
      },
    });

    console.log("Ticker animation started");
  }

  // Initialize the ticker
  setupTicker();

  // Optional: Reinitialize on window resize to adjust for new viewport size
  window.addEventListener("resize", () => {
    const newIsMobile = window.innerWidth <= 991;
    if (newIsMobile) {
      console.log("Window resized, reinitializing ticker");
      setupTicker();
    }
  });
});
