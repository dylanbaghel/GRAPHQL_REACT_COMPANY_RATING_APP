const User = {
    password(parent, args, { prisma }, info) {
        return "Can't See";
    },
    companies: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { prisma }, info) {
            return prisma.query.companies({
                where: {
                    published: true,
                    creator: {
                        id: parent.id
                    }
                }
            }, info)
        }
    }
};

export default User;