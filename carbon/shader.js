import * as THREE from "three";

document.addEventListener("DOMContentLoaded", function () {
  var vertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

  var fragment = `
precision mediump float;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;
uniform float uImageAspect;
uniform vec3 uOverlayColor;
uniform vec3 uOverlayColorWhite;
uniform float uMotionValue;
uniform float uRotation;
uniform float uSegments;
uniform float uOverlayOpacity;

// Function to check if a point is inside the arrow shape
bool isInsideArrow(vec2 point) {
  // Implementation of point-in-polygon test for our specific arrow shape
  bool inside = false;

  // Hard-coded vertices from the SVG (normalized)
  // Edge from (0.000000, 0.000185) to (0.562007, 0.000081)
  if (((0.000185 > point.y) != (0.000081 > point.y)) &&
      (point.x < (0.562007 - 0.000000) * (point.y - 0.000185) / (0.000081 - 0.000185) + 0.000000))
    inside = !inside;

  // Edge from (0.562007, 0.000081) to (0.999288, 0.511366)
  if (((0.000081 > point.y) != (0.511366 > point.y)) &&
      (point.x < (0.999288 - 0.562007) * (point.y - 0.000081) / (0.511366 - 0.000081) + 0.562007))
    inside = !inside;

  // Edge from (0.999288, 0.511366) to (0.582052, 0.999832)
  if (((0.511366 > point.y) != (0.999832 > point.y)) &&
      (point.x < (0.582052 - 0.999288) * (point.y - 0.511366) / (0.999832 - 0.511366) + 0.999288))
    inside = !inside;

  // Edge from (0.582052, 0.999832) to (0.020017, 0.999938)
  if (((0.999832 > point.y) != (0.999938 > point.y)) &&
      (point.x < (0.020017 - 0.582052) * (point.y - 0.999832) / (0.999938 - 0.999832) + 0.582052))
    inside = !inside;

  // Edge from (0.020017, 0.999938) to (0.437265, 0.511455)
  if (((0.999938 > point.y) != (0.511455 > point.y)) &&
      (point.x < (0.437265 - 0.020017) * (point.y - 0.511455) / (0.999938 - 0.511455) + 0.020017))
    inside = !inside;

  // Edge from (0.437265, 0.511455) to (0.000000, 0.000185)
  if (((0.511455 > point.y) != (0.000185 > point.y)) &&
      (point.x < (0.000000 - 0.437265) * (point.y - 0.511455) / (0.000185 - 0.511455) + 0.437265))
    inside = !inside;

  return inside;
}

void main() {
    float canvasAspect = resolution.x / resolution.y;
    float numSlices = uSegments;
    float rotationRadians = uRotation * (3.14159265 / 180.0); // Convert rotation to radians

    // Adjust the UV coordinates for aspect ratio
    vec2 scaledUV = vUv;
    if (uImageAspect > canvasAspect) {
        float scale = canvasAspect / uImageAspect;
        scaledUV.x = (vUv.x - 0.5) * scale + 0.5;
    } else {
        float scale = uImageAspect / canvasAspect;
        scaledUV.y = (vUv.y - 0.5) * scale + 0.5;
    }

    // Rotate the texture to align it with the warping axis
    vec2 rotatedUV = vec2(
        cos(rotationRadians) * (scaledUV.x - 0.5) - sin(rotationRadians) * (scaledUV.y - 0.5) + 0.5,
        sin(rotationRadians) * (scaledUV.x - 0.5) + cos(rotationRadians) * (scaledUV.y - 0.5) + 0.5
    );

    // Create tiled arrow pattern
    vec2 tiledUV = fract(rotatedUV * vec2(numSlices, numSlices * 0.675)); // Adjust for arrow aspect ratio

    // Apply motion effect
    tiledUV.x = mod(tiledUV.x + uMotionValue * 0.01, 1.0);

    // Check if inside arrow shape
    bool inside = isInsideArrow(tiledUV);

    // Sample texture
    vec4 texColor = texture2D(uTexture, vUv);

    // Apply effect based on inside/outside status
    vec4 color;
    if (inside) {
        // Inside arrow - apply slight distortion effect
        vec2 distortedUV = vUv;
        distortedUV.x += 0.005 * sin(rotatedUV.y * 10.0 + uMotionValue);
        color = texture2D(uTexture, distortedUV);
    } else {
        // Outside arrow - apply different effect
        color = texColor * 0.85; // Slightly darker
    }

    if (uOverlayOpacity > 0.0) {
        // Apply overlays with the specified opacity
        float overlayFactor = inside ? 0.05 : 0.15;
        float blackOverlayAlpha = overlayFactor * (uOverlayOpacity / 100.0);
        color.rgb *= (1.0 - blackOverlayAlpha);

        float whiteOverlayAlpha = overlayFactor * 0.5 * (uOverlayOpacity / 100.0);
        color.rgb = mix(color.rgb, uOverlayColorWhite, whiteOverlayAlpha);
    }

    gl_FragColor = color;
}
`;

  class Sketch {
    constructor(options) {
      this.scene = new THREE.Scene();

      this.container = options.dom;
      const position = getComputedStyle(this.container).position;
      if (
        position !== "relative" &&
        position !== "absolute" &&
        position !== "fixed" &&
        position !== "sticky"
      ) {
        this.container.style.position = "relative";
      }

      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor(0xeeeeee, 1);

      const modeAttr = this.container.getAttribute("data-pl-shader-mode");
      this.mode = ["static", "mouse", "scroll"].includes(modeAttr)
        ? modeAttr
        : "static";
      const motionAttr = this.container.getAttribute("data-pl-shader-motion");
      this.motionFactor = -50 * parseFloat(motionAttr) || -50;

      this.container.appendChild(this.renderer.domElement);

      var frustumSize = 1;
      this.camera = new THREE.OrthographicCamera(
        frustumSize / -2,
        frustumSize / 2,
        frustumSize / 2,
        frustumSize / -2,
        -1000,
        1000,
      );
      this.camera.position.set(0, 0, 2);

      this.isPlaying = true;
      this.addObjects();
      this.resize();
      this.render();
      this.setupResize();

      if (this.mode === "mouse") {
        this.mouseEvents();
      }
      if (this.mode === "scroll") {
        this.setupScroll();
      }

      console.log("Arrow shader effect initialized");
    }

    mouseEvents() {
      this.container.addEventListener("mousemove", (event) => {
        this.onMouseMove(event);
      });
      console.log("Mouse events configured");
    }

    setupScroll() {
      window.addEventListener("scroll", this.handleScroll.bind(this));
      console.log("Scroll events configured");
    }

    handleScroll() {
      const rect = this.container.getBoundingClientRect();
      const elemTop = rect.top;
      const elemBottom = rect.bottom;

      // Check if the element is in the viewport
      const isInViewport = elemTop < window.innerHeight && elemBottom >= 0;

      if (isInViewport) {
        const totalHeight = window.innerHeight + this.container.offsetHeight;
        const scrolled = window.innerHeight - elemTop;
        const progress = scrolled / totalHeight;
        const maxMovement = 0.2; // Full rotation
        if (this.material) {
          this.material.uniforms.uMotionValue.value =
            progress * maxMovement * this.motionFactor;
        }
      }
    }

    onMouseMove(event) {
      this.mouse.x = event.clientX / window.innerWidth;
      this.mouse.y = 1.0 - event.clientY / window.innerHeight;
      if (this.material) {
        this.material.uniforms.uMotionValue.value =
          0.5 + this.mouse.x * this.motionFactor * 0.1;
      }
    }

    setupResize() {
      window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width / this.height;

      if (this.material) {
        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
      }
      this.camera.updateProjectionMatrix();
      console.log("Resized to", this.width, "x", this.height);
    }

    addObjects() {
      // Get all child image textures
      const imageElements = this.container.querySelectorAll(
        "[data-pl-shader-image]",
      );
      const randomImageElement =
        imageElements[Math.floor(Math.random() * imageElements.length)];

      // Set rotation angle
      const rotationAttribute = this.container.getAttribute(
        "data-pl-shader-rotation",
      );
      this.rotationAngle = parseFloat(rotationAttribute, 10) || 0; // Default to 0

      // Set number of segments
      const segmentsAttribute = this.container.getAttribute(
        "data-pl-shader-segments",
      );
      this.segments = parseInt(segmentsAttribute, 10) || 20; // Default to 20 for arrow pattern

      // Get overlay opacity value from attribute
      const overlaysAttr = this.container.getAttribute(
        "data-pl-shader-overlay",
      );
      this.overlayOpacity = Math.max(
        0,
        Math.min(100, parseFloat(overlaysAttr, 10) || 0),
      ); // Clamp between 0 and 100

      // Create a new Image object to load the texture
      const image = new Image();
      image.onload = () => {
        // Calculate the aspect ratio automatically
        this.imageAspect = image.naturalWidth / image.naturalHeight;
        // Once the image is loaded and the aspect ratio is calculated, set up the material and geometry
        this.setupMaterialAndGeometry(randomImageElement.src);
        console.log("Image loaded with aspect ratio:", this.imageAspect);
      };
      // Set the image source to start loading
      image.src = randomImageElement.src;
      console.log("Loading image from", randomImageElement.src);
    }

    setupMaterialAndGeometry(imageSrc) {
      const rendererElement = this.renderer.domElement;
      // Set styles for generated canvas
      rendererElement.style.position = "absolute";
      rendererElement.style.top = "0";
      rendererElement.style.left = "0";

      // Append the renderer element to the container
      this.container.appendChild(rendererElement);

      let texture = new THREE.TextureLoader().load(imageSrc);
      texture.minFilter = THREE.LinearFilter;

      this.mouse = new THREE.Vector2(0.5, 0.5);

      this.material = new THREE.ShaderMaterial({
        extensions: {
          derivatives: "#extension GL_OES_standard_derivatives : enable",
        },
        side: THREE.DoubleSide,
        uniforms: {
          resolution: {
            value: new THREE.Vector4(),
          },
          uTexture: {
            value: texture,
          },
          uMotionValue: {
            value: 0.5,
          },
          uRotation: {
            value: this.rotationAngle,
          },
          uSegments: {
            value: this.segments,
          },
          uOverlayColor: {
            value: new THREE.Vector3(0.0, 0.0, 0.0),
          },
          uOverlayColorWhite: {
            value: new THREE.Vector3(1.0, 1.0, 1.0),
          },
          uImageAspect: {
            value: this.imageAspect,
          },
          uOverlayOpacity: {
            value: this.overlayOpacity,
          },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
      });

      this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
      this.plane = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.plane);

      this.resize();
      this.handleScroll();
      console.log("Material and geometry setup complete");
    }

    render(time = 0) {
      if (!this.isPlaying) return;

      requestAnimationFrame(this.render.bind(this));
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Create each canvas
  document.querySelectorAll("[data-pl-shader-canvas]").forEach((element) => {
    if (element.querySelector("[data-pl-shader-image]")) {
      console.log("Creating arrow shader for element:", element);
      new Sketch({
        dom: element,
      });
    } else {
      console.error(
        "No [data-pl-shader-image] child found within [data-pl-shader-canvas] element.",
      );
    }
  });
});
