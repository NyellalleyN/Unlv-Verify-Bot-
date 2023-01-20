const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const database = require("../database/Database");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upload")
    .setDescription(
      "Paste list of students and emails to upload into the database."
    )
    .addAttachmentOption((option) =>
      option
        .setName("file")
        .setDescription("Student names and emails")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    let botResponse = "";

    if (
      interaction.member.roles.cache.some((role) => role.name === "Instructor")
    ) {
      var data = interaction.options.getAttachment("file");
      //Format Input
      var index = 0;
      var studentData;

      //Download CSV locally
      await axios.get(data.url).then((resp) => {
        studentData = resp.data.split("\n");
        studentData.splice(0, 1);
      });

      let student = studentData[index].split(",");
      let dbClassID = student[4];
      let classNumber = student[4].split("-");
      let className = "";

      // Class Name for Database
      if (classNumber[2] == "370") className = "Operating Systems";
      else if (classNumber[2] == "302") className = "Data Structures";
      else if (classNumber[2] == "218") className = "Systems Programming";
      else if (classNumber[2] == "135") className = "Computer Science I";
      else if (classNumber[2] == "202") className = "Computer Science II";
      else if (classNumber[2] == "326") className = "Prog Concepts";
      else className = "Other";

      // Add Class to DB
      const boolClassAdd = await database.checkExists(
        "class_id",
        dbClassID,
        "Classes"
      );

      //If Added Create Discord Role
      if (!boolClassAdd) {
        database.addClass(className, dbClassID);
        // Check Discord for Existing Role
        let classRole = interaction.guild.roles.cache.find(
          (role) => role.name === dbClassID
        );
          await interaction.guild.roles.create({
            name: dbClassID,
            color: "Green",
          });
      } else console.log("Class " + classNumber + " already exists");

      // Add Student/Enrollments to DB
      while (index <= studentData.length - 1) {
        student = studentData[index].split(",");
        database.addStudent(student[3], student[0]);
        database.addEnrollment(student[3], student[4]);
        index++;
      }
      botResponse = "Students have been added to the database";
    } else botResponse = "You do not have permissions to use this command.";

    await interaction.reply({
      content: botResponse,
      ephemeral: true,
    });
  },
};
