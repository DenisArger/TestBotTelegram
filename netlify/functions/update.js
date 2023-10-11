const sendMessage = require("../../sendMessage");
const { Client } = require("@notionhq/client");
const { Telegraf, Markup } = require("telegraf"); // Импортируем Telegraf

const notionApiKey = process.env.NOTION_API_KEY;
const databaseId = process.env.NOTION_DATABASE_ID;

// Инициализация клиента Notion API
const notion = new Client({ auth: notionApiKey });

const bot = new Telegraf(process.env.BOT_TOKEN); // Замените 'YOUR_BOT_TOKEN' на ваш реальный токен

bot.command("start", (ctx) => {
  ctx.reply(
    "Добро пожаловать! Я ваш бот. Как я могу вам помочь?",
    Markup.inlineKeyboard([
      Markup.urlButton("Открыть Notion", "https://www.notion.so"), // Пример кнопки, которая открывает ссылку в браузере
    ])
  );
});

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    if (!message || !message.chat || !message.text) {
      // Обработка случая, когда не хватает необходимых полей
      await sendMessage(message.chat?.id, "Неверный формат сообщения");
      return { statusCode: 400 };
    }

    if (message.text.startsWith("/start")) {
      await sendWelcomeMessage(message.chat.id);
    } else if (message.text.startsWith("/notion")) {
      const params = message.text.split(" ");
      if (params.length === 2) {
        const [, username] = params;
        const name = `${message.from.first_name}${message.from.last_name}`;
        const currentDate = new Date().toISOString().split("T")[0];
        await addToDatabase(databaseId, username, name, true, currentDate);
        await sendMessage(message.chat.id, "Данные успешно записаны");
      } else {
        await sendMessage(
          message.chat.id,
          "Неверное количество параметров. Используйте /notion username"
        );
      }
    } else {
      await sendMessage(message.chat.id, message.text);
    }

    return { statusCode: 200 };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

async function sendWelcomeMessage(chat_id) {
  try {
    const welcomeText = "Добро пожаловать! Я ваш бот. Как я могу вам помочь?";
    await sendMessage(chat_id, welcomeText);
  } catch (error) {
    console.error("Error sending welcome message:", error);
    throw error;
  }
}

async function addToDatabase(databaseId, username, name, status, date) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        ID: {
          title: [
            {
              type: "text",
              text: {
                content: username,
              },
            },
          ],
        },
        Name: {
          rich_text: [
            {
              type: "text",
              text: {
                content: name,
              },
            },
          ],
        },
        Status: {
          checkbox: status,
        },
        Date: {
          date: {
            start: date,
          },
        },
      },
    });
    console.log(response);
  } catch (error) {
    console.error(error.body);
    throw error;
  }
}

bot.launch(); // Запуск бота
