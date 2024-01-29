const express = require("express");
const app = express();
const port = 3000;
const leetcode = require("./leetCode");

// source: https://stackoverflow.com/a/18311469/8089674
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', false);

  // Pass to next layer of middleware
  next();
});

app.get("/", (req, res) => {
  res.json({
    routes: {
      userDetails: {
        "/:username": "get your profile Details",
        "/:username/badges": "get your badges",
        "/:username/solved": "get total number of question you solved",
        "/:username/contest": "get your contest details",
        "/:username/contest/history": "get all contest history",
        "/:username/submission": "get your last 20 submission",
        "/:username/submission?limit=7": "get some of your last submission",
        "/:username/acSubmission": "get your last 20 accepted submission",
        "/:username/acSubmission?limit=7":
          "get some of your last accepted submission",
        "/:username/calendar": "get your submission calendar",
      },
      problems: {
        dailyProblem: { "/daily": "get daily Problem" },
        singleProblem: { "/select?titleSlug=two-sum": "get selected Problem" },
        problemList: {
          "/problems": "get list of 20 problems",
          "/problems?limit=50": "get list of some problems",
          "/problems?tags=array+math": "get list problems on selected topics",
          "/problems?tags=array+math+string&limit=5":
            "get list some problems on selected topics",
        },
      },
    },
  });
});

//get the daily leetCode problem
app.get("/daily", leetcode.dailyProblem);

//get the selected question
app.get("/select", leetcode.selectProblem);

//get list of problems
app.get("/problems", leetcode.problems);

//get user profile details
app.get("/:username", leetcode.userData);
app.get("/:username/badges", leetcode.userBadges);
app.get("/:username/solved", leetcode.solvedProblem);
app.get("/:username/contest", leetcode.userContest);
app.get("/:username/contest/history", leetcode.userContestHistory);
app.get("/:username/submission", leetcode.submission);
app.get("/:username/acSubmission", leetcode.acSubmission);
app.get("/:username/calendar", leetcode.calendar);

app.listen(port, () => {
  console.log(`I am listening at http://localhost:${port}`);
});
