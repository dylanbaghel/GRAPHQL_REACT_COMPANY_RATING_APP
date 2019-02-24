import '@babel/polyfill/noConflict';
import { GraphQLServer } from 'graphql-yoga';

import { resolvers } from './resolvers/resolvers';
import prisma from './prisma';

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context(request) {
        return {
            request,
            prisma
        };
    }
});

server.start({ port: process.env.PORT || 4200 }, () => {
    console.log('Server Up At Port 4200');
});