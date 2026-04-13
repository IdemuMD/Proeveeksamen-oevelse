const backendBaseUrl = (window.APP_CONFIG?.backendBaseUrl || "").replace(/\/$/, "");

const state = {
  pair: null,
  leader: null,
  top: [],
  toastTimer: null
};

const leftImage = document.querySelector("#leftImage");
const rightImage = document.querySelector("#rightImage");
const leftVoteButton = document.querySelector("#leftVoteButton");
const rightVoteButton = document.querySelector("#rightVoteButton");
const statusMessage = document.querySelector("#statusMessage");
const errorMessage = document.querySelector("#errorMessage");
const topList = document.querySelector("#topList");
const toast = document.querySelector("#toast");

function setVotingDisabled(disabled) {
  leftVoteButton.disabled = disabled;
  rightVoteButton.disabled = disabled;
}

function showStatus(message) {
  statusMessage.textContent = message || "";
}

function showError(message) {
  errorMessage.textContent = message || "";
}

function showToast(message) {
  if (!message) {
    return;
  }
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2800);
}

function renderPair() {
  if (!state.pair) {
    return;
  }

  const { left, right } = state.pair;
  leftImage.src = left.imageUrl;
  rightImage.src = right.imageUrl;
  leftImage.alt = `Rev ${left.foxId}`;
  rightImage.alt = `Rev ${right.foxId}`;
  leftVoteButton.textContent = `Stem på rev ${left.foxId}`;
  rightVoteButton.textContent = `Stem på rev ${right.foxId}`;
}

function renderTop() {
  topList.innerHTML = "";
  if (!state.top.length) {
    topList.innerHTML = "<li>Ingen stemmer ennå. Vær den første!</li>";
    return;
  }

  state.top.forEach((fox) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <img src="${fox.imageUrl}" alt="Rev ${fox.foxId} i topplisten" loading="lazy" />
      <strong>Rev ${fox.foxId}</strong><br />
      Stemmer: ${fox.votes}
    `;
    topList.appendChild(item);
  });
}

async function apiRequest(path, options) {
  const response = await fetch(`${backendBaseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Ukjent API-feil");
  }
  return payload;
}

async function refreshPair() {
  const data = await apiRequest("/api/foxes/pair", { method: "GET" });
  state.pair = data;
  renderPair();
}

async function refreshStats(showLeaderToast = false) {
  const [topData, leaderData] = await Promise.all([
    apiRequest("/api/stats/top?limit=5", { method: "GET" }),
    apiRequest("/api/stats/leader", { method: "GET" })
  ]);

  state.top = topData.top || [];
  state.leader = leaderData.leader || null;
  renderTop();

  if (showLeaderToast && state.leader) {
    showToast(`Rev ${state.leader.foxId} er søtest akkurat nå!`);
  }
}

async function voteForFox(fox) {
  setVotingDisabled(true);
  showError("");

  try {
    // Vote call returns updated stats and next duel in one response for a snappy UI.
    const response = await apiRequest("/api/votes", {
      method: "POST",
      body: JSON.stringify(fox)
    });

    showStatus(`Stemmen din på rev ${fox.foxId} er registrert.`);
    state.top = response.top || [];
    state.leader = response.leader || null;
    if (response.nextPair) {
      state.pair = response.nextPair;
    } else {
      refreshPair().catch(() => {
        showError("Stemmen er lagret, men vi fikk ikke hentet nye bilder ennå.");
      });
    }
    renderTop();
    renderPair();

    if (response.warning) {
      showError(response.warning);
    }

    if (state.leader) {
      showToast(`Rev ${state.leader.foxId} er søtest akkurat nå!`);
    }
  } catch (error) {
    showError(error.message || "Kunne ikke registrere stemme.");
  } finally {
    setVotingDisabled(false);
  }
}

leftVoteButton.addEventListener("click", () => {
  if (state.pair?.left) {
    voteForFox(state.pair.left);
  }
});

rightVoteButton.addEventListener("click", () => {
  if (state.pair?.right) {
    voteForFox(state.pair.right);
  }
});

async function bootstrap() {
  showStatus("Laster rever...");
  setVotingDisabled(true);
  try {
    await Promise.all([refreshPair(), refreshStats(false)]);
    showStatus("Velg reven du synes er søtest.");
  } catch {
    showError(
      "Kunne ikke laste data akkurat nå. Sjekk nettverk eller backend og prøv igjen."
    );
  } finally {
    setVotingDisabled(false);
  }
}

bootstrap();
// Keep statistics fresh without requiring a full page reload.
setInterval(() => {
  refreshStats(false).catch(() => {
    showError("Mistet kontakt med statistikk-tjenesten.");
  });
}, 5000);
