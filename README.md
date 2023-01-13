
# UNLV Verify Bot 

This is a discord bot that uses a student's email to verify that they are enrolled in a UNLV class.

# Requirements
- Discordjs
- Nodejs 

# Setup 
**Install all required packages**
```
npm install 
```
**Settings: Config.json File**
```
{
    "token": "",
    "clientId": "",
    "guildId": "",
    "emailPort": "",
    "smtpHost": ""
  }
```
**Setup Discord Roles**

The UNLV Verify bot requires two roles to be setup
- Verified - The verified role is assigned to students who have verified their email. Most discord servers will require verified roles to access public lobby channels to prevent spam and other harrasment. 

- Instructor - A role assigned to instructors to allow them to have use of administrative slash commands. 

- Bot Role - This role is created automatically when the bot is invited to your Discord server. The Bot Role will need to be above all other student roles to have appropripate permissions to modify and assign users. 


# Start Bot
**Deploy commands for Discord Bot** 
<br /><br />Commands only need to be deployed when there are updates to slash commands.
```
node deploy-commands.js 
```

**Run Bot** 
```
node index.js 
```


**Daemonize Bot** 

[PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) is a daemon process manager that can be used to daemonize the bot. 
```
pm2 start index.js
```

# Administrative End 
- /upload - CSV upload of a class roster.
<br />

The CSV file requires the header below: 

```
Student Name,Student ID,Student SIS ID,Email,Section Name 
```
- /remove - Removes a student discord role, and removes them from the class database. 

# Student End 
- /request - Student request an authentication code to be sent to their UNLV email address.
- /verify - Students will be assigned a verified role if they entered a matching authentication code.
- /addClasses - The students classes entered in the DB will be fetched and will have all class roles assigned. 


# Database Schema 
## Tables
### Classes
| class      | class_id (PK) |
| ----------- | ----------- |
| Operating Systems      | 2228-CS-370-SEC1003-906978   |
| Systems Programming     | 2228-CS-218-SEC1003-906978   |
### Students
| name      | discord_id |student_email(PK)| code | verified|
| ----------- | ----------- | -----------|----------- | |
| John Smith   | 123456768       | test@unlv.nevada.edu | 123456 | 0  |

### Enrollment
| student_email  (PK)(FK)    | class_id (PK)(FK)|
| ----------- | ----------- |
| test@unlv.nevada.edu     |    2228-CS-370-SEC1003-906978     |
| test@unlv.nevada.edu     |    2228-CS-218-SEC1003-906978    |

- (PK) - Primary Key
- (FK) - Foreign Key
