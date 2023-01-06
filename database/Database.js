const { emitWarning } = require("process");

const sqlite3 = require("sqlite3").verbose();

class Database {
  constructor() {
    this.db = new sqlite3.Database("UNLV_VERIFY.db", (err) => {
      if (err) {
        console.log("Could not connect to database", err);
      } else {
        console.log("Connected to database");
        //Create Student Table
        this.db.run(
          `CREATE TABLE IF NOT EXISTS Students(
            name text, 
            discord_id text, 
            student_email text, 
            code text, 
            verified boolean, 
            PRIMARY KEY (student_email));`
        );
          //Create Classes Table
        this.db.run(
          `CREATE TABLE IF NOT EXISTS Classes(
            class name text, 
            class_id text, 
            PRIMARY KEY(class_id));`
        );
        //Create Enrollment Table
        this.db.run(
          `CREATE TABLE IF NOT EXISTS Enrollment(
            student_email text,
            class_id text,
            PRIMARY KEY (student_email, class_id),
            foreign key (student_email) references student (student_email),
            foreign key (class_id) references class (class_id));`
        );
      }
    });
  }
  //Helper Function Reduce Clutter
  runCommand(sql, params) {
    this.db.run(sql, params, function (err) {
      if (err) {
        console.error(err.message);
        return -1;
      }
      console.log(`Row(s) updated: ${this.changes}`);
      return 1;
    });
  }
/***************************************************************** 
Database Functions 

  addStudent(userEmail, studentName) 
    - Add student record in DB. 

  addEnrollment(studentEmail, class_id)
    - Add enrollment record in DB.

  addClass(className, classID) 
    - Add Class record in DB.

  updateStudent(userEmail, code)
    - Update Student record with verification code

  checkExists(condition, value, table)
    - Check if record Exists in a Database 
    - Return = Record if True / NULL if False 

  getUser(condition, value)
    - Fetches a user from DB 
    - Return = single record from Students table

  enableUser(code, discordID)
    - Modifies a student record with a student discordID and sets verification to true

  getStudentClasses(params)
    - Joins tables to find all of a students classes.
    - Return = Array of databased records of all classes

*****************************************************************/
  addStudent(userEmail, studentName) {
    let sql = `INSERT INTO Students(student_email, name, verified)
               VALUES (?, ?, 0)`;
    let params = [userEmail, studentName];
    return this.runCommand(sql, params);
  }
  addEnrollment(studentEmail, class_id) {
    let sql = `INSERT INTO Enrollment(student_email, class_id)
               VALUES (?, ?)`;
    let params = [studentEmail, class_id];
    return this.runCommand(sql, params);
  }
  addClass(className, classID) {
    let sql = `INSERT INTO Classes(class, class_id)
               VALUES (?, ?)`;
    let params = [className, classID];
    return this.runCommand(sql, params);
  }

  updateStudent(userEmail, code) {
    let sql = `UPDATE Students
               SET code = ? 
               WHERE student_email = ?`;
    let params = [code, userEmail.toLowerCase()];
    this.runCommand(sql, params);
    return code;
  }

  checkExists(condition, value, table) {
    return new Promise((resolve, reject) => {
      let sql =
        `SELECT * FROM ` +
        table +
        ` 
        WHERE EXISTS(SELECT * FROM ` +
        table +
        ` WHERE ` +
        condition +
        ` = ?)`;
      let params = [value];
      this.db.get(sql, params, (err, res) => {
        if (err) {
          console.error("DB Error: Fetch failed: ", err.message);
          reject(err.message);
        } else {
          resolve(res ? res[condition] : null);
        }
      });
    });
  }

  getUser(condition, value) {
    return new Promise((resolve, reject) => {
      let sql = "SELECT * FROM Students WHERE " + condition + " = ? ";
      let params = [value];

      return this.db.get(sql, params, function (err, res) {
        if (err) {
          console.error("DB Error: Fetch failed: ", err.message);
          return reject(err.message);
        }
        return resolve(res);
      });
    });
  }

  enableUser(code, discordID) {
    let sql = `UPDATE Students
            SET verified = ?,
                discord_id = ?
            WHERE code = ?`;
    let params = [true, discordID, code];
    this.runCommand(sql, params);
  }

  getStudentClasses(params) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM Students a
      join Enrollment b on a.student_email = b.student_email
      join Classes c on c.class_id = b.class_id
      WHERE a.student_email = ? 
      `;

      return this.db.all(sql, params, function (err, res) {
        if (err) {
          console.error("DB Error: Fetch failed: ", err.message);
          return reject(err.message);
        }
        return resolve(res);
      });
    });
  }
}

const database = new Database();

module.exports = database;
