import { ApolloServer } from "@apollo/server";
import { User } from './user'

async function createApolloServer(): Promise<ApolloServer<any>> {
    
    // Create GraphQL Server
    const gqlServer = new ApolloServer<any>({
        typeDefs: `
            type Query {
                ${User.queries}
            }
            type Mutation {
                ${User.mutations},
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
            },
            Mutation: {
                ...User.resolvers.mutations
            }
        }
    })

    // Start GQL Server
    await gqlServer.start();

    return gqlServer;
}

export default createApolloServer