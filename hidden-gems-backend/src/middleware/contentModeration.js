const leoProfanity = require('leo-profanity');
function contentModeration(req, res, next) {
  const { title, description, review } = req.body;
  const text = [title, description, review].filter(Boolean).join(" ");
  if (leoProfanity.check(text)) {
    return res.status(403).json({ msg: "Content rejected: inappropriate language detected." });
  }
  next();
}
module.exports = contentModeration;
