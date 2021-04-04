const axios = require('axios')
const { Client, EVENT } = require('dogehouse.js');
const os = require('os');
const { exec } = require('child_process');
let app = new Client()
require('dotenv').config()
var fs = require('fs');


// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let owner = 'c6eee802-7275-4190-9f72-4b2f56fc574c';
let developers = ['f41a017d-0adc-4034-bb38-cf12c804a37b','d7fea48f-8b2a-4d02-8cfd-06cc37c1421f', 'c6eee802-7275-4190-9f72-4b2f56fc574c', 'e44ad29a-536e-4916-9849-457ca8d77b11'];
let currentRoom = '770ce2b2-b73d-4a48-b949-e916dd611121'

app.connect(process.env.TOKEN, process.env.REFRESH_TOKEN).then(async () => {
	console.log('Connected!')
	app.rooms.join(currentRoom)
});

let prefix = '%'

app.on(EVENT.NEW_CHAT_MESSAGE, async (message) => {
	if (message.content == prefix + 'ping') {
		await message.delete()
		message.reply('Pong!', { whispered: true, mentionUser: false })
	}

	if (message.content.slice(0, 4) == prefix + 'dev') {
		await message.delete()
		if (developers.indexOf(await message.author.id) == -1) {
			await message.author.whisper(`Developer only command. Contact @admin for info.`)
		} else {
			await message.author.whisper(`You are a developer`)
		}
	}

	if (message.content.slice(0, 5) == prefix + 'eval') {
		if (developers.indexOf(await message.author.id) == -1) {
			await message.author.whisper(`Developer only command. Contact @admin for info.`)
		} else {
			// await message.author.whisper(`You are a developer`)
			if (message.content.length > 6) {
				let result = eval(message.content.slice(6, message.content.length));
				message.reply(result);
			} else {
				message.reply('Invalid Eval')
			}
		}
	}
	if (message.content.slice(0, 5) == prefix + 'exec') {
		if (developers.indexOf(await message.author.id) == -1) {
			await message.author.whisper(`Developer only command. Contact @admin for info.`)
		} else {
			// await message.author.whisper(`You are a developer`)
			if (message.content.length > 6) {
				let result = exec(message.content.slice(6, message.content.length));
				message.reply(result);
			} else {
				message.reply('Invalid Exec')
			}
		}
	}

	if (message.content == prefix + 'host') {
		await message.delete()
		if (await message.author.id != "c6eee802-7275-4190-9f72-4b2f56fc574c") {
			await message.author.whisper(`Developer only command. Contact @admin for info.`)
		} else {
			let hostinfo = `OS: ${os.type()} ${os.release()} ${os.arch()} | CPU: (${os.cpus().length} Cores) ${os.cpus(0)[0].model} | Memory: ${Math.round(os.freemem() / 1024 / 1024 / 1024 * 10) / 10}GB free of ${Math.round(os.totalmem() / 1024 / 1024 / 1024 * 10) / 10}GB`;
			await message.author.whisper(hostinfo)
		}
	}

	if (message.content == prefix + 'uptime') {
		await message.delete()
		let a = new Date(new Date().valueOf() - process.uptime())
		b = a.getDate();

		var weekday = new Array(7);
		weekday[0] = "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";
		var month = new Array();
		month[0] = "January";
		month[1] = "February";
		month[2] = "March";
		month[3] = "April";
		month[4] = "May";
		month[5] = "June";
		month[6] = "July";
		month[7] = "August";
		month[8] = "September";
		month[9] = "October";
		month[10] = "November";
		month[11] = "December";

		launch = weekday[a.getDay()] + ', ' + (b + (b > 0 ? ['th', 'st', 'nd', 'rd'][(b > 3 && b < 21) || b % 10 > 3 ? 0 : b % 10] : '')) + ' ' + month[a.getMonth()] + ', ' + a.getFullYear();

		let totalSeconds = process.uptime();
		let dys = Math.floor(totalSeconds / 86400);
		let hrs = Math.floor(totalSeconds / 3600) - (dys * 24);
		totalSeconds %= 3600;
		let min = Math.floor(totalSeconds / 60);
		let sec = Math.floor(totalSeconds % 60);

		uptime = '';
		uptime += (dys != 0) ? ' ' + dys + ' days' : '';
		uptime += (hrs != 0) ? ' ' + hrs + ' hrs' : '';
		uptime += (min != 0) ? ' ' + min + ' min' : '';
		uptime += (sec != 0) ? ' ' + sec + ' sec' : '';
		message.reply(`Launch Date: ${launch} | Uptime: ${uptime}`, { mentionUser: false })
	}

});
