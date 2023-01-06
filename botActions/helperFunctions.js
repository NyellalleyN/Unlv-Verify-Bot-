const database = require("../database/Database");

function genVerificationCode(n) {
  var code = "";
  for (var i = 0; i < n; i++) {
    code += String(Math.floor(Math.random() * 10));
  }
  return code;
}

async function sendVerifyMessage(interaction, mailSender) {
  //let regex = new RegExp("[a-z0-9]+@unlv.nevada.edu");
  let email = interaction.options.getString("email");
  var checkEmail = await database.checkExists("student_email", email);
  //Check DB for EMail
  if (checkEmail) {
    //Fetch User
    var user = await database.getUser("student_email", email);
    //Check If Already Verified
    if (user.verified) return -1;
    //Generate and Send Code
    var code = genVerificationCode(10);
    database.updateStudent(email, code);
    mailSender.sendEmail(email, code);
  } else return 0;

  return 1;
}

async function checkCode(interaction) {
  //Fetch UserID
  let code = interaction.options.getString("auth");
  let user = await database.getUser("code", code);
  //Verify Match
  if (code === user.code) {
    //Check If User Is Already Verified
    var dupe = await database.checkExists("discord_id", interaction.user.id, "Students");
    //Return If ID Already Verified
    if (dupe) return false;
    database.enableUser(code, interaction.user.id);
    //Find User in Discord
    let myRole = interaction.guild.roles.cache.find(
      (role) => role.name === "Verified"
    );
    //Set Role and Nickname in Discord
    await interaction.member.roles.add(myRole);
    await interaction.member.setNickname(user.name);
  } else return false;
  return true;
}




module.exports = { sendVerifyMessage, checkCode };
