import {
    isEmail
} from 'validator';
import bcrypt from 'bcryptjs';

import { generateAuthToken, getUserId } from './../utils/utils';

const Mutation = {
    async createUser(parent, args, {
        prisma
    }, info) {
        if (args.data.password.length < 8) {
            throw new Error("Password Must Be 8 Characters Long");
        }
        if (!isEmail(args.data.email)) {
            throw new Error("Email is Invalid");
        }

        const userExist = await prisma.exists.User({
            email: args.data.email
        });
        
        if (userExist) {
            throw new Error("User With This Email is Already Registered");
        }

        const hashedPassword = await bcrypt.hash(args.data.password, 10);

        const newUser = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password: hashedPassword
            }
        });

        return {
            user: newUser,
            token: generateAuthToken(newUser.id)
        }
    },
    async login(parent, args, { prisma }, info) {
        if (!isEmail(args.data.email)) {
            throw new Error("Invalid Email");
        }

        const foundUser = await prisma.query.user({
            where: {
                email: args.data.email
            }
        });

        if (!foundUser) {
            throw new Error("User is Not Registered With This Email");
        }

        const isMatch = await bcrypt.compare(args.data.password, foundUser.password);

        if (!isMatch) {
            throw new Error("Password Incorrect");
        }

        return {
            user: foundUser,
            token: generateAuthToken(foundUser.id)
        };
    },
    updateUser(parent, args, {
        prisma, request
    }, info) {
        const userId = getUserId(request);
        if (typeof args.data.email === 'string') {
            if (!isEmail(args.data.email)) {
                throw new Error("Invalid Email");
            }
        }

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info);
    },
    deleteUser(parent, args, {
        prisma, request
    }, info) {
        const userId = getUserId(request);
        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info);
    },
    async createCompany(parent, args, {
        prisma, request
    }, info) {
        const userId = getUserId(request);

        const userExist = await prisma.exists.User({
            id: userId
        });
        if (!userExist) {
            throw new Error("Unable To Create Company. Not Found User");
        }

        return prisma.mutation.createCompany({
            data: {
                ...args.data,
                services: {
                    set: args.data.services
                },
                creator: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info);
    },
    async updateCompany(parent, args, {
        prisma, request
    }, info) {
        const userId = getUserId(request);

        const companyExist = await prisma.exists.Company({
            id: args.id,
            creator: {
                id: userId
            }
        });
        if (!companyExist) {
            throw new Error("Unable To Update Company, Not Found Company");
        }

        const isPublished = await prisma.exists.Company({
            id: args.id,
            published: true
        });

        if (isPublished && args.data.published === false) {
            await prisma.mutation.deleteManyRatings({
                where: {
                    company: {
                        id: args.id
                    }
                }
            });
        }

        return prisma.mutation.updateCompany({
            where: {
                id: args.id
            },
            data: {
                ...args.data,
                services: {
                    set: args.data.services
                }
            }
        }, info);
    },
    async deleteCompany(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        const companyExist = await prisma.exists.Company({
            id: args.id,
            creator: {
                id: userId
            }
        });

        if (!companyExist) {
            throw new Error("Unable To Delete Company, Not Found!");
        }

        return prisma.mutation.deleteCompany({
            where: {
                id: args.id
            }
        }, info);
    },
    async createRating(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        const userExist = await prisma.exists.User({
            id: userId
        });
        if (!userExist) {
            throw new Error("Cannot Create Rating!, Not Found User");
        }
        const companyExist = await prisma.exists.Company({
            id: args.data.company,
            published: true
        });
        if (!companyExist) {
            throw new Error("Cannot Create Rating!, Not Found Company");
        }

        return prisma.mutation.createRating({
            data: {
                ...args.data,
                creator: {
                    connect: {
                        id: userId
                    }
                },
                company: {
                    connect: {
                        id: args.data.company
                    }
                }
            }
        }, info);
    },
    async updateRating(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        const ratingExist = await prisma.exists.Rating({
            id: args.id,
            creator: {
                id: userId
            }
        });
        if (!ratingExist) {
            throw new Error("Unable To Update Rating, Not Found");
        }
        
        return prisma.mutation.updateRating({
            where: {
                id: args.id
            },
            data: args.data
        });
    },
    async deleteRating(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        const ratingExist = await prisma.exists.Rating({
            id: args.id,
            creator: {
                id: userId
            }
        });

        if (!ratingExist) {
            throw new Error("Unable To Delete Rating, Not Found!");
        }

        return prisma.mutation.deleteRating({
            where: {
                id: args.id
            }
        });
    },
    async deleteManyRatings(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        const companyExist = await prisma.exists.Company({
            id: args.company,
            creator: {
                id: userId
            }
        });

        if (!companyExist) {
            throw new Error("Unable To Delete Many Ratings, Not Your Company");
        }

        return prisma.mutation.deleteManyRatings({
            where: {
                company: {
                    id: args.company
                }
            }
        }, info);
    }
 };

export default Mutation;