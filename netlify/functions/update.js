const sendMessage = require("../../sendMessage");

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    if (message.text.startsWith("/start")) {
      // Обработка команды /start и отправка приветственного сообщения
      await sendWelcomeMessage(message.chat.id);
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
    // Текст приветственного сообщения
    const welcomeText = "Добро пожаловать! Я ваш бот. Как я могу вам помочь?";

    // Отправка приветственного сообщения
    await sendMessage(chat_id, welcomeText);
  } catch (error) {
    console.error("Error sending welcome message:", error);
    throw error;
  }
}
