const userDetailsFetch = async (req, res, formatData, query) => {
  let userName = req.params.username;
  let limit = req.query.limit;
  await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
    },
    body: JSON.stringify({
      query: query,
      variables: {
        username: userName, //username require
        limit: limit, //only for submission
      },
    }),
  })
    .then((result) => result.json())
    .then((data) => {
      if (data.errors) {
        res.send(data);
      } else {
        res.json(formatData(data.data));
      }
    })
    .catch((err) => {
      console.error("Error", err);
      res.send(err);
    });
};

module.exports = userDetailsFetch;
