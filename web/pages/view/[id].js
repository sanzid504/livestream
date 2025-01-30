import { useEffect, useRef, useState } from "react";
import {
  ParticipantView,
  StreamCall,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import { TbArrowUpRight, TbMessageCircle2Filled, TbUser } from "react-icons/tb";
import { useInitVideoClient } from "@/hooks/useInitVideoClient";
import { useRouter } from "next/router";
import { getUser } from "@/utils/getUser";
import { get, post } from "@/utils/fetch";
import Message from "@/components/message";
import { Polls } from "@/components/poll";

const WebRTCLivestream = () => {
  const router = useRouter();
  const { id: callId } = router.query;
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const client = useInitVideoClient({});

  useEffect(() => {
    async function fn() {
      const call = client.call("livestream", callId);

      call
        .join()
        .catch(setError)
        .finally(() => setLoading(false));
      setCall(call);
    }

    if (client && callId) fn();
  }, [client, callId]);

  return (
    <div className="">
      {loading ? (
        <div className="center">Loading...</div>
      ) : (
        <StreamCall call={call}>
          <MyCallUI callId={callId} />
        </StreamCall>
      )}
    </div>
  );
};

const CHAT = ({ callId, user }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const [openInput, setOpenInput] = useState(false);

  async function fn() {
    const rs = await get(`/room/${callId}`);
    setMessages(rs);
  }

  useEffect(() => {
    fn();
    const interval = setInterval(() => {
      fn();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (inputValue) {
      setMessages((prev) => [
        ...prev,
        {
          message: inputValue,
          role: "user",
          imageUrl: null,
          extraData: null,
          user,
        },
      ]);

      post(`/room/${callId}`, {
        type: "text",
        data: {
          message: inputValue,
          role: "user",
          imageUrl: null,
          extraData: null,
          user,
        },
      });

      setInputValue("");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 pb-4 z-50">
      <div className="flex flex-col space-y-8 h-48 overflow-y-auto scrollbar-hide">
        <Polls callid={callId} />
        <div className="flex flex-col space-y-4 pb-12">
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {!openInput && (
          <button
            onClick={() => setOpenInput(true)}
            className="p-2 rounded-full bg-blue-500 absolute bottom-4 right-4"
          >
            <TbMessageCircle2Filled className="h-4 w-4 text-blue-900" />
          </button>
        )}

        {openInput && (
          <div className="absolute bottom-4 right-4 left-4 py-4">
            <div className="flex items-center gap-2 w-full md:w-1/3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full"
              />
              <button
                onClick={sendMessage}
                className="p-2 rounded-full bg-blue-500"
              >
                <TbArrowUpRight className="h-4 w-4 text-blue-900" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MyCallUI = ({ callId }) => {
  const call = useCall();
  const { useCallCallingState, useParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();

  const user = getUser();

  return (
    <div className="relative">
      {participants.length > 0 ? (
        <>
          <div className="absolute top-8 px-8 z-50 space-y-4 w-full">
            <div className="flex justify-between">
              <div className="space-y-1">
                <div className="text-white font-semibold flex items-center space-x-1">
                  <TbUser className="h-4 w-4 stroke-[3.5]" />
                  <span>{participants.length}</span>
                </div>
              </div>
              <div className="text-white font-semibold">{call?.id}</div>
            </div>
          </div>
          <CHAT callId={callId} user={user} />
          <ParticipantView
            ParticipantViewUI={<div></div>}
            className="fullscreenVideo"
            participant={participants[0]}
          />
        </>
      ) : (
        <div className="center">
          <h1 className="uppercase">{callingState}</h1>
        </div>
      )}
    </div>
  );
};

export default WebRTCLivestream;
