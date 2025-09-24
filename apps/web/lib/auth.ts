import bcrypt from "bcryptjs";
import prisma from "@/app/db";
import { UserSchema } from "@repo/types";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, {
  getServerSession,
  NextAuthOptions,
  SessionStrategy,
} from "next-auth";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "divu777" },
        password: { label: "password", type: "password", placeholder: "****" },
      },
      async authorize(credentials, req) {
        //console.log(JSON.stringify(credentials));
        // console.log("=======")
        // console.log(JSON.stringify(req))

        if (!credentials || !credentials.username || !credentials.password) {
          return null;
        }

        // console.log("---");
        const { username, password } = credentials;

        const userExist = await prisma.user.findUnique({
          where: {
            username: username,
          },
        });

        if (!userExist) {
          const validInputs = UserSchema.safeParse({ username, password });

          if (!validInputs.success) {
            return null;
          }

          console.log("==");

          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(password, salt);
          console.log(hashedPassword);
          const user = await prisma.user.create({
            data: {
              username,
              password: hashedPassword,
            },
          });

          console.log(JSON.stringify(user));

          if (!user) {
            console.log("+");
            return null;
          }

          return {
            id: user.id,
            name: user.username,
          };
        } else {
          const isValid = bcrypt.compareSync(password, userExist.password);

          if (!isValid) {
            return null;
          }

          return {
            id: userExist.id,
            name: userExist.username,
          };
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      //console.log(JSON.stringify(token) + "-=========token");

      return token;
    },
    async session({ session, token }: any) {
      session.user = { id: token.id, name: token.name };

      //console.log(JSON.stringify(session) + "-=========session");
      return session;
    },
  },
};
