import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import  CredentialsProvider  from "next-auth/providers/credentials"
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
          console.log(credentials) 
                    console.log(req) 

          return{
            id:"2",
            name:"baby"
          }
        },
  
      }
    )
  ],
  pages:{
    signIn:"/login"
  }
}