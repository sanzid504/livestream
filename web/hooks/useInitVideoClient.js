import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useMemo, useState } from "react";
import { getUser } from "../utils/getUser";
import { getURLCredentials } from "../utils/getURLCredentials";
import { useRouter } from "next/router";
import { DEFAULT_CALL_TYPE } from "../utils/constants";

const envApiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const tokenProviderUrl =
  process.env.NEXT_PUBLIC_TOKEN_PROVIDER_URL ||
  "http://localhost:3002/api/tokenProvider";

export const useInitVideoClient = ({ isAnon }) => {
  const router = useRouter();
  const { callId } = router.query;
  const { api_key, token, type } = getURLCredentials();
  const user = useMemo(() => {
    if (isAnon) {
      return { id: "!anon" };
    }
    return getUser();
  }, [isAnon]);

  const apiKey = api_key ?? envApiKey;

  const [client, setClient] = useState(undefined);

  useEffect(() => {
    const tokenProvider = async () => {
      const endpoint = new URL(tokenProviderUrl);
      endpoint.searchParams.set("api_key", apiKey);
      endpoint.searchParams.set("user_id", isAnon ? "!anon" : user.id);

      if (isAnon) {
        endpoint.searchParams.set(
          "call_cids",
          `${type ?? DEFAULT_CALL_TYPE}:${callId}`
        );
      }
      const response = await fetch(endpoint).then((res) => res.json());
      return response.token;
    };

    const _client = new StreamVideoClient({
      apiKey,
      ...((isAnon || !token) && { tokenProvider }),
      ...(!isAnon && { token }),
      user: isAnon ? { type: "anonymous" } : user,
    });

    // const client = useCreateChatClient({
    //   apiKey,
    //   tokenOrProvider: userToken,
    //   ...((isAnon || !token) && { tokenProvider }),
    //   ...(!isAnon && { token }),
    //   user: isAnon ? { type: "anonymous" } : user,
    // });

    setClient(_client);

    return () => {
      _client
        .disconnectUser()
        .catch((error) => console.error(`Unable to disconnect user`, error));
      setClient(undefined);
    };
  }, [apiKey, callId, isAnon, token, type, user]);

  return client;
};
