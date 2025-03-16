import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import createApolloServer from './graphql'
import UserService from './services/user';

async function init() {
    const app = express();
    const PORT = Number(process.env.SERVER_PORT) || 3000;

    // Health check API
    app.get('/', (req, res) => {
        res.json({ message: "Server is working" })
    })

    app.use("/graphql", cors(), express.json(), expressMiddleware(await createApolloServer(), {
        context: async ({ req }: any) => {
            const token = req.headers['authorization']
            try {
                const user = UserService.decodeJWTToken(token as string)
                return { user };
            } catch (error) {
                console.log("err", error);
                return {}
            }
        }
    }))

    // Starting server
    app.listen(PORT, () => {
        console.log("Server started successfully on PORT", PORT)
    })
}

init()