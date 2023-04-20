<template>
  <div id="drag-container">
    <div id="spin-container">
      <!-- Add your images (or video) here -->
      <img
        src="https://images.pexels.com/photos/206395/pexels-photo-206395.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        alt=""
      />
      <img
        src="https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        alt=""
      />
      <img
        src="https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        alt=""
      />
      <img
        src="https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        alt=""
      />
      <img
        src="https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        alt=""
      />
      <img
        src="https://images.pexels.com/photos/1462636/pexels-photo-1462636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        alt=""
      />

      <!-- Example image with link -->
      <a
        target="_blank"
        href="https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
      >
        <img
          src="https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
          alt=""
        />
      </a>

      <!-- Example add video  -->
      <video controls autoplay loop>
        <source
          src="https://player.vimeo.com/external/322244668.sd.mp4?s=338c48ac2dfcb1d4c0689968b5baf94eee6ca0c1&profile_id=165&oauth2_token_id=57447761"
          type="video/mp4"
        />
      </video>

      <!-- Text at center of ground -->
      <p>3D Tiktok Carousel</p>
    </div>
    <div id="ground"></div>
  </div>

  <div id="music-container"></div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from "vue";

interface HTMLElementWithTimer extends HTMLElement {
  timer: ReturnType<typeof setInterval>;
}

export default defineComponent({
  setup() {
    let radius = 240;
    const autoRotate = true;
    const rotateSpeed = -60;
    const imgWidth = 120;
    const imgHeight = 170;

    const bgMusicURL =
      "https://api.soundcloud.com/tracks/143041228/stream?client_id=587aa2d384f7333a886010d5f52f302a";
    const bgMusicControls = true;

    const odrag = ref<HTMLElementWithTimer | null>(null);
    const ospin = ref<HTMLElement | null>(null);
    const ground = ref<HTMLElement | null>(null);
    const musicContainer = ref<HTMLElement | null>(null);

    onMounted(async () => {
      await nextTick();

      const aImg = ospin.value!.getElementsByTagName("img");
      const aVid = ospin.value!.getElementsByTagName("video");
      const aEle = [...aImg, ...aVid];

      setTimeout(init, 1000);

      ospin.value!.style.width = imgWidth + "px";
      ospin.value!.style.height = imgHeight + "px";

      ground.value!.style.width = radius * 3 + "px";
      ground.value!.style.height = radius * 3 + "px";

      function init(delayTime?: number) {
        for (let i = 0; i < aEle.length; i++) {
          aEle[i].style.transform =
            "rotateY(" +
            i * (360 / aEle.length) +
            "deg) translateZ(" +
            radius +
            "px)";
          aEle[i].style.transition = "transform 1s";
          aEle[i].style.transitionDelay =
            (delayTime || (aEle.length - i) / 4) + "s";
        }
      }

      function applyTranform(obj: HTMLElement, tY: number, tX: number) {
        if (tY > 180) tY = 180;
        if (tY < 0) tY = 0;

        obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
      }

      function playSpin(yes: boolean) {
        ospin.value!.style.animationPlayState = yes ? "running" : "paused";
      }

      let sX: number,
        sY: number,
        nX: number,
        nY: number,
        desX = 0,
        desY = 0,
        tX = 0,
        tY = 10;

      if (autoRotate) {
        const animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
        ospin.value!.style.animation = `${animationName} ${Math.abs(
          rotateSpeed
        )}s infinite linear`;
      }

      if (bgMusicURL) {
        musicContainer.value!.innerHTML += `
          <audio src="${bgMusicURL}" ${
          bgMusicControls ? "controls" : ""
        } autoplay loop>
            <p>If you are reading this, it is because your browser does not support the audio element.</p>
          </audio>
        `;
      }

      document.onpointerdown = function (e) {
        clearInterval(odrag.value!.timer);
        let sX = e.clientX,
          sY = e.clientY;
        this.onpointermove = function (e) {
          const nX = e.clientX,
            nY = e.clientY;
          desX = nX - sX;
          desY = nY - sY;
          tX += desX * 0.1;
          tY += desY * 0.1;
          applyTranform(odrag.value!, tY, tX);
          sX = nX;
          sY = nY;
        };

        this.onpointerup = function (e) {
          odrag.value!.timer = setInterval(function () {
            desX *= 0.95;
            desY *= 0.95;
            tX += desX * 0.1;
            tY += desY * 0.1;
            applyTranform(odrag.value!, tY, tX);
            playSpin(false);
            if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
              clearInterval(odrag.value!.timer);
              playSpin(true);
            }
          }, 17);
          this.onpointermove = this.onpointerup = null;
        };

        return false;
      };

      document.addEventListener("wheel", function (e) {
        const d = -e.deltaY / 20;
        radius += d;
        init(1);
      });
    });

    return {
      odrag,
      ospin,
      ground,
      musicContainer,
    };
  },
});
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  /* for touch screen */
  touch-action: none;
}

body {
  overflow: hidden;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  background: #111;
  -webkit-perspective: 1000px;
  perspective: 1000px;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}

#drag-container,
#spin-container {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin: auto;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transform: rotateX(-10deg);
  transform: rotateX(-10deg);
}

#drag-container img,
#drag-container video {
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  line-height: 200px;
  font-size: 50px;
  text-align: center;
  -webkit-box-shadow: 0 0 8px #fff;
  box-shadow: 0 0 8px #fff;
  -webkit-box-reflect: below 10px
    linear-gradient(transparent, transparent, #0005);
}

#drag-container img:hover,
#drag-container video:hover {
  -webkit-box-shadow: 0 0 15px #fffd;
  box-shadow: 0 0 15px #fffd;
  -webkit-box-reflect: below 10px
    linear-gradient(transparent, transparent, #0007);
}

#drag-container p {
  font-family: Serif;
  position: absolute;
  top: 100%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%) rotateX(90deg);
  transform: translate(-50%, -50%) rotateX(90deg);
  color: #fff;
}

#ground {
  width: 900px;
  height: 900px;
  position: absolute;
  top: 100%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%) rotateX(90deg);
  transform: translate(-50%, -50%) rotateX(90deg);
  background: -webkit-radial-gradient(
    center center,
    farthest-side,
    #9993,
    transparent
  );
}

#music-container {
  position: absolute;
  top: 0;
  left: 0;
}

@-webkit-keyframes spin {
  from {
    -webkit-transform: rotateY(0deg);
    transform: rotateY(0deg);
  }
  to {
    -webkit-transform: rotateY(360deg);
    transform: rotateY(360deg);
  }
}

@keyframes spin {
  from {
    -webkit-transform: rotateY(0deg);
    transform: rotateY(0deg);
  }
  to {
    -webkit-transform: rotateY(360deg);
    transform: rotateY(360deg);
  }
}
@-webkit-keyframes spinRevert {
  from {
    -webkit-transform: rotateY(360deg);
    transform: rotateY(360deg);
  }
  to {
    -webkit-transform: rotateY(0deg);
    transform: rotateY(0deg);
  }
}
@keyframes spinRevert {
  from {
    -webkit-transform: rotateY(360deg);
    transform: rotateY(360deg);
  }
  to {
    -webkit-transform: rotateY(0deg);
    transform: rotateY(0deg);
  }
}
</style>
