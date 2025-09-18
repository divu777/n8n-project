import Home from "@/components/Home";
import axios from "axios";

const page = async () => {
  const { data } = await axios.get("http://localhost:3000/api/workflows");

  return (
    <div className="flex h-screen w-screen">
      <Home workflowsData={data.data} />
    </div>
  );
};

export default page;
