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
// let joinleft = false;
// let logPrefix = `[DOGEWATCHER]`;
let currentRoom = '770ce2b2-b73d-4a48-b949-e916dd611121'
// let roomLog = `\n${logPrefix} Logging Data for ${currentRoom} | Time: ${new Date().valueOf()}\n`;
// fs.appendFile('userdata.log', roomLog, function (err) {
// 	if (err) throw err;
// 	console.log('Created userdata.log');
// });

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

	if (message.content == prefix + 'help') {
		await message.delete()
		let help = `Commands: 8ball, decode64, encode64, flip, ping, roll, uptime. | Developer Commands: host`;
		message.reply(`${help}`)
	}

	if (message.content == prefix + 'flip') {
		await message.delete()
		let result = (Math.random() >= 0.5) ? "Heads" : "Tails";
		message.reply(`Coin Flip Result: ${result}`)
	}

	if (message.content.slice(0, 9) == prefix + 'decode64') {
		await message.delete()
		let data;
		if (message.content.length == 9) {
			data = `Must provide a string`
		} else {
			data = message.content.slice(10, message.content.length)
			data = Buffer.from(data, 'base64').toString()
		}
		message.reply('Decoded data: ' + data)
	}

	if (message.content.slice(0, 9) == prefix + 'encode64') {
		await message.delete()
		let data;
		if (message.content.length == 9) {
			data = `Must provide a string`
		} else {
			data = message.content.slice(10, message.content.length)
			data = Buffer.from(data).toString('base64')
		}
		message.reply('Encoded data: ' + data)
	}

	if (message.content.slice(0, 5) == prefix + 'roll') {
		await message.delete()
		let max = 6;
		if (message.content.length > 6) {
			max = parseInt(message.content.slice(6, message.content.length));
		}
		let result = Math.floor(Math.random() * max) + 1;
		message.reply(`(${max}) Roll Result: ${result}`)
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

	if (message.content.slice(0, 6) == prefix + '8ball') {
		await message.delete()
		let responses = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes – definitely.', 'You may rely on it.', 'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', 'Don\'t count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.'];
		let result = Math.floor(Math.random() * 20);
		message.reply(`Question: ${message.content.slice(7, message.content.length)} | Response: ${responses[result]}`)
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

	if (message.content == prefix + 'statistics') {
		let data = await axios.get('https://api.dogehouse.xyz/v1/statistics')
		await message.delete()
		message.reply(`Total Online: ${data.data.totalOnline} | Total Rooms: ${data.data.totalRooms} | Total Bots Online: ${data.data.totalBotsOnline}`, { mentionUser: false })
	}

	if (message.content == prefix + 'userinfo') {
		await message.delete()
		let msgObj = [` :catJAM: Username: ${await message.author.username}  :catJAM: Bio: ${await message.author.bio}  :catJAM: Followers: ${await message.author.numFollowers}  :catJAM: Following: ${await message.author.numFollowing}  :catJAM: Avatar: `, { link: await message.author.avatarUrl }]
		await message.author.whisper(msgObj)
	}

	messageAuthor = await message.author;
	// console.log(`${await messageAuthor.username}: ${message.content}`);
	messageData = `${messageAuthor.username}\n${messageAuthor.id}\n${messageAuthor.avatarUrl}\n${message.content}\n`
	// logData(messageData)


});

// app.on(EVENT.USER_JOINED_ROOM, user => {

// 	const publicWelcomeMessage = [{ mention: user.username }, " has joined the room!"];
// 	const privateWelcomeMessage = ["Welcome to the room ", { mention: user.username }, " I hope you enjoy your stay."];

// 	let userData = `ID: ${user.id}\nFollowers: ${user.numFollowers}\nFollowing: ${user.numFollowing}\nDisplayName: ${user.displayName}\nAvatarURL: ${user.avatarUrl}\n`
// 	fs.appendFile('test.log', `\nTimeStamp: ${new Date().valueOf()}\n${userData}`, function (err) {
// 		if (err) throw err;
// 	});

// 	logData(`${logPrefix} ${publicWelcomeMessage}\n`)
// 	if (joinleft == true) {
// 		app.bot.sendMessage(publicWelcomeMessage);
// 		user.whisper(privateWelcomeMessage);
// 	}
// });

// app.on(EVENT.USER_LEFT_ROOM, user => {
// 	messageData = `@${user.username} has left the room!`;
// 	if (joinleft == true) {
// 		app.bot.sendMessage(messageData)
// 	}
// 	logData(`${logPrefix} ${messageData}\n`)
// });

// function logData(data) {
// 	fs.appendFile('userdata.log', `TimeStamp: ${new Date().valueOf()} | ${data}`, function (err) {
// 		if (err) throw err;
// 	});
// }

// app.socket.addEventListener('message', async (e, arrivedId) => {
// 	const msg = JSON.parse(e.data);

// 	// console.log(msg.op)
// 	fs.appendFile('opcodes.log', `\nTimeStamp: ${new Date().valueOf()} | ${msg.op}`, function (err) {
// 		if (err) throw err;
// 	});

// });

// app.setMaxListeners(20);