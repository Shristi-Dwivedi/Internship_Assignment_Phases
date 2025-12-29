const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
require("dotenv").config();

const Article = require("../models/Article");

const BLOG_URL = "https://beyondchats.com/blogs/page/14/";

async function scrapeBlogs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for scraping");

    const { data } = await axios.get(BLOG_URL);
    const $ = cheerio.load(data);

    let articles = [];

    $("article").each((index, element) => {
      if (articles.length >= 5) return false; 

      const title = $(element).find("h2 a").text().trim();
      const relativeUrl = $(element).find("h2 a").attr("href");
      const excerpt = $(element)
        .find(".entry-content p")
        .first()
        .text()
        .trim();

      if (!title || !relativeUrl) return;

      articles.push({
        title,
        url: relativeUrl.startsWith("http")
          ? relativeUrl
          : `https://beyondchats.com${relativeUrl}`,
        excerpt,
        content: "",
      });
    });

    for (const article of articles) {
      const exists = await Article.findOne({ url: article.url });
      if (!exists) {
        await Article.create(article);
        console.log("Saved:", article.title);
      } else {
        console.log("Already exists:", article.title);
      }
    }

    console.log("Scraping completed successfully");
    process.exit(0);

  } catch (error) {
    console.error("Scraping error:", error.message);
    process.exit(1);
  }
}

scrapeBlogs();
