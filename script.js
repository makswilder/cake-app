const cakeTop = document.getElementById("cake-top");
const counter = document.getElementById("counter");
const clearBtn = document.getElementById("clearBtn");

let candleCount = 0;

// Add candles on click
cakeTop.addEventListener("click", (e) => {
  const rect = cakeTop.getBoundingClientRect();
  const x = e.clientX - rect.left;

  const candle = document.createElement("div");
  candle.className = "candle";
  candle.style.left = `${x - 3}px`;

  const flame = document.createElement("div");
  flame.className = "flame";
  candle.appendChild(flame);

  cakeTop.appendChild(candle);

  candleCount++;
  counter.textContent = candleCount;
});

// Clear all candles
clearBtn.addEventListener("click", () => {
  cakeTop.innerHTML = "";
  candleCount = 0;
  counter.textContent = 0;
});

// Mic blow detection
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const audioCtx = new AudioContext();
  const mic = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  mic.connect(analyser);

  analyser.fftSize = 256;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function detectBlow() {
    analyser.getByteFrequencyData(dataArray);
    const avgVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    if (avgVolume > 60) {
      // Blow detected
      document.querySelectorAll(".flame").forEach(f => f.remove());
    }

    requestAnimationFrame(detectBlow);
  }

  detectBlow();
}).catch(err => {
  console.warn("Microphone access denied or not available.", err);
});
