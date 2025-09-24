import Home from "@/components/Home";
import axios from "axios";
import { headers } from "next/headers";

const page = async () => {
 const headersList = headers();
 const requestHeaders = {
      'Cookie': (await headersList).get('cookie'),
    };
  const { data } = await axios.get("http://localhost:3000/api/workflows",{
          headers: requestHeaders,

  });
  console.log(JSON.stringify(data))
    console.log(JSON.stringify(data.workflows))

  return (
    <div className="flex h-screen w-screen">
      <Home workflowsData={data.workflows} />
    </div>
  );
};

export default page;
