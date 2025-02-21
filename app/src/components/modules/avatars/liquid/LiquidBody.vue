<template>
  <div class="bg-white">
    <div class="ai-body bg-white border-none"></div>
  </div>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import * as THREE from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import useStore from "../../../../services/store";
// import { vecC olors } from "../../../../constants";

export default defineComponent({
  methods: {
    rerenderComp() {
      this.$forceUpdate(); // Notice we have to use a $ here
    },
  },
  setup() {
    const store = useStore();
    let SCENE: THREE.Scene;
    let CAMERA: THREE.PerspectiveCamera;
    let RENDERER: THREE.WebGLRenderer;
    let CONTROLS: OrbitControls;
    let COMPOSER: EffectComposer;
    let TIME = 10; // Let it be non zero at star

    main();

    function main() {
      init();
      animate();
    }

    function init() {
      initScene();
      initCamera();
      initRenderer();
      initComposer();
      initControls();
      initEventListeners();
      createObjects();
      // Render 3D
      onMounted(() => {
        const container = document.querySelector(".ai-body") as HTMLElement;
        if (container) {
          container.appendChild(RENDERER.domElement);
        }
      });
    }

    function initScene() {
      SCENE = new THREE.Scene();
      SCENE.background = new THREE.Color(0x000);
      initLights();
    }

    function initLights() {
      const point = new THREE.PointLight(0xffffff, 1, 0);
      point.position.set(20, 255, 255);
      SCENE.add(point);
    }

    function initCamera() {
      CAMERA = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        2000
      );
      CAMERA.position.y = 150;
      CAMERA.position.z = 150;
    }

    function initRenderer() {
      RENDERER = new THREE.WebGLRenderer({ alpha: true });
      RENDERER.setPixelRatio(window.devicePixelRatio);
      RENDERER.setSize(window.innerWidth, window.innerHeight);
      RENDERER.shadowMap.enabled = true;
      const bgColor = 0xffffff;
      RENDERER.setClearColor(bgColor, 1); // set background color to black with alpha 0
    }

    function initComposer() {
      COMPOSER = new EffectComposer(RENDERER);
      COMPOSER.setSize(window.innerWidth, window.innerHeight);
      const renderPass = new RenderPass(SCENE, CAMERA);
      COMPOSER.addPass(renderPass);
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        1,
        0.1
      );
      bloomPass.renderToScreen = true;
      COMPOSER.addPass(bloomPass);
    }

    function initControls() {
      CONTROLS = new OrbitControls(CAMERA, RENDERER.domElement);
      CONTROLS.enableZoom = false;
      CONTROLS.minPolarAngle = (Math.PI * 1) / 4;
      CONTROLS.maxPolarAngle = (Math.PI * 3) / 4;
      CONTROLS.update();
    }

    function initEventListeners() {
      window.addEventListener("resize", onWindowResize);
      onWindowResize();
    }

    function onWindowResize() {
      CAMERA.aspect = window.innerWidth / window.innerHeight;
      CAMERA.updateProjectionMatrix();
      RENDERER.setSize(window.innerWidth, window.innerHeight);
      COMPOSER.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);
      CONTROLS.update();
      TIME += 0.005;
      updateUniforms();
      render();
    }

    function updateUniforms() {
      SCENE.traverse(function (child: any) {
        if (
          child instanceof THREE.Mesh &&
          child.material.type === "ShaderMaterial"
        ) {
          child.material.uniforms.uTime.value = TIME;
          child.material.needsUpdate = false;
        }
      });
    }

    function render() {
      CAMERA.lookAt(SCENE.position);
      COMPOSER.render();
    }

    function createObjects() {
      let geometry = new THREE.SphereGeometry(23, 300, 300);
      const modelColors = ref(`
        uniform float uTime;
        varying vec3 vNormal;
        void main() {
          vec3 color1 = ${store.vecColor1};
          vec3 color2 = ${store.vecColor2};
          gl_FragColor = vec4(mix(color1, color2, vNormal.${store.colorDir}), ${store.colorsSplit});
        }
      `);
      const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: TIME },
        },
        transparent: true,
        side: THREE.DoubleSide,
        vertexShader: `
            uniform float uTime;     
            varying vec3 vNormal;
            void main() {
                vNormal = normal;
                vec3 delta = 10.0 * normal * sin(normal.x + normal.y * 10.0 + normal.z + uTime * 10.0);
                vec3 newPosition = position + delta;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }`,
        fragmentShader: modelColors.value,
      });
      const sphere = new THREE.Mesh(geometry, shaderMaterial);
      SCENE.add(sphere);
    }
  },
});
</script>
<style scoped>
.ai-body {
  background-color: #fff !important;
  background: #fff !important;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999 !important;
}
</style>
