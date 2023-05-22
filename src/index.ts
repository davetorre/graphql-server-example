import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  # Comment
  type Book {
    id: String!
    title: String!
    author: String!
  }

  type Query {
    books: [Book!]!
    book(id: String!): Book
  }

  type Mutation {
    addBook(title: String, author: String): Book
  }
`;

interface NewBook {
  title: string;
  author: string;
}

interface Book extends NewBook {
  id: string;
}

const books: Book[] = [
  { id: '1', title: 'The Awakening', author: 'Kate Chopin' },
  { id: '2', title: 'City of Glass', author: 'Paul Auster' }
];

const resolvers = {
  Query: {
    books: () => books,
    book: (_: any, data: { id: string }) => {
      return books.find((b) => b.id === data.id)
    }
  },
  Mutation: {
    addBook: (_: any, book: NewBook) => {
      books.push({ ...book, id: (books.length + 1).toString() })
      return book;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);