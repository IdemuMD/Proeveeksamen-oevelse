const config = require("../config");

function isValidFoxImage(imageUrl) {
  return typeof imageUrl === "string" && imageUrl.startsWith(config.randomFoxImageBase);
}

function extractFoxId(imageUrl) {
  if (!isValidFoxImage(imageUrl)) {
    return null;
  }

  const match = imageUrl.match(/\/images\/(\d+)\.(jpg|jpeg|png|webp)$/i);
  if (!match) {
    return null;
  }

  return Number(match[1]);
}

async function fetchRandomFoxCandidate() {
  const response = await fetch(config.randomFoxApiUrl, {
    headers: { "Accept": "application/json" }
  });

  if (!response.ok) {
    throw new Error(`randomfox_failed_${response.status}`);
  }

  const payload = await response.json();
  const imageUrl = payload.image;
  const foxId = extractFoxId(imageUrl);

  if (!foxId) {
    throw new Error("randomfox_invalid_payload");
  }

  return {
    foxId,
    imageUrl
  };
}

async function fetchDistinctFoxPair(maxAttempts = 20) {
  const uniqueFoxes = new Map();

  for (let i = 0; i < maxAttempts; i += 1) {
    try {
      // We retry until we have two unique fox ids because randomfox can repeat images.
      const candidate = await fetchRandomFoxCandidate();
      uniqueFoxes.set(candidate.foxId, candidate);
      if (uniqueFoxes.size === 2) {
        const [left, right] = [...uniqueFoxes.values()];
        return { left, right };
      }
    } catch (error) {
      if (error.message.startsWith("randomfox_failed_")) {
        throw error;
      }
    }
  }

  throw new Error("randomfox_pair_unavailable");
}

module.exports = {
  extractFoxId,
  isValidFoxImage,
  fetchRandomFoxCandidate,
  fetchDistinctFoxPair
};
