
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
    "token": 
    "clientId": 
    "guildId": 
    "serverEmail": 
    "serverPassword": 
    "smtpHost": 
}
```

# Start Bot
**Deploy commands for Discord Bot** 
```
node deploy-commands.js 
```

**Run Bot** 
```
node index.js 
```

The bot should now be running. 


# Bot Commands 
- /verify - Student enters authentication that was sent to email. 
- /upload - Admin CSV upload of a class roster.
 ```
 CSV Format: 
Student Name,Student ID,Student SIS ID,Email,Section Name
 ```
- /request - Student request authentication code.
- /addClasses - Student request roles to be added, must be verified. 
