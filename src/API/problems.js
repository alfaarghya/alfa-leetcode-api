const problemsFetch = async (req, res, formatData, query) => {
  let limit = req.query.limit;
  let tags = req.query.tags;
  await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
    },
    body: JSON.stringify({
      query: query,
      variables: {
        categorySlug: "",
        skip: 0,
        limit: limit ? limit : 20, //by default get 20 question
        filters: { tags: tags ? tags.split(" ") : " " }, //filter by tags
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

module.exports = problemsFetch;
