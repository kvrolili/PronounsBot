const Discord = require("discord.js"),
  client = new Discord.Client(),
  axios = require("axios"),
  Jimp = require("jimp"),
  express = require("express"),
  app = express();

client.on("ready", async () => {
  console.log(`Logged in as: ${client.user.username}`);
});

client.on("message", async msg => {
  //   Ignore if author is a bot or if there isn't a prefix
  if (msg.author.bot) return;
  if (!msg.content.startsWith("p.")) return;
  //   Get command from input
  let cmd = msg.content.substr(2).split(" ")[0];
  // Get arguments for the command
  let args = msg.content.substr(2).split(" ");
  args.shift();
  msg.delete();
  
  switch (cmd) {
  case "search":
    axios
      .get(`https://en.pronouns.page/api/profile/get/${args[0]}`)
      .then(e => {
        let user = e.data;
        let profile = user.profiles[Object.keys(user.profiles)[0]];
        let embed = new Discord.MessageEmbed();
        if (profile.description) embed.setDescription(profile.description);
        if (profile.age) embed.addField("Age", profile.age);
        embed
          .setTitle(`User: ${user.username}`)
          .setURL(
            `https://${Object.keys(user.profiles)[0]}.pronouns.page/@${
              user.username
            }`
          )
          .setThumbnail(user.avatar)
          .setColor(Math.floor(Math.random() * 16777215).toString(16))
          .addField("Name(s)", Object.keys(profile.names).join(", "))
          .addField("Pronouns", Object.keys(profile.pronouns).join(", "))
          .addField("Flags", profile.flags.join(", "))
          .addField('\u200B', '[kvrolili](https://kvrolili.glitch.me/)')
        msg.channel.send(embed);
      })
      .catch(e => {
        console.log(e);
        msg.reply("error!").then(m => {
          m.delete({ timeout: 5000 });
        });
      });
  break;
  case "help":
    let embd = new Discord.MessageEmbed()
      .setColor(Math.floor(Math.random() * 16777215).toString(16))
      .setTitle("Help")
      .addField(
        "search",
        "Get someone's profile on [pronouns.page](https://en.pronouns.page)\nUsage: ```p.search <username>```"
      )
      .addField(
        "avatar",
        "Get someone's Discord avatar by mentioning them"
      )
        .addField('\u200B', '[kvrolili](https://kvrolili.glitch.me/)')
    msg.channel.send(embd);
      break;

  case "avatar":
    if (!msg.mentions.users.first())
      return msg.reply("you need to tag someone").then(m => {
        m.delete({ timeout: 5000 });
      });
    let mbed = new Discord.MessageEmbed()
      .setColor(Math.floor(Math.random() * 16777215).toString(16))
      .setTitle(`${msg.mentions.users.first().username}'s avatar`)
      .setImage(msg.mentions.users.first().avatarURL())
    .addField('\u200B', '[kvrolili](https://kvrolili.glitch.me/)')
    msg.channel.send(mbed);
  }
})

console.log("Script started!");

app.get("*", (req, res) => {
  res.sendStatus(200);
});


setInterval(() => {
  axios.get(process.env.URL);
}, 280000);

client.login(process.env.TOKEN);
app.listen(process.env.PORT);