const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');

const getUsers = async () => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users');
  return response.data;
};

const getUser = async (id) => {
  const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
  return response.data;
};

const getPosts = async () => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
  return response.data;
};

const getPost = async (id) => {
  const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
  return response.data;
};

let todos = [
  { id: '1', title: 'Todo 1-1', isCompleted: false, userId: 1 },
  { id: '2', title: 'Todo 1-2', isCompleted: false, userId: 1 },
  { id: '3', title: 'Todo 1-3', isCompleted: false, userId: 1 },
  { id: '4', title: 'Todo 2-1', isCompleted: false, userId: 2 },
  { id: '5', title: 'Todo 2-2', isCompleted: false, userId: 2 },
  { id: '6', title: 'Todo 2-3', isCompleted: false, userId: 2 },
  { id: '7', title: 'Todo 2-4', isCompleted: false, userId: 2 },
  { id: '8', title: 'Todo 2-5', isCompleted: false, userId: 2 },
  { id: '9', title: 'Todo 3-1', isCompleted: false, userId: 3 },
  { id: '10', title: 'Todo 3-2', isCompleted: false, userId: 3 },
  { id: '11', title: 'Todo 3-3', isCompleted: false, userId: 3 },
  { id: '12', title: 'Todo 3-4', isCompleted: false, userId: 3 },
];

const getTodos = () => todos;

const getTodo = (id) => todos.find((todo) => todo.id === id);

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    myPosts: [Post]
    myTodos: [Todo]
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    userId: ID!
  }

  type Todo {
    id: ID!
    title: String!
    isCompleted: Boolean!
    userId: ID!
  }

  type Query {
    test1: String
    test2(name: String!): String!
    users: [User]
    user(id: String!): User
    posts: [Post]
    post(id: String!): Post
    todos: [Todo]
    todo(id: String!): Todo
  }

  type Mutation {
    createTodo(title: String!, userId: ID!): Todo
    deleteTodo(id: ID!): Todo
  }
`;

const resolvers = {
  Query: {
    test1: () => 'Hello World',
    test2: (parent, args) => {
      console.log({ parent, args });
      return `Hello World2, ${args.name}`;
    },
    users: async () => {
      const users = await getUsers();
      const posts = await getPosts();
      return users.map((user) =>
        Object.assign({}, user, {
          myPosts: posts.filter((post) => post.userId === user.id),
          myTodos: todos.filter((todo) => todo.userId === user.id),
        }),
      );
    },
    user: async (_, args) => {
      const user = await getUser(args.id);
      const posts = await getPosts();
      return Object.assign({}, user, {
        myPosts: posts.filter((post) => post.userId === user.id),
        myTodos: todos.filter((todo) => todo.userId === user.id),
      });
    },
    posts: async () => await getPosts(),
    post: async (_, args) => await getPost(args.id),
    todos: () => getTodos(),
    todo: (_, args) => getTodo(args.id),
  },

  Mutation: {
    createTodo: (_, args) => {
      const maxId = Math.max.apply(
        null,
        todos.map((todo) => todo.id),
      );
      const todo = { id: maxId + 1, title: args.title, isCompleted: false, userId: args.userId };
      todos.push(todo);
      return todo;
    },
    deleteTodo: (_, args) => {
      const todo = todos.find((todo) => todo.id === args.id);
      todos = todos.filter((todo) => todo.id !== args.id);
      return todo;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
