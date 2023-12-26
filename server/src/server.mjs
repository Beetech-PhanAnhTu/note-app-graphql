import express from 'express'
import http from 'http'
import {ApolloServer} from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import { resolve } from 'path';
const app = express()

const httpServer = http.createServer(app)


const typeDefs = `#graphql

    type Folder {
        id: String,
        name: String,
        createdAt: String,
        author: Author
    }

    type Author {
        id: String,
        name: String,
        folder: [Folder]
    }


    type Query{
        folders: [Folder],
        authors: [Author]
    }
`;

const resolvers = {
    Query: {
        name: () => {
            return 'Hello'
        }
    }
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
})

await server.start();

app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server)
);

await new Promise((resolve) => httpServer.listen({port: 4000}, resolve));
console.log("🚀  Server ready at: http://localhost:4000/");


