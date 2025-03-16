import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from 'node:crypto'
import JWT from 'jsonwebtoken';

 export interface CreateUserPayload {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface GetUserTokenPayload {
    email: string
    password: string
}

class UserService {
    public static createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;
        const salt = randomBytes(16).toString('hex');
        const hashedPassword = this.generateHashedPassword(salt, password);
        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                salt
            }
        })
    }

    public static getUserByEmail(email: string) {
        return prismaClient.user.findUnique({ where: { email }})
    }

    private static generateHashedPassword(salt: string, password: string) {
        return createHmac('SHA256', salt).update(password).digest('hex');
    }

    public static async getUserToken(payload: GetUserTokenPayload) {
        const { email, password } = payload
        const user = await this.getUserByEmail(email);
        if (!user) throw Error("Invalid user")
        
        const userHashedPassword = this.generateHashedPassword(user.salt, password)

        if (user.password !== userHashedPassword) throw Error("Incorrect password")

        const userToSign = { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
        const token = JWT.sign(userToSign, process.env.JWT_SECRET!, { expiresIn: 60 * 60 })
        return token;
    }

    public static decodeJWTToken(token: string) {
        return JWT.verify(token, process.env.JWT_SECRET!);
    }
}

export default UserService;