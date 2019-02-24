import { getUserId } from './../utils/utils';

const Query = {
   async users(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        };

        if (args.query) {
            opArgs.where = {
                name_contains: args.query
            };
        }

        return prisma.query.usersConnection(opArgs, info);
    },
    async companies(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                published: true
            }
        };

        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }];
        }

        return prisma.query.companiesConnection(opArgs, info);
    },
    async myCompanies(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                creator: {
                    id: userId
                }
            }
        };

        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }];
        }


        return prisma.query.companiesConnection(opArgs, info);
    },
   async ratings(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        };

        return prisma.query.ratingsConnection(opArgs, info);
    },
    companyRatings(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                company: {
                    id: args.id
                }
            }
        }

        return prisma.query.ratingsConnection(opArgs, info);
    },
    me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        return prisma.query.user({
            where: {
                id: userId
            }
        }, info);
    },
    rating(parent, args, { prisma }, info) {
        return prisma.query.rating({
            where: {
                id: args.id
            }
        }, info);
    },
    async company(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false);

        const opArgs = {
            where: {
                id: args.id,
                OR: [{
                    published: true
                }, {
                    creator: {
                        id: userId
                    }
                }]
            }
        }

        const companies = await prisma.query.companies(opArgs, info);

        if (companies.length === 0) throw new Error("Company Not Found");

        return companies[0];

    }
};

export default Query;