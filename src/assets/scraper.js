// const axios = require("axios");
// const cheerio = require("cheerio");
// const fs = require("fs");

// // Function to query Common Crawl API to fetch URLs of a specific domain
// async function fetchUrlsFromCommonCrawl(
//     domain,
//     collection = "CC-MAIN-2025-13"
// ) {
//     const baseUrl = `https://index.commoncrawl.org/${collection}-index?url=www.${domain}/*&output=json&pageSize=1500`;

//     try {
//         const response = await axios.get(baseUrl);

//         function parseWebData(data) {
//             let results = [];
//             let lines = data.split("\n");

//             for (let i = 0; i < lines.length - 1; i++) {
//                 let line = lines[i];
//                 let url = JSON.parse(line).url;
//                 results.push(url);
//             }
//             return results;
//         }

//         let webData = parseWebData(response.data);

//         console.log(`${domain} - URL Count: `, webData.length);

//         return webData;
//     } catch (error) {
//         console.error(
//             `Error fetching URLs from Common Crawl for ${domain}:`,
//             error.message
//         );
//         return [];
//     }
// }

// // Function to check if a website can be embedded in an iframe
// async function checkIframeEmbed(url) {
//     try {
//         const { headers } = await axios.head(url, {
//             headers: { "User-Agent": "Mozilla/5.0" },
//         });

//         if (
//             headers["x-frame-options"] &&
//             (headers["x-frame-options"] === "DENY" ||
//                 headers["x-frame-options"] === "SAMEORIGIN")
//         ) {
//             return false;
//         }
//         return true;
//     } catch (error) {
//         console.error(`Error checking iframe embed for ${url}:`, error.message);
//         return false;
//     }
// }

// // Function to scrape website content
// async function scrapeWebsite(url) {
//     console.log(url);
//     try {
//         const { data } = await axios.get(url, {
//             headers: { "User-Agent": "Mozilla/5.0" },
//         });
//         const $ = cheerio.load(data);
//         console.log("Scraping: " + url);
//         const text = $("body").text().replace(/\s+/g, " ").trim();
//         return { url, text: text.substring(0, 10000) }; // Limit text for performance
//     } catch (error) {
//         console.error(`Error scraping ${url}:`, error.message);
//         return { url, text: "Failed to scrape" };
//     }
// }

// // Main function to scrape websites from Common Crawl and check iframe embedding
// async function scrapeAll(domains) {
//     const allResults = [];

//     for (let domain of domains) {
//         if (
//             (await checkIframeEmbed("http://" + domain)) === false ||
//             (await checkIframeEmbed("https://" + domain)) === false
//         ) {
//             console.log(`Skipping ${domain} - Cannot embed in iframe`);
//             continue;
//         }

//         // Step 1: Fetch URLs from Common Crawl for the domain
//         const urls = await fetchUrlsFromCommonCrawl(domain);

//         // Step 3: Scrape the filtered websites
//         const results = await Promise.all(urls.map(scrapeWebsite));

//         allResults.push(...results);
//         console.log(`Scraping completed for ${domain}`);
//     }

//     // Step 4: Save the scraped data to a JSON file
//     fs.writeFileSync("scraped_data.json", JSON.stringify(allResults, null, 2));
//     console.log("Scraping complete. Data saved to scraped_data.json");
// }

// // Example usage: Scrape websites from a list of domains
// const domainsToScrape = ["wikipedia.org", "example.com", "bbc.com"];
// scrapeAll(domainsToScrape);
