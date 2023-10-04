const sendMessage = require("../../sendMessage");

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    // Отправляем сообщение обратно с тем же текстом и chat_id
    await sendMessage(message.chat.id, message.text);

    return { statusCode: 200 };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
