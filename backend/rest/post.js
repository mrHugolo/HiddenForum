const { json } = require("body-parser");

module.exports = function restPost(app, db) {

  app.post("/rest/post", (req, res) => {

    if (!req.body.title || !req.body.content || !sessionUser?.id) {
      res.send({ response: false })
      return
    }
    db.get("INSERT INTO [post] (groupId, userId, title, content) VALUES (?,?,?,?)", [req.body.groupId, req.body.userId, req.body.title, req.body.content], (err2, row2) => {
      if (err2) throw err2
      db.get("SELECT id from [post] ORDER BY id DESC LIMIT 1", [], (err3, row3) => {
        if (err3) throw err3
        res.send({ response: row3.id })
      })
    })
  });

  app.get("/rest/post/:postId", (req, res) => {

    db.all(/*sql*/ `SELECT text, (SELECT username FROM user WHERE id = userId) AS commentUsername,
      (SELECT title FROM post WHERE id =?) AS title,
        (SELECT content FROM post WHERE id =?) AS content,
          (SELECT username FROM user WHERE id = (SELECT userId FROM post WHERE id =?)) AS posterName FROM comment WHERE postId =?`, [req.params.postId, req.params.postId, req.params.postId, req.params.postId], (err, rows) => {
            if (err) throw err
            res.send({ response: rows })
    })
  })




  function exec(sql, params, res) {
    db.all(sql, params, (err, rows) => {
      if (err) {
        throw err
      }
      res.send(rows)
    });
  }
}