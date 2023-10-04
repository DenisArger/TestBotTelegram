const axios = require("axios").default;

module.exports = async (chat_id, text) => {
  try {
    await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id,
        text,
      }
    );

    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// async function sendMessage(chat_id, text) {
//   try {
//     await axios.post(
//       `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
//       {
//         chat_id,
//         text,
//       }
//     );

//     return true;
//   } catch (error) {
//     console.error("Error sending message:", error);
//     throw error;
//   }
// }
