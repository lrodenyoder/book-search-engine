const express = require('express');
const path = require('path');
const db = require('./config/connection');
//REMOVE
// const routes = require('./routes');
// ADD FOR GRAPHQL
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const {authMiddleware} = require('./utils/auth')


const app = express();
const PORT = process.env.PORT || 3001;
//CREATE APOLLO SERVER
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//CREATE NEW INSTANCE OF APOLLO SERVER WITH GRAPHQL DATA
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build.index.html"));
  });

  // REMOVE
  // app.use(routes);

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      //log where we can go to test GQL API
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

//async call to start server
startApolloServer(typeDefs, resolvers);