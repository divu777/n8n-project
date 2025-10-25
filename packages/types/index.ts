import z from 'zod'
import { Annotation, MessagesAnnotation,addMessages, messagesStateReducer, type Messages } from "@langchain/langgraph";

export const NewWorflowSchema = z.object({
    name:z.string(),
    userId:z.string(),
    status:z.enum(["ACTIVE","INACTIVE"]).default('INACTIVE'),
})


export const UserSchema = z.object({
    username: z.string().min(4).max(15),
    password:z.string()
})

export const NewCredentialsSchema = z.object({
    provider: z.enum(["OpenAI","Anthropic","Gemini"]),
    api_key:z.string(),
    name:z.string()
}
)



export const StateAnnotation = Annotation.Root({
    user_query: Annotation<string>,
    ...MessagesAnnotation.spec,

})

// const MessageSchema = z.object({
//     role:z.enum(["user","assistant","system"]),
//     content:z.string()
// })




export const NodeDataSchema = z.object({
    //api_key:z.string(),
   // provider:z.enum(['OpenAI','Anthropic','Gemini']),
    // model:z.string(),
    // messages:z.array(MessageSchema),
    workflowId:z.string(),
    nodeId:z.string(),
    type:z.enum(['MANUAL','SCHEDULER','LLM','AGENT']),
    config:z.json().optional(),
    data:z.json(),
    xCoordinate:z.number(),
    yCoordinate:z.number(),
    isTrigger:z.boolean().optional()
})