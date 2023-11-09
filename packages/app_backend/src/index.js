const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    hello1: String
    hello2(name: String!): String!
    users: [User]
  }
`;

const users = [
  { id: '1', name: 'John Doe', email: 'john@test.com' },
  { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
];

const resolvers = {
  Query: {
    hello1: () => 'Hello World',
    hello2: (parent, args) => {
      console.log({ parent, args });
      return `Hello World2, ${args.name}`;
    },
    users: () => users,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
