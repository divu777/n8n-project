import prisma from '@/app/db';
import { Edge, Node } from '@prisma/client';
import crypto from 'crypto'
import { initChatModel } from 'langchain/chat_models/universal';
import { success } from 'zod';
const algo = 'aes-256-gcm'
const SECRET_KEY = crypto.scryptSync(process.env.SECRET_KEY!,'salt',32)
const IV = crypto.randomBytes(16);



export function encrypt(text: string) {
  const cipher = crypto.createCipheriv(algo, SECRET_KEY, IV);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${IV.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(encryptedData: string) {
  const [ivHex, tagHex, encryptedHex] = encryptedData.split(":");
  const decipher = crypto.createDecipheriv(algo, SECRET_KEY, Buffer.from(ivHex!, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex!, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex!, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}


export async function executeNode(node:Node){
 // console.log("here")
 // console.log(JSON.stringify(node))
  const nodeType = node.type

  let resultObj

  switch(nodeType){
    case 'LLM':
      resultObj = await executeLLM(node)
      break

    case 'MANUAL':
      resultObj = {
        message:"Manual executed",
        success:true
      }
      break

    default:
      resultObj={
        message:"Error in creating result. No node type matching",
        success:false
      }
      break
  }

return resultObj
  
}

export const runExecution = async(nodes:Node[],edges:Edge[])=>{
  //console.log("runnn")
  const nodeMap = new Map(nodes.map((n)=>[n.nodeId,n]))

  //console.log(JSON.stringify(nodeMap)+"--------map")
  const adjacent = new Map<string,string[]>();

  edges.forEach((edge)=>{
    if(!nodeMap.has(edge.sourceId) || !nodeMap.has(edge.targetId)) return 
    if(!adjacent.has(edge.sourceId)) adjacent.set(edge.sourceId,[])
    adjacent.get(edge.sourceId)!.push(edge.targetId)
  })
const triggernodes = nodes.filter((nodes)=>nodes.isTrigger==true)
  const visited = new Set<string>()

  const results:Record<string,any> = { }

  async function dfs(nodeId:string,paths:Set<string>){
   // console.log("dfs")
  if(paths.has(nodeId)) return 
  if(visited.has(nodeId)) return 


 // console.log("insidee")
  paths.add(nodeId)
  visited.add(nodeId)

 // console.log(JSON.stringify(nodeMap)+"node map")

  const node = nodeMap.get(nodeId)!
  results[nodeId]=await executeNode(node)

  const children = adjacent.get(nodeId) || []

  for(const childID of children){
    await dfs(childID,paths)
  }

  paths.delete(nodeId)
}
//console.log(JSON.stringify(triggernodes)+"------>trigger")

for(const triggernode of triggernodes){
  await dfs(triggernode.nodeId,new Set())
}

return results
  
}

export const runExecutionstreamable = async(nodes:Node[],edges:Edge[],send:(data: any) => void)=>{
  const nodeMap = new Map(nodes.map((n)=>[n.nodeId,n]))
  const adjacent = new Map<string,string[]>();

  edges.forEach((edge)=>{
    if(!nodeMap.has(edge.sourceId) || !nodeMap.has(edge.targetId)) return 
    if(!adjacent.has(edge.sourceId)) adjacent.set(edge.sourceId,[])
    adjacent.get(edge.sourceId)!.push(edge.targetId)
  })
const triggernodes = nodes.filter((nodes)=>nodes.isTrigger==true)
  const visited = new Set<string>()


  async function dfs(nodeId:string,paths:Set<string>){
   // console.log("dfs")
  if(paths.has(nodeId)) return 
  if(visited.has(nodeId)) return 


  //console.log("insidee")
  paths.add(nodeId)
  visited.add(nodeId)

  //console.log(JSON.stringify(nodeMap)+"node map")

  const node = nodeMap.get(nodeId)!
   send({ event: "start-node", nodeId, type: node.type });

  const result=await executeNode(node)
    send({ event: "node-result", nodeId, result });

  const children = adjacent.get(nodeId) || []

  for(const childID of children){
    await dfs(childID,paths)
  }

  paths.delete(nodeId)
}
//console.log(JSON.stringify(triggernodes)+"------>trigger")

for(const triggernode of triggernodes){
  await dfs(triggernode.nodeId,new Set())
}

  
}


export const executeLLM=async(node:Node) =>{
  //console.log("execute lllm")
  const config = node.config! as any
  const result = await callLLM(config)
  return result

}

export const callLLM=async(config:{
  messages:string[],
  model:string,
  api_key_id:string
})=>{
  try {
    const credentials = await prisma.credentials.findUnique({
      where:{
        id:config.api_key_id
      }
    })
  
    if(!credentials){
  
      return{
        message:"Error credentials provided does not exist. Change LLM config and re-run",
        success:false
      }
    }
    const apiKey = decrypt(credentials.apiKey)
    //console.log(process.env.OPENAI_API_KEY+"----->api key")
    const llm = await initChatModel(config.model,{
      modelProvider:(credentials.Provider).toLowerCase(),
      configurableFields:['apiKey']
    })
  
    const response = await llm.invoke(config.messages,{
      configurable:{
        apiKey
      }
    })
  
   // console.log("response-----"+JSON.stringify(response))
  
    return {
      message:[response],
      success:true
    }
  } catch (error:any) {
    console.log("Error in using LLM node, "+error);

     if (error && error.status === 401) {
    return {
      message: error.error.message,
      success: false
    };
  }

  //console.log(JSON.stringify(error)+"---->log")

  // If the error is a string or contains the 401 message inside
  if (typeof error === "string" && error.includes("401")) {
    return {
      message: "Authentication failed (401): Invalid API key provided. Please check your configuration.",
      success: false
    };
  }
    return{
      message:"Error in Executing LLM node, please re-configure the node. If it continues contact the dev and let him know.",
      success:false
    }
  }
}