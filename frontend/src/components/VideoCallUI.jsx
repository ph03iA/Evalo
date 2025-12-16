import {
    CallControls,
    CallingState,
    SpeakerLayout,
    useCallStateHooks,
  } from "@stream-io/video-react-sdk";
  import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
  import { useState } from "react";
  import { useNavigate } from "react-router";
  import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
  
  import "@stream-io/video-react-sdk/dist/css/styles.css";
  import "stream-chat-react/dist/css/v2/index.css";
  
  function VideoCallUI({ chatClient, channel }) {
    const navigate = useNavigate();
    const { useCallCallingState, useParticipantCount } = useCallStateHooks();
    const callingState = useCallCallingState();
    const participantCount = useParticipantCount();
    const [isChatOpen, setIsChatOpen] = useState(false);
  
    if (callingState === CallingState.JOINING) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-emerald-400 mb-4" />
            <p className="text-zinc-300">Joining call...</p>
          </div>
        </div>
      );
    }
  
    return (
      <div className="h-full flex gap-3 relative str-video">
        <div className="flex-1 flex flex-col gap-3">
          {/* Participants count badge and Chat Toggle */}
          <div className="flex items-center justify-between gap-2 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-emerald-400" />
              <span className="font-medium text-zinc-200">
                {participantCount} {participantCount === 1 ? "participant" : "participants"}
              </span>
            </div>
            {chatClient && channel && (
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isChatOpen 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                }`}
                title={isChatOpen ? "Hide chat" : "Show chat"}
              >
                <MessageSquareIcon className="w-4 h-4" />
                Chat
              </button>
            )}
          </div>
  
          <div className="flex-1 bg-zinc-950 rounded-xl overflow-hidden relative border border-zinc-800">
            <SpeakerLayout />
          </div>
  
          <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 flex justify-center">
            <CallControls onLeave={() => navigate("/dashboard")} />
          </div>
        </div>
  
        {/* CHAT SECTION */}
        {chatClient && channel && (
          <div
            className={`flex flex-col rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all duration-300 ease-in-out ${
              isChatOpen ? "w-80 opacity-100" : "w-0 opacity-0 border-0"
            }`}
          >
            {isChatOpen && (
              <>
                <div className="bg-zinc-950 p-3 border-b border-zinc-800 flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-200">Session Chat</h3>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-zinc-500 hover:text-zinc-200 transition-colors"
                    title="Close chat"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden stream-chat-dark">
                  <Chat client={chatClient} theme="str-chat__theme-dark">
                    <Channel channel={channel}>
                      <Window>
                        <MessageList />
                        <MessageInput />
                      </Window>
                      <Thread />
                    </Channel>
                  </Chat>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
  
  export default VideoCallUI;