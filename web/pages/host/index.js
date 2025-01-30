import { nanoid } from "nanoid";
import { useState, useEffect, useRef } from "react";
import {
  StreamVideo,
  useCallStateHooks,
  ParticipantView,
  StreamCall,
} from "@stream-io/video-react-sdk";
import { useInitVideoClient } from "@/hooks/useInitVideoClient";
import {
  TbArrowUpRight,
  TbMessageCircle2Filled,
  TbUser,
  TbExternalLink,
} from "react-icons/tb";
import { get, post } from "@/utils/fetch";
import Message from "@/components/message";
import { HostPoll, Polls } from "@/components/poll";

export default function SetupLiveStream() {
  const [callid, setCallid] = useState(nanoid(6));
  const client = useInitVideoClient({});
  const [page, setPage] = useState(0);
  const [call, setCall] = useState(null);

  if (!client) return <div>Loading...</div>;

  return (
    <StreamVideo client={client}>
      <div>
        {page == 0 ? (
          <div className="center">
            <div className="space-y-4 flex flex-col">
              <div>
                <label>Call id</label>
                <input
                  onChange={(e) => setCallid(e.target.value)}
                  value={callid}
                />
              </div>
              <button
                className="btn btn-primary w-full"
                onClick={() => {
                  if (!callid) return alert("Please enter a call id");
                  const streamCall = client.call("livestream", callid);
                  streamCall.join({ create: true });
                  setCall(streamCall);
                  setPage(1);
                }}
              >
                Enter Backstage
              </button>
            </div>
          </div>
        ) : (
          <StreamCall call={call}>
            <LivestreamView call={call} />
          </StreamCall>
        )}
      </div>
    </StreamVideo>
  );
}

const LivestreamView = ({ call }) => {
  const {
    useCameraState,
    useMicrophoneState,
    useParticipantCount,
    useIsCallLive,
    useParticipants,
  } = useCallStateHooks();

  const { camera: cam, isEnabled: isCamEnabled } = useCameraState();
  const { microphone: mic, isEnabled: isMicEnabled } = useMicrophoneState();

  const participantCount = useParticipantCount();
  const isLive = useIsCallLive();

  const [firstParticipant] = useParticipants();

  return (
    <div className="relative">
      {firstParticipant && (
        <ParticipantView
          ParticipantViewUI={<div></div>}
          className="fullscreenVideo"
          participant={firstParticipant}
        />
      )}
      <div className="absolute top-8 px-8 z-50 space-y-4 w-full">
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="space-y-1">
              <h1 className="text-white">{call?.cid}</h1>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_WEB_URL}/view/${call?.id}`
                  )
                }
                className="text-blue-500 text-sm font-semibold flex items-center gap-2"
              >
                {process.env.NEXT_PUBLIC_WEB_URL}/view/{call?.id}
                <TbExternalLink className="h-4 w-4" />
              </button>
            </div>
            <div className="text-white text-sm font-bold">
              {isLive ? `Live: ${participantCount}` : "In Backstage"}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => (isLive ? call.stopLive() : call.goLive())}
            >
              {isLive ? "Stop Live" : "Go Live"}
            </button>
            <button className="btn btn-primary" onClick={() => cam.toggle()}>
              {isCamEnabled ? "Disable camera" : "Enable camera"}
            </button>
            <button className="btn btn-primary" onClick={() => mic.toggle()}>
              {isMicEnabled ? "Mute Mic" : "Unmute Mic"}
            </button>
          </div>
        </div>
      </div>
      <CHAT_HOST callid={call?.id} />
      <HostPoll callid={call?.id} />
    </div>
  );
};

const CHAT_HOST = ({ callid }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [openInput, setOpenInput] = useState(false);
  const messagesEndRef = useRef(null);

  async function fn() {
    const rs = await get(`/room/${callid}`);
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
          role: "host",
          imageUrl: null,
          extraData: null,
          user: {
            id: "fuego",
            name: "fuego",
            logo: "https://assets.chorcha.net/MpgyXR4UsSKCvegW59n3v.png",
          },
        },
      ]);

      post(`/room/${callid}`, {
        type: "text",
        data: {
          message: inputValue,
          role: "host",
          imageUrl: null,
          extraData: null,
          user: {
            id: "fuego",
            name: "fuego",
            logo: "https://assets.chorcha.net/MpgyXR4UsSKCvegW59n3v.png",
          },
        },
      });

      setInputValue("");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 pb-4 z-50">
      <div className="flex flex-col space-y-8 h-48 overflow-y-auto scrollbar-hide">
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
