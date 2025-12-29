const axios = require("axios");

/**
 * @param {string} query 
 * @returns {array} 
 */
async function googleSearch(query) {
  try {
    const SERP_API_KEY = process.env.SERP_API_KEY;
    if (!SERP_API_KEY) {
      console.warn("SERP_API_KEY not set. Returning dummy URLs.");
      return [
        "https://exampleblog1.com/sample-article",
        "https://exampleblog2.com/sample-article"
      ];
    }

    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        q: query,
        engine: "google",
        api_key: SERP_API_KEY,
        num: 5
      }
    });

    const results = response.data.organic_results || [];

    const filtered = results
      .map(r => r.link)
      .filter(link => !link.includes("beyondchats.com"));

    return filtered.slice(0, 2);
  } catch (error) {
    console.error("Google search error:", error.message);
    return [
      "https://exampleblog1.com/sample-article",
      "https://exampleblog2.com/sample-article"
    ];
  }
}

module.exports = { googleSearch };
