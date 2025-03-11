import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';

async function init() {
    const app = express();
    const PORT = 3000;

    // Create GraphQL Server
    const gqlServer = new ApolloServer<any>({
        typeDefs: `
            type Query {
                hello: String,
                say(name: String): String
            }
        `,
        resolvers: {
            Query: {
                hello: () => "{ success: true }",
                say: (_, {name}: {name: String}) => name,
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