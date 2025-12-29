require("dotenv").config();
const { fetchArticles, updateArticle } = require("./services/articleService");
const { googleSearch } = require("./services/googleService");
const { scrapeReference } = require("./services/scrapeService");
const { generateUpdatedArticle } = require("./services/llmService");

async function main() {
  try {
    console.log("Phase 2");

    const articles = await fetchArticles();
    console.log(`Fetched ${articles.length} articles to process.`);

    for (const article of articles) {
      console.log("\nProcessing article:", article.title);

      const references = await googleSearch(article.title);
      console.log("Top reference URLs:", references);

      const referenceContents = [];
      for (const url of references) {
        const content = await scrapeReference(url);
        referenceContents.push(content);
      }

      const updatedContent = await generateUpdatedArticle(
        article.content || article.excerpt || "",
        referenceContents
      );

      await updateArticle(article._id, updatedContent, references);
      console.log(`Article "${article.title}" updated successfully.`);
    }

    console.log("\n=== Phase 2: AI Worker Completed ===");
    process.exit(0);

  } catch (error) {
    console.error("Error in AI Worker:", error.message);
    process.exit(1);
  }
}

main();
