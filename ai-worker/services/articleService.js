const axios = require("axios");

async function fetchArticles() {
  try {
    const response = await axios.get("http://localhost:5000/api/articles"); 
    console.log(response.data);
    const articles = Array.isArray(response.data)
      ? response.data
      : response.data.articles;
    return articles.filter(article => !article.isUpdated);
  } catch (error) {
    console.error("Error fetching articles:", error.message);
    return [];
  }
}

module.exports = { fetchArticles };
