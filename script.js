// Smooth scrolling helpers
function scrollToSelector(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setupScrollButtons() {
  const scrollDownBtn = document.getElementById("scroll-down-btn");
  const scrollTopBtn = document.querySelector(".scroll-top-btn");

  if (scrollDownBtn) {
    scrollDownBtn.addEventListener("click", () => {
      scrollToSelector("#skills-section");
    });
  }

  const onScroll = () => {
    if (window.scrollY > 250) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", onScroll);

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Theme toggle
function setupThemeToggle() {
  const btn = document.getElementById("toggle-theme-btn");
  const body = document.body;
  const saved = localStorage.getItem("hb-theme");
  if (saved === "dark") {
    body.classList.remove("theme-light");
    body.classList.add("theme-dark");
  }

  function toggle() {
    const isDark = body.classList.toggle("theme-dark");
    if (isDark) {
      body.classList.remove("theme-light");
      localStorage.setItem("hb-theme", "dark");
    } else {
      body.classList.add("theme-light");
      localStorage.setItem("hb-theme", "light");
    }
  }

  btn.addEventListener("click", toggle);
  return toggle;
}

// Fade-in on scroll
function setupFadeSections() {
  const sections = document.querySelectorAll(".fade-section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((s) => observer.observe(s));
}

// Sidebar navigation & search
function setupSidebar() {
  const links = document.querySelectorAll(".sidebar-link");
  const searchInput = document.getElementById("site-search");

  links.forEach((btn) => {
    const target = btn.getAttribute("data-target");
    btn.addEventListener("click", () => {
      if (target) scrollToSelector(target);
    });
  });

  if (!searchInput) return;

  const searchable = [
    { keywords: ["home", "top"], selector: "#home" },
    { keywords: ["news", "ai news", "tech news", "articles"], selector: "#news-section" },
    { keywords: ["skills", "tech", "technologies"], selector: "#skills-section" },
    { keywords: ["resume", "timeline", "cv"], selector: "#resume-section" },
    {
      keywords: ["movie", "movies", "film", "films"],
      selector: "#recommended-movies",
    },
    { keywords: ["music", "songs"], selector: "#recommended-music" },
    {
      keywords: ["project", "projects", "games", "flappy", "hangman"],
      selector: "#projects-section",
    },
    {
      keywords: ["location", "map", "weather"],
      selector: "#location-weather-section",
    },
  ];

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const q = searchInput.value.trim().toLowerCase();
      if (!q) return;
      const match = searchable.find((item) =>
        item.keywords.some((k) => q.includes(k))
      );
      if (match) {
        scrollToSelector(match.selector);
      }
    }
  });
}

function setupNews() {
  const statusEl = document.getElementById("news-status");
  const gridEl = document.getElementById("news-grid");
  if (!statusEl || !gridEl) return;

  function renderArticles(articles, label) {
    gridEl.innerHTML = "";

    if (!articles.length) {
      statusEl.textContent = "No AI & tech headlines available.";
      return;
    }

    statusEl.textContent = label;

    articles.slice(0, 9).forEach((article) => {
      const card = document.createElement("article");
      card.className = "news-card";

      if (article.urlToImage) {
        const img = document.createElement("img");
        img.className = "news-image";
        img.src = article.urlToImage;
        img.alt = article.title || "News image";
        card.appendChild(img);
      }

      const title = document.createElement("h3");
      title.textContent = article.title || "Untitled article";

      const meta = document.createElement("p");
      meta.className = "news-meta";
      const source = (article.source && article.source.name) || "Unknown source";
      const dateStr = article.publishedAt
        ? new Date(article.publishedAt).toLocaleString()
        : "";
      meta.textContent = dateStr ? `${source} • ${dateStr}` : source;

      const desc = document.createElement("p");
      desc.textContent =
        article.description ||
        "AI- and tech-related story from a major news outlet.";

      const link = document.createElement("a");
      link.className = "news-footer-link";
      link.href = article.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Read full story";

      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(desc);
      card.appendChild(link);
      gridEl.appendChild(card);
    });
  }

  const sampleArticles = [
    {
      title: "New York Times: How AI Is Reshaping Everyday Life",
      description:
        "From smart assistants to recommendation systems, artificial intelligence is quietly powering experiences we use every day.",
      source: { name: "The New York Times" },
      publishedAt: new Date().toISOString(),
      url: "https://www.nytimes.com/2023/06/11/technology/ai-everyday-life.html",
      urlToImage:
        "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      title: "Al Jazeera: Global debate grows over AI regulation",
      description:
        "Governments and tech leaders continue to argue about how best to keep rapidly advancing AI systems in check.",
      source: { name: "Al Jazeera" },
      publishedAt: new Date().toISOString(),
      url: "https://www.aljazeera.com/features/2023/5/18/as-ai-advances-global-debate-grows-over-how-to-regulate-it",
      urlToImage:
        "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      title: "BBC News: Breakthrough in energy‑efficient computer chips for AI",
      description:
        "Researchers claim a major improvement in AI chip efficiency, potentially allowing smarter devices with lower power use.",
      source: { name: "BBC News" },
      publishedAt: new Date().toISOString(),
      url: "https://www.bbc.com/news/technology-65057011",
      urlToImage:
        "https://images.pexels.com/photos/73910/pcb-electronics-hardware-computer-73910.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];

  // If opened directly from the file system, show static sample headlines.
  if (window.location.protocol === "file:") {
    renderArticles(sampleArticles, "Sample AI & tech headlines:");
    return;
  }

  fetch("/news")
    .then((res) => res.json())
    .then((data) => {
      if (!data.articles || !Array.isArray(data.articles)) {
        renderArticles(sampleArticles, "Sample AI & tech headlines:");
        return;
      }

      const preferredSources = [
        "The New York Times",
        "Al Jazeera English",
        "Al Jazeera",
        "BBC News",
        "The Verge",
        "WIRED",
        "TechCrunch",
      ];

      const articles = data.articles.filter((a) => {
        const src = (a.source && a.source.name) || "";
        const title = (a.title || "").toLowerCase();
        return (
          preferredSources.includes(src) ||
          title.includes("ai") ||
          title.includes("artificial intelligence") ||
          title.includes("machine learning")
        );
      });

      if (!articles.length) {
        renderArticles(sampleArticles, "Sample AI & tech headlines:");
        return;
      }

      renderArticles(articles, "Latest AI & tech headlines:");
    })
    .catch(() => {
      renderArticles(sampleArticles, "Sample AI & tech headlines:");
    });
}

// Movies player
function setupMovies() {
  const buttons = document.querySelectorAll(".open-video");
  const iframe = document.getElementById("movie-player");
  const placeholder = document.querySelector(".video-placeholder");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-video");
      if (!src || !iframe) return;
      iframe.src = src;
      if (placeholder) {
        placeholder.style.display = "none";
      }
    });
  });
}

