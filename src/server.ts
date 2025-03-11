import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import createApolloServer from './graphql'

async function init() {
    const app = express();
    const PORT = Number(process.env.SERVER_PORT) || 3000;

    // Health check API
    app.get('/', (req, res) => {
        res.json({ message: "Server is working" })
    })
    
    const gqlServer = await createApolloServer();
    app.use("/graphql", cors(), express.json(), expressMiddleware(gqlServer))

    // Starting server
    app.listen(PORT, () => {
        console.log("Server started successfully on PORT", PORT)
    })
}

init()