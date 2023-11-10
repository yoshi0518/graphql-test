import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  url: 'http://localhost:4000',
  cache: new InMemoryCache(),
});

const App = () => {
  client
    .query({
      query: gql`
        query Users {
          users {
            id
            name
            email
          }
        }
      `,
    })
    .then((result) => console.log({ result }));

  return <>app_xx</>;
};

export default App;
