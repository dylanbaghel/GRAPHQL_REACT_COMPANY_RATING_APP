import { Prisma } from 'prisma-binding';

import { fragmentReplacements } from './resolvers/resolvers';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    fragmentReplacements,
    secret: process.env.PRISMA_SECRET
});

export { prisma as default };