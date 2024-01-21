const express = require("express");
const app = express();
const port = 3000;
const leetcode = require("./leetCode")

app.get("/", (req, res) => {
    res.send(`<h3>localhost:3000/username</h3>`)
})

app.get("/daily", leetcode.dailyProblem);

app.get("/select", leetcode.selectProblem);

app.get("/problems", leetcode.problems);

app.get("/:username", leetcode.userData);
app.get("/:username/badges", leetcode.userBadges);
app.get("/:username/solved", leetcode.solvedProblem);
app.get("/:username/contest", leetcode.userContest);
app.get("/:username/contest/history", leetcode.userContestHistory);
app.get("/:username/submission", leetcode.submission);
app.get("/:username/calendar", leetcode.calendar);


app.listen(port, () => {
    console.log(`I am listening at http://localhost:${port}`)
})