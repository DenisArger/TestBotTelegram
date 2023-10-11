const sendMessage = require("../../sendMessage");
const { Client } = require("@notionhq/client");
const { Markup } = require("node-telegram-bot-api");
const notionApiKey = process.env.NOTION_API_KEY;
const databaseId = process.env.NOTION_DATABASE_ID;

// Инициализация клиента Notion API
const notion = new Client({ auth: notionApiKey });

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    if (!message || !message.chat || !message.text) {
      // Обработка случая, когда не хватает необходимых полей
      await sendMessage(message.chat?.id, "Неверный формат сообщения");
      return { statusCode: 400 }; // Возвращаем статус код 400 для указания ошибки клиента
    }

    if (message.text.startsWith("/start")) {
      // Обработка команды /start и отправка приветственного сообщения
      await sendWelcomeMessage(message.chat.id);
    } else if (message.text.startsWith("/notion")) {
      // Обработка команды /notion и запись данных в Notion
      const params = message.text.split(" ");
      if (params.length === 2) {
        const [, username] = params;
        const name = `${message.from.first_name}${message.from.last_name}`; // Имя пользователя из Telegram
        const currentDate = new Date().toISOString().split("T")[0]; // Текущая дата в формате "гггг-мм-дд"
        await addToDatabase(databaseId, username, name, true, currentDate);
        await sendMessage(message.chat.id, "Данные успешно записаны");
      } else {
        await sendMessage(
          message.chat.id,
          "Неверное количество параметров. Используйте /notion username"
        );
      }
    } else {
      // В противном случае, отправка сообщения с тем же текстом
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

    // Создаем кнопку "Отправить данные в Notion"
    const keyboard = Markup.inlineKeyboard([
      Markup.callbackButton("Отправить данные в Notion", "notion"),
    ]);

    // Отправка приветственного сообщения с кнопкой
    await sendMessage(chat_id, welcomeText, { reply_markup: keyboard });
  } catch (error) {
    console.error("Error sending welcome message:", error);
    throw error;
  }
}

// Функция для добавления записи в Notion
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
