import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { typeDefs } from './schema';
import { resolvers, setupPresencePublishing } from './resolvers';
import { matrixService } from './services/matrixService';

async function startServer() {
  const PORT = parseInt(process.env.PORT ?? '4000', 10);
  const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';

  // Build executable schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Create Express app and HTTP server
  const app = express();
  const httpServer = createServer(app);

  // WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  const serverCleanup = useServer({ schema }, wsServer);

  // Apollo Server
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
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

  // Middleware
  app.use(
    cors({
      origin: CLIENT_URL,
      credentials: true,
    })
  );
  app.use(bodyParser.json());
  app.use(express.json());

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // GraphQL endpoint
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({
        userId: req.headers['x-user-id'] ?? 'anonymous',
      }),
    })
  );

  // Initialize Matrix service
  await matrixService.initialize();
  matrixService.startPresencePolling();
  setupPresencePublishing();

  // Start listening
  httpServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
    console.log(`WebSocket subscriptions at ws://localhost:${PORT}/graphql`);
    console.log(`Health check at http://localhost:${PORT}/health`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
