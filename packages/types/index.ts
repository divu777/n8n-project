import z from 'zod/v4'
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
    api_key:z.string()
}
)