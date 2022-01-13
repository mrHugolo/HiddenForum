const crypto = require("crypto");
let session = require("express-session");
global.sessionUser = []

module.exports = (app, db) => {
  const salt = "sweetSalt".toString("hex");

  app.use(
    session({
      secret: "5ecre754l7",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );

  function getHash(password) {
    let hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    return hash;
  }

  app.post("/api/register", async (req, res) => {
    let user = req.body;
    let checkEmail = /*sql*/ `SELECT email,username FROM user WHERE email=? OR username =?`;
    db.get(checkEmail, [user.email, user.username], (err, rows) => {
      if (err) throw err;
      else if (rows)
        res.send(
          (rows.email == user.email ? "email" : "username") + " already in use"
        );
      else {
        let hash = getHash(user.password);
        try {
          db.all(
            /*sql*/ `INSERT INTO user (username,email,password,isBanned,description) VALUES(?,?,?,?,?)`,
            [user.username, user.email, hash, user.isBanned, user.description]
          );
          //res.status(200); // ok?
          res.send(user);
        } catch (e) {
          console.error("error", e);
        }
      }
    }); 
  });

  app.post("/api/login", async (req, res) => {
    let ip =  req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log(ip);

    if (req.session.user !== undefined && req.session.user) {
      res.send(req.session.user.username + " already logged in session");  
      return;
    }

    let hash = getHash(req.body.password); 

    let user = /*sql*/ `SELECT * FROM user WHERE username = ? AND password = ?`;
    await db.get(user, [req.body.username, hash], (err, rows) => {
      if (err) throw err;
      else if (rows) {
        req.session.user = rows;
        sessionUser = rows;
        delete rows.password;
        res.send(rows);
      } else {
        res.status(401); // unauthorized
        res.json({ response: "bad credentials" });
      }
    });
  });

  app.get("/api/whoami", async (req, res) => {
    if (req.session.user !== undefined && req.session.user) {
      let currentUser = req.session.user;
      delete currentUser.password;
      res.send(currentUser);
      return;
    }
    res.send("no user yet");
  });

  app.delete("/api/logout", async (req, res) => {
    if (req.session.user) {
      delete req.session.user;
      res.status("200");
      res.send("Logged out from session");
    } else res.send("no one in logged in session");
  });
};
