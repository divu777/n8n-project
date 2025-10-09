import axios from "axios";
import { useState, useEffect } from "react";

interface Credential {
  id: string;
  Provider: string;
  api_key: string;
}

export const useCredentials = (userId?: string) => {
  const [apiKeys, setApiKeys] = useState<Credential[]>([]);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`/api/credentials/${userId}`)
      .then(({ data }) => data.success && setApiKeys(data.credentials));
  }, [userId]);

  return {apiKeys,setApiKeys};
};