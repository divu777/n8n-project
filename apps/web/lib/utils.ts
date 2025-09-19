import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import  CredentialsProvider  from "next-auth/providers/credentials"
import { UserSchema } from "@repo/types"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import prisma from "@/app/db"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const authOptions = {
  providers:[
    CredentialsProvider(
      {
        name:'Credentials',
        credentials:{
          username:{label:"username",type:"text",placeholder:"divu777"},
          password:{label:"password",type:"password",placeholder:"****"}
        },
        async authorize(credentials,req){

          // console.log(JSON.stringify(credentials))
          // console.log("=======")
          // console.log(JSON.stringify(req))

          if(!credentials || !credentials.username || !credentials.password){
            return null
          }
          

          const {username,password} = credentials

          const validInputs = UserSchema.safeParse({username,password})

          if(!validInputs.success){
            return null
          }

          const salt = bcrypt.genSaltSync(10)
          const hashedPassword = bcrypt.hashSync(password,salt)

          const user = await prisma.user.create({
            data:{
              username,
              password: hashedPassword
            }
          }
          )

          if(!user){
            return null
          }

          return{
            id:user.id,
            name:user.username
          }
        },
  
      }
    )
  ],
  secret:process.env.NEXTAUTH_SECRET,
  session:{
    strategy:'jwt',
    maxAge:30*24*60*60
  },
  callbacks:{
    async jwt({token,user}:any){
      // first timeer
      if(user){
        token.id=user.id,
        token.name=user.name
      }
    },
    async session({session,token}:any){
      if(token){
        session.id=token.id,
        session.name=token.name
      }
      return token
    },
  },
  pages:{
    signIn:"/login"
  }
}