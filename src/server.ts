import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { prismaClient } from './lib/db';
// import prismaClient from './lib/db'

async function init() {
    const app = express();
    const PORT = Number(process.env.SERVER_PORT) || 3000;

    // Create GraphQL Server
    const gqlServer = new ApolloServer<any>({
        typeDefs: `
            type Query {
                hello: String,
                say(name: String): String
            }
            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                hello: () => "{ success: true }",
                say: (_, {name}: {name: String}) => name,
            },
            Mutation: {
                createUser: async(_, { firstName, lastName, email, password }: { lastName: string, firstName: string, email: string, password: string }) => {
                    await prismaClient.user.create({
                        data: {
                            firstName, lastName, email, password, salt: 'random'
                        }
                    })
                    return true
                }
            }
        }
    })

    // Start GQL Server
    await gqlServer.start();


    // Health check API
    app.get('/', (req, res) => {
        res.json({ message: "Server is working" })
    })
    
    app.use("/graphql", cors(), express.json(), expressMiddleware(gqlServer))

    // Starting server
    app.listen(PORT, () => {
        console.log("Server started successfully on PORT", PORT)
    })
}

init()