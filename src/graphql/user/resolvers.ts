import { prismaClient } from "../../lib/db"
import UserService, { CreateUserPayload, GetUserTokenPayload } from '../../services/user'

const queries = {
    hello: () => "{ success: true }",
    say: (_: any, {name}: {name: String}) => name,
    getUserToken: async (_: any, payload: GetUserTokenPayload) => await UserService.getUserToken(payload),
    getCurrentLoggenInUser: async (_: any, params: any, context: any) => { 
        console.log("context", context);
        const email = context.user.email
        const users = await UserService.getUserByEmail(email)
        return users
    },
}

const mutations = {
    createUser: async(_: any, payload: CreateUserPayload) => {
        const res = await UserService.createUser(payload);
        return res.id
    }
}

export const resolvers = { queries, mutations }

function getUserToken(payload: GetUserTokenPayload) {
    throw new Error("Function not implemented.");
}
