//GraphQL Queries
const userProfileQuery = require("./src/GraphqlQuery/userProfile");
const contestQuery = require("./src/GraphqlQuery/contest");
const dailyQuery = require("./src/GraphqlQuery/dailyProblem");
const selectProblemQuery = require("./src/GraphqlQuery/selectProblem");
const submissionQuery = require("./src/GraphqlQuery/recentSubmit");
const AcSubmissionQuery = require("./src/GraphqlQuery/recentAcSubmit");
const problemsQuery = require("./src/GraphqlQuery/problemList");

//API Fetch
const userDetailsFetch = require("./src/API/userDetails");
const problemFetch = require("./src/API/problem");
const problemsFetch = require("./src/API/problems");

//Format requested data
const userData = require("./src/FormatData/userData");
const problemData = require("./src/FormatData/problemData");

//User Details
exports.userData = (req, res) => {
  userDetailsFetch(req, res, userData.formatUserData, userProfileQuery);
};
exports.userBadges = (req, res) => {
  userDetailsFetch(req, res, userData.formatBadgesData, userProfileQuery);
};
exports.userContest = (req, res) => {
  userDetailsFetch(req, res, userData.formatContestData, contestQuery);
};
exports.userContestHistory = (req, res) => {
  userDetailsFetch(req, res, userData.formatContestHistoryData, contestQuery);
};
exports.solvedProblem = (req, res) => {
  userDetailsFetch(
    req,
    res,
    userData.formatSolvedProblemsData,
    userProfileQuery
  );
};
exports.submission = (req, res) => {
  userDetailsFetch(req, res, userData.formatSubmissionData, submissionQuery);
};
exports.acSubmission = (req, res) => {
  userDetailsFetch(req, res, userData.formatAcSubmissionData, AcSubmissionQuery);
};
exports.calendar = (req, res) => {
  userDetailsFetch(
    req,
    res,
    userData.formatSubmissionCalendarData,
    userProfileQuery
  );
};

//Problems Details
exports.dailyProblem = (req, res) => {
  problemFetch(res, problemData.formatDailyData, dailyQuery, null);
};
exports.selectProblem = (req, res) => {
  let title = req.query.titleSlug;
  if (title !== undefined) {
    problemFetch(
      res,
      problemData.formatQuestionData,
      selectProblemQuery,
      title
    );
  } else {
    res.status(400).json({
      error: "Missing or invalid query parameter: titleSlug",
      solution: "put query after select",
      example: "localhost:3000/select?titleSlug=two-sum",
    });
  }
};
exports.problems = (req, res) => {
  problemsFetch(req, res, problemData.formatProblemsData, problemsQuery);
};
