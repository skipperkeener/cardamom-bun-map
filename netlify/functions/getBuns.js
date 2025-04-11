const { Client } = require("@notionhq/client");

exports.handler = async function(event, context) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const databaseId = process.env.NOTION_DB_ID;

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    const results = response.results.map(page => {
      console.log("DEBUG → page.properties:", page.properties);

      const title = page.properties.Name?.title[0]?.plain_text || "";
      const note = page.properties.Review?.rich_text[0]?.plain_text || "";
      const lat = page.properties["Latitude"]?.number;
      const lng = page.properties["Longitude"]?.number;

      return { title, note, lat, lng };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error("ERROR →", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};