// Music players volume sliders
function setupMusic() {
  const players = document.querySelectorAll(".music-player");
  const sliders = document.querySelectorAll(".volume-slider");

  players.forEach((audio, index) => {
    const slider = sliders[index];
    if (!slider) return;
    slider.value = audio.volume.toString();
    slider.addEventListener("input", () => {
      audio.volume = Number(slider.value);
    });
  });
}

// Weather using Open-Meteo (no API key required)
function setupWeather() {
  const statusEl = document.getElementById("weather-status");
  const wrapper = document.getElementById("weather-details");
  const tempEl = document.getElementById("weather-temp");
  const descEl = document.getElementById("weather-description");
  const windEl = document.getElementById("weather-wind");

  if (!statusEl || !wrapper) return;

  const lat = 27.7172;
  const lon = 85.324;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data.current_weather) {
        statusEl.textContent = "Could not load weather.";
        return;
      }
      const w = data.current_weather;
      tempEl.textContent = `${w.temperature.toFixed(1)} °C`;
      descEl.textContent = "Live conditions (Open‑Meteo)";
      windEl.textContent = `${w.windspeed.toFixed(1)} km/h`;
      statusEl.textContent = "Current weather in Kathmandu:";
      wrapper.classList.remove("hidden");
    })
    .catch(() => {
      statusEl.textContent = "Weather service unavailable.";
    });
}

