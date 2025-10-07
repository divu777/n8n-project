import { StateAnnotation } from "@repo/types"
import { ConfigurableChatModelCallOptions, initChatModel } from "langchain/chat_models/universal";

export const llm=async(state: typeof StateAnnotation.State,config?:ConfigurableChatModelCallOptions)=>{
    const modelProvider = config?.configurable!.modelProvider
    const model = config?.configurable!.model

    const messages = state.messages
    const llm = await initChatModel(model,{
        modelProvider
    })

    const response = await llm.invoke(messages)

    return {
        messages:[response]
    }
}