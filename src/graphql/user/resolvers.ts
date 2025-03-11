import { prismaClient } from "../../lib/db"

const queries = {
    hello: () => "{ success: true }",
    say: (_: any, {name}: {name: String}) => name,
}

const mutations = {
    createUser: async(_: any, { firstName, lastName, email, password }: { lastName: string, firstName: string, email: string, password: string }) => {
        await prismaClient.user.create({
            data: {
                firstName, lastName, email, password, salt: 'random'
            }
        })
        return true
    },
}

export const resolvers = { queries, mutations }