// Student feedback project + admin
function setupStudentProject() {
  const form = document.getElementById("student-form");
  const statusEl = document.getElementById("student-form-status");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const name = document.getElementById("student-name").value.trim();
      const phone = document.getElementById("student-phone").value.trim();
      const major = document.getElementById("student-major").value.trim();
      const year = document.getElementById("student-year").value;
      const feedback = document.getElementById("student-feedback").value.trim();

      if (!name || !phone || !major || !year) {
        statusEl.textContent = "Please fill all required fields.";
        return;
      }

      if (window.location.protocol === "file:") {
        statusEl.textContent =
          "Backend is not running. Start the Node server to save data.";
        return;
      }

      statusEl.textContent = "Saving your feedback...";
      fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, major, year, feedback }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            statusEl.textContent = "Could not save feedback. Try again later.";
            return;
          }
          form.reset();
          document.getElementById("student-year").value = "";
          statusEl.textContent =
            "Thank you! Your feedback has been saved to the database.";
        })
        .catch(() => {
          statusEl.textContent =
            "Server unavailable. Make sure the Node server is running.";
        });
    });
  }

}

// Flappy Bird game
function setupFlappy() {
  const canvas = document.getElementById("flappy-canvas");
  const btn = document.getElementById("flappy-start-btn");
  const statusEl = document.getElementById("flappy-status");
  if (!canvas || !btn) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  let bird, pipes, gravity, velocity, gameLoop, score, running, frame;

  function resetGame() {
    bird = { x: 70, y: H / 2, r: 14 };
    gravity = 0.45;
    velocity = 0;
    pipes = [];
    score = 0;
    frame = 0;
    running = true;
    statusEl.textContent = "Tap / click / press space to flap!";
  }

  function addPipe() {
    const gap = 120;
    const minTop = 40;
    const maxTop = H - gap - 60;
    const top = Math.random() * (maxTop - minTop) + minTop;
    pipes.push({
      x: W + 40,
      topHeight: top,
      gap: gap,
      passed: false,
    });
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, "#7dd3fc");
    gradient.addColorStop(1, "#fef9c3");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, H - 80, W, 80);
    ctx.fillStyle = "#a3e635";
    ctx.fillRect(0, H - 70, W, 8);
  }

  function drawBird() {
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(0, 0, bird.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(6, -4, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(4, -6, 2.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(20, 4);
    ctx.lineTo(10, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawPipes() {
    pipes.forEach((p) => {
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(p.x, 0, 50, p.topHeight);
      ctx.fillRect(p.x - 4, p.topHeight - 18, 58, 18);
      const bottomTop = p.topHeight + p.gap;
      ctx.fillRect(p.x, bottomTop, 50, H - bottomTop);
      ctx.fillRect(p.x - 4, bottomTop, 58, 18);
    });
  }

  function drawScore() {
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 22px Poppins, system-ui";
    ctx.fillText(`Score: ${score}`, 12, 32);
  }

  function collide() {
    if (bird.y + bird.r >= H - 80) return true;
    if (bird.y - bird.r <= 0) return true;
    for (const p of pipes) {
      if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + 50) {
        if (bird.y - bird.r < p.topHeight || bird.y + bird.r > p.topHeight + p.gap) {
          return true;
        }
      }
    }
    return false;
  }

  function step() {
    if (!running) return;
    frame++;
    velocity += gravity;
    bird.y += velocity;

    if (frame % 100 === 0) {
      addPipe();
    }
    pipes.forEach((p) => {
      p.x -= 2.5;
      if (!p.passed && p.x + 50 < bird.x) {
        p.passed = true;
        score++;
      }
    });
    pipes = pipes.filter((p) => p.x + 50 > -10);

    drawBackground();
    drawPipes();
    drawBird();
    drawScore();

    if (collide()) {
      running = false;
      statusEl.textContent = `Game over! Final score: ${score}. Press Start to try again.`;
      return;
    }

    gameLoop = requestAnimationFrame(step);
  }

  function flap() {
    if (!running) return;
    velocity = -7;
  }

  btn.addEventListener("click", () => {
    cancelAnimationFrame(gameLoop);
    resetGame();
    step();
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      flap();
    }
  });

  canvas.addEventListener("pointerdown", flap);

  drawBackground();
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 18px Poppins, system-ui";
  ctx.fillText("Press Start to play Flappy Bird!", 30, H / 2);
}

// Hangman game
function setupHangman() {
  const canvas = document.getElementById("hangman-canvas");
  const wordEl = document.getElementById("hangman-word");
  const wrongEl = document.getElementById("hangman-wrong");
  const lettersContainer = document.getElementById("hangman-letters");
  const restartBtn = document.getElementById("hangman-restart-btn");
  const statusEl = document.getElementById("hangman-status");
  if (!canvas || !wordEl || !lettersContainer) return;

  const ctx = canvas.getContext("2d");
  const words = [
    "JAVASCRIPT",
    "NEPAL",
    "ALGORITHM",
    "COMPUTER",
    "FLAPPY",
    "HANGMAN",
    "PORTFOLIO",
    "DEVELOPER",
  ];

  let currentWord;
  let guesses;
  let wrong;
  let maxWrong = 7;

  function pickWord() {
    const index = Math.floor(Math.random() * words.length);
    currentWord = words[index];
    guesses = new Set();
    wrong = 0;
  }

  function drawBase() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(20, 220);
    ctx.lineTo(120, 220);
    ctx.moveTo(50, 220);
    ctx.lineTo(50, 40);
    ctx.lineTo(160, 40);
    ctx.lineTo(160, 70);
    ctx.stroke();
  }

  function drawHangman() {
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3.5;
    const step = wrong;
    if (step > 0) {
      ctx.beginPath();
      ctx.arc(160, 90, 18, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (step > 1) {
      ctx.beginPath();
      ctx.moveTo(160, 108);
      ctx.lineTo(160, 155);
      ctx.stroke();
    }
    if (step > 2) {
      ctx.beginPath();
      ctx.moveTo(160, 120);
      ctx.lineTo(140, 140);
      ctx.stroke();
    }
    if (step > 3) {
      ctx.beginPath();
      ctx.moveTo(160, 120);
      ctx.lineTo(180, 140);
      ctx.stroke();
    }
    if (step > 4) {
      ctx.beginPath();
      ctx.moveTo(160, 155);
      ctx.lineTo(145, 190);
      ctx.stroke();
    }
    if (step > 5) {
      ctx.beginPath();
      ctx.moveTo(160, 155);
      ctx.lineTo(175, 190);
      ctx.stroke();
    }
    if (step > 6) {
      ctx.beginPath();
      ctx.moveTo(152, 84);
      ctx.lineTo(156, 88);
      ctx.moveTo(156, 84);
      ctx.lineTo(152, 88);
      ctx.moveTo(164, 84);
      ctx.lineTo(168, 88);
      ctx.moveTo(168, 84);
      ctx.lineTo(164, 88);
      ctx.moveTo(154, 98);
      ctx.lineTo(166, 98);
      ctx.stroke();
    }
  }

  function renderWord() {
    const display = currentWord
      .split("")
      .map((ch) => (guesses.has(ch) ? ch : "_"))
      .join(" ");
    wordEl.textContent = display;
  }

  function renderWrong() {
    wrongEl.textContent = `${wrong} / ${maxWrong}`;
  }

  function updateStatus(text) {
    statusEl.textContent = text;
  }

  function checkEnd() {
    const won = currentWord.split("").every((ch) => guesses.has(ch));
    if (won) {
      updateStatus("You guessed it! 🎉 Click New Word to play again.");
      disableLetters();
    } else if (wrong >= maxWrong) {
      updateStatus(`Game over! The word was: ${currentWord}.`);
      disableLetters();
    }
  }

  function disableLetters() {
    const buttons = lettersContainer.querySelectorAll("button");
    buttons.forEach((b) => (b.disabled = true));
  }

  function enableLetters() {
    const buttons = lettersContainer.querySelectorAll("button");
    buttons.forEach((b) => {
      b.disabled = false;
      b.classList.remove("used");
    });
  }

  function handleGuess(ch, button) {
    if (guesses.has(ch)) return;
    guesses.add(ch);
    button.classList.add("used");
    if (currentWord.includes(ch)) {
      updateStatus("Nice! Keep going.");
    } else {
      wrong++;
      updateStatus("Oops! Wrong guess.");
    }
    drawBase();
    drawHangman();
    renderWord();
    renderWrong();
    checkEnd();
  }

  function createLetters() {
    lettersContainer.innerHTML = "";
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (const ch of alphabet) {
      const btn = document.createElement("button");
      btn.textContent = ch;
      btn.addEventListener("click", () => handleGuess(ch, btn));
      lettersContainer.appendChild(btn);
    }
  }

  function startNew() {
    pickWord();
    drawBase();
    drawHangman();
    renderWord();
    renderWrong();
    enableLetters();
    updateStatus("Guess the word by clicking letters!");
  }

  createLetters();
  restartBtn.addEventListener("click", startNew);
  startNew();
}

// Chatbot & voice commands
function setupChatbot(themeToggleFn) {
  const toggleBtn = document.getElementById("chatbot-toggle");
  const panel = document.querySelector(".chatbot-panel");
  const log = document.getElementById("chat-log");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const voiceToggleBtn = document.getElementById("voice-toggle-btn");
  const voiceStatus = document.getElementById("voice-status");

  if (!toggleBtn || !panel || !log || !form || !input) return;

  let recognizing = false;
  let recognition = null;

  function addMessage(text, sender = "bot") {
    const div = document.createElement("div");
    div.className = `chat-message ${sender}`;
    const p = document.createElement("p");
    p.textContent = text;
    div.appendChild(p);
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function handleCommand(raw) {
    const text = raw.toLowerCase();
    if (!text.trim()) return;

    if (text.includes("news")) {
      scrollToSelector("#news-section");
      addMessage("Opening the latest AI & tech news for you.", "bot");
      return;
    }
    if (text.includes("skill")) {
      scrollToSelector("#skills-section");
      addMessage("Jumping to your skills section.", "bot");
      return;
    }
    if (text.includes("resume") || text.includes("timeline")) {
      scrollToSelector("#resume-section");
      addMessage("Opening your resume timeline.", "bot");
      return;
    }
    if (text.includes("movie") || text.includes("film")) {
      scrollToSelector("#recommended-movies");
      addMessage("Heading to your recommended movies.", "bot");
      return;
    }
    if (text.includes("music") || text.includes("song")) {
      scrollToSelector("#recommended-music");
      addMessage("Let’s listen to some music.", "bot");
      return;
    }
    if (
      text.includes("project") ||
      text.includes("game") ||
      text.includes("flappy") ||
      text.includes("hangman")
    ) {
      scrollToSelector("#projects-section");
      addMessage("Opening your games and projects.", "bot");
      return;
    }
    if (text.includes("map") || text.includes("weather") || text.includes("location")) {
      scrollToSelector("#location-weather-section");
      addMessage("Showing your location and weather.", "bot");
      return;
    }
    if (text.includes("top") || text.includes("home")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      addMessage("Scrolling back to the top.", "bot");
      return;
    }
    if (text.includes("dark") || text.includes("light") || text.includes("theme")) {
      themeToggleFn();
      addMessage("Toggling the theme for you.", "bot");
      return;
    }
    if (text.includes("flappy")) {
      scrollToSelector("#projects-section");
      addMessage("Scroll to Flappy Bird and press Start to play!", "bot");
      return;
    }
    if (text.includes("hangman")) {
      scrollToSelector("#projects-section");
      addMessage("Scroll to Hangman and start guessing letters!", "bot");
      return;
    }

    addMessage(
      "I’m not sure what you mean yet. Try commands like “go to skills”, “open movies”, “toggle dark mode”, or “scroll to top”.",
      "bot"
    );
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value;
    if (!value.trim()) return;
    addMessage(value, "user");
    input.value = "";
    handleCommand(value);
  });

  toggleBtn.addEventListener("click", () => {
    panel.classList.toggle("hidden");
  });

  // Voice recognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      recognizing = true;
      voiceStatus.textContent = "Listening... say a command like “go to skills”.";
    };
    recognition.onend = () => {
      recognizing = false;
      voiceStatus.textContent = "Voice ready. Click again to listen.";
    };
    recognition.onerror = () => {
      recognizing = false;
      voiceStatus.textContent =
        "Voice error or permission denied. You can still chat by typing.";
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      addMessage(`(Voice) ${transcript}`, "user");
      handleCommand(transcript);
    };

    voiceToggleBtn.addEventListener("click", () => {
      if (!recognizing) {
        recognition.start();
      } else {
        recognition.stop();
      }
    });

    voiceStatus.textContent =
      "Voice commands supported. Click the mic button to start.";
  } else {
    voiceStatus.textContent =
      "Voice commands are not supported in this browser.";
    voiceToggleBtn.disabled = true;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const themeToggleFn = setupThemeToggle();
  setupScrollButtons();
  setupFadeSections();
  setupSidebar();
  setupNews();
  const refreshNewsBtn = document.getElementById("refresh-news-btn");
  if (refreshNewsBtn) {
    refreshNewsBtn.addEventListener("click", () => {
      const statusEl = document.getElementById("news-status");
      if (statusEl) {
        statusEl.textContent = "Refreshing AI & tech stories...";
      }
      setupNews();
    });
  }
  setupMovies();
  setupMusic();
  setupWeather();
  setupFlappy();
  setupHangman();
  setupStudentProject();
  setupChatbot(themeToggleFn);
});

