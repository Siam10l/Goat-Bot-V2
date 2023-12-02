const axios = require("axios");

module.exports = {
	config: {
		name: "twit",
		aliases: ["twitter"],
		version: "1.0",
		author: "Mohammad Alamin",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Tải video từ twitter",
			en: "Download video from twitter"
		},
		longDescription: {
			vi: "Tải video/story từ twitter (công khai)",
			en: "Download video/story from twitter (public)"
		},
		category: "media",
		guide: {
			vi: "   {pn} <url video/story>: tải video từ twitter",
			en: "   {pn} <url video/story>: download video from twitter"
		}
	},

	langs: {
		vi: {
			missingUrl: "Vui lòng nhập url video/story twitter (công khai) bạn muốn tải về",
			error: "Đã xảy ra lỗi khi tải video",
			downloading: "Đang tiến hành tải video cho bạn",
			tooLarge: "Rất tiếc không thể tải video cho bạn vì dung lượng lớn hơn 83MB"
		},
		en: {
			missingUrl: "Please enter the twitter video/story (public) url you want to download",
			error: "An error occurred while downloading the video",
			downloading: "Downloading video for you",
			tooLarge: "Sorry, we can't download the video for you because the size is larger than 83MB"
		}
	},

	onStart: async function ({ args, message, getLang, envGlobal }) {
		if (!args[0]) {
			return message.reply(getLang("missingUrl"));
		}

		let msgSend = null;
		try {
			const response = await axios.get(`https://anbusec.xyz/api/downloader/twitter?apikey=${envGlobal.apiKey}&url=${args[0]}`);

			if (!response.data.status) {
				return message.reply(response.data.message);
			}

			msgSend = message.reply(getLang("downloading"));

			const stream = await global.utils.getStreamFromURL(response.data.url);
			await message.reply({ attachment: stream });

			message.unsend((await msgSend).messageID);
		}
		catch (e) {
			message.unsend((await msgSend).messageID);
			return message.reply(getLang("tooLarge"));
		}
	}
};
