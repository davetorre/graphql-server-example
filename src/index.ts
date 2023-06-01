import { ApolloServer } from '@apollo/server';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';

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

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();
app.use('/graphql', cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(server));

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀  Server is now running on http://localhost:${PORT}/graphql`);
});
