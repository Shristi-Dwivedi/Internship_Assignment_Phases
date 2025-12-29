const axios = require("axios");
const cheerio = require("cheerio");

/**
 * @param {string} url 
 * @returns {string} 
 */
async function scrapeReference(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    $("script, style, nav, footer, header, aside, noscript").remove();

    let content = "";

    $("h1, h2, h3, p").each((i, el) => {
      const text = $(el).text().trim();
      if (text) {
        content += text + "\n\n";
      }
    });

    return content;
  } catch (error) {
    console.error(`Error scraping URL ${url}:`, error.message);
    return "";
  }
}

module.exports = { scrapeReference };
