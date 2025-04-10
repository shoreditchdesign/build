//Intercom Widget
document.addEventListener("DOMContentLoaded", function () {
  window.intercomSettings = {
    api_base: "https://api-iam.intercom.io",
    app_id: "jey3sjgt",
  };

  // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/jey3sjgt'
  (function () {
    var w = window;
    var ic = w.Intercom;
    if (typeof ic === "function") {
      ic("reattach_activator");
      ic("update", w.intercomSettings);
    } else {
      var d = document;
      var i = function () {
        i.c(arguments);
      };
      i.q = [];
      i.c = function (args) {
        i.q.push(args);
      };
      w.Intercom = i;
      var l = function () {
        var s = d.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://widget.intercom.io/widget/jey3sjgt";
        var x = d.getElementsByTagName("script")[0];
        x.parentNode.insertBefore(s, x);
      };
      if (document.readyState === "complete") {
        l();
      } else if (w.attachEvent) {
        w.attachEvent("onload", l);
      } else {
        w.addEventListener("load", l, false);
      }
    }
  })();
});

//Lenis Smooth Scroll
if (window.innerWidth >= 992) {
  // Only initialize on desktop (width >= 992px)
  const lenis = new Lenis({
    smooth: true,
    lerp: 0.1,
    wheelMultiplier: 1,
    infinite: false,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

//Table of Contents
document.addEventListener("DOMContentLoaded", function () {
  // Part 1: Add data-stagger-block to children of data-toc-body elements
  const tocBodyElements = document.querySelectorAll("[data-toc-body]");
  if (tocBodyElements.length === 0) {
    console.warn("No elements with [data-toc-body] found");
  } else {
    tocBodyElements.forEach(function (tocBody) {
      const childElements = tocBody.children;
      if (childElements.length === 0) {
        console.log("No children found for a data-toc-body element");
      } else {
        Array.from(childElements).forEach(function (child) {
          child.setAttribute("data-stagger-block", "");
          console.log("Added data-stagger-block to element:", child);
        });
        console.log(
          `Added data-stagger-block to ${childElements.length} children of a data-toc-body element`,
        );
      }
    });
  }

  // Part 2: Create table of contents and wrap H2 sections
  const richTextBodies = document.querySelectorAll("[data-toc-body]");
  let allH2s = [];

  // First collect all H2s
  richTextBodies.forEach((body) => {
    const h2s = body.querySelectorAll("h2");
    allH2s = [...allH2s, ...h2s];
  });

  // If no H2s are found, remove template cells from all TOC wrappers
  if (allH2s.length === 0) {
    const tocWrappers = document.querySelectorAll("[data-toc-wrap]");
    tocWrappers.forEach((tocWrapper) => {
      const templateCell = tocWrapper.querySelector("[data-toc-cell]");
      if (templateCell) {
        templateCell.remove();
      }
      tocWrapper.style.display = "none";
    });
    return; // Exit early if no H2s found
  }

  // Process each data-toc-body container separately
  richTextBodies.forEach((body) => {
    // Get all children of the body
    const allChildren = Array.from(body.children);
    // Get H2s within this specific body
    const h2sInBody = Array.from(body.querySelectorAll("h2"));

    // Skip if no H2s in this body
    if (h2sInBody.length === 0) return;

    // Track processed elements to avoid duplicates
    const processedElements = new Set();

    // Process each H2
    h2sInBody.forEach((h2, index) => {
      const sectionId = `toc-${index + 1}`;
      const sectionDiv = document.createElement("div");
      sectionDiv.setAttribute("id", sectionId);
      sectionDiv.setAttribute("data-toc-section", "");

      // Start with the H2
      const elementsToGroup = [h2];
      processedElements.add(h2);

      // Find the index of current H2 in allChildren
      const h2Index = allChildren.indexOf(h2);

      // Find all elements until the next H2 or the end
      let nextIndex = h2Index + 1;
      while (nextIndex < allChildren.length) {
        const nextElement = allChildren[nextIndex];
        // Stop if we hit another H2
        if (nextElement.tagName === "H2") break;
        elementsToGroup.push(nextElement);
        processedElements.add(nextElement);
        nextIndex++;
      }

      console.log(
        `Creating section for H2: "${h2.textContent}" with ${elementsToGroup.length} elements`,
      );

      // Create a document fragment for better performance
      const fragment = document.createDocumentFragment();
      elementsToGroup.forEach((el) => fragment.appendChild(el));

      // Add the fragment to the section div
      sectionDiv.appendChild(fragment);

      // Insert the section div where the H2 was
      if (
        h2Index > 0 &&
        allChildren[h2Index - 1] &&
        !processedElements.has(allChildren[h2Index - 1])
      ) {
        body.insertBefore(sectionDiv, allChildren[h2Index - 1].nextSibling);
      } else {
        body.appendChild(sectionDiv);
      }
    });

    // Handle elements before the first H2 (leave them as is)
    // Handle elements that weren't processed (shouldn't be any with our approach)
    const unprocessedElements = allChildren.filter(
      (el) => !processedElements.has(el),
    );
    console.log(
      `${unprocessedElements.length} elements weren't included in any section`,
    );
  });

  // Create TOC using the new section IDs
  const tocWrappers = document.querySelectorAll("[data-toc-wrap]");
  tocWrappers.forEach((tocWrapper) => {
    const templateCell = tocWrapper.querySelector("[data-toc-cell]");
    if (!templateCell || allH2s.length === 0) {
      tocWrapper.style.display = "none";
      return;
    }

    const existingCells = tocWrapper.querySelectorAll("[data-toc-cell]");
    existingCells.forEach((cell, index) => {
      if (index !== 0) cell.remove();
    });

    allH2s.forEach((h2, index) => {
      const newCell = templateCell.cloneNode(true);
      const textElement = newCell.querySelector("[data-toc-text]");
      const id = `toc-${index + 1}`;

      // Store the id as a data attribute
      newCell.setAttribute("data-toc-target", id);
      // Add href attribute with format #toc-1
      newCell.setAttribute("href", `#${id}`);

      if (textElement) {
        textElement.textContent = h2.textContent;
      }

      // Prevent default anchor behavior for ALL clicks on these elements
      newCell.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Scroll click triggered for ID:", id);
        const targetSection = document.getElementById(id);
        if (targetSection) {
          console.log("Target section found:", targetSection);
          requestAnimationFrame(() => {
            const offset = 200;
            const targetPosition =
              targetSection.getBoundingClientRect().top +
              window.pageYOffset -
              offset;
            console.log("Scrolling to position:", targetPosition);
            window.scrollTo({
              top: targetPosition,
              behavior: "smooth",
            });
          });
        }
      });

      tocWrapper.appendChild(newCell);
    });

    templateCell.remove();
  });

  // NEW ADDITION: Prevent default behavior for all links with data-toc-target attribute
  document.addEventListener("click", function (e) {
    const tocLink = e.target.closest("[data-toc-target]");
    if (tocLink) {
      e.preventDefault();
      console.log("Prevented default anchor behavior");
    }
  });
});

//Animation Blockers
document.addEventListener("DOMContentLoaded", function () {
  const richTextElements = document.querySelectorAll(".w-richtext");

  if (richTextElements.length === 0) {
    return;
  }

  richTextElements.forEach(function (richText) {
    const paragraphs = richText.querySelectorAll("p");

    if (paragraphs.length === 0) {
      // No paragraph elements found
    } else {
      paragraphs.forEach(function (paragraph) {
        paragraph.setAttribute("data-stagger-block", "");
      });
    }
  });
});

//Banner Injection
document.addEventListener("DOMContentLoaded", function () {
  // Find all parent elements with class w-richtext
  const richTextElements = document.querySelectorAll(".w-richtext");

  // Find the banner element that we'll use as a replacement
  const bannerElement = document.querySelector("[data-blog-banner]");

  // If there's no banner element, exit early
  if (!bannerElement) {
    console.warn("No element with data-blog-banner attribute found");
    return;
  }

  richTextElements.forEach(function (parent) {
    // Look for paragraphs inside each rich text element
    const paragraphs = parent.querySelectorAll("p");

    paragraphs.forEach(function (paragraph) {
      // Check if paragraph contains exactly "{{banner}}"
      if (paragraph.textContent.trim() === "{{banner}}") {
        // Clone the banner element to insert (in case we need to use it multiple times)
        const bannerClone = bannerElement.cloneNode(true);

        // Insert the banner clone before the paragraph
        parent.insertBefore(bannerClone, paragraph);

        // Remove the original paragraph
        paragraph.remove();
      }
    });
  });

  bannerElement.remove();
});

//Tab Switchers
document.addEventListener("DOMContentLoaded", function () {
  const tabLinks = document.querySelectorAll("[data-tab-link]");

  // Add click event listeners to each tab link
  tabLinks.forEach((tabLink) => {
    tabLink.addEventListener("click", () => {
      // Get the tab link value (index)
      const tabIndex = tabLink.getAttribute("data-tab-link");
      console.log("Tab clicked:", tabIndex);

      // Find all tab links and panes
      const allTabLinks = document.querySelectorAll("[data-tab-link]");
      const allTabPanes = document.querySelectorAll("[data-tab-pane]");

      // Set all tab links and panes to hide
      allTabLinks.forEach((link) => {
        link.setAttribute("data-tab-state", "hide");
      });

      allTabPanes.forEach((pane) => {
        pane.setAttribute("data-tab-state", "hide");
      });

      // Set the clicked tab link to show
      tabLink.setAttribute("data-tab-state", "show");
      console.log("Showing tab link:", tabIndex);

      // Find and show the corresponding tab pane
      const correspondingPane = document.querySelector(
        `[data-tab-pane="${tabIndex}"]`,
      );
      if (correspondingPane) {
        correspondingPane.setAttribute("data-tab-state", "show");
        console.log("Showing tab pane:", tabIndex);
      } else {
        console.log("No matching tab pane found for index:", tabIndex);
      }
    });
  });
});
