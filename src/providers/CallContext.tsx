import { createContext, FC, useCallback, useEffect, useState } from "react";
import { useAuth, useSocket } from "../hooks";
import { SOCKET_EVENT } from "../constants";
import { DialogCall } from "../components";
import { Socket } from "socket.io-client";

export const CallContext = createContext<any>(null);

const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const CallContextProvider: FC<{ children: any }> = ({ children }) => {
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [conversationCalling, setConversationCalling] = useState<any>();
  const [localStream, setLocalStream] = useState<MediaStream>();
  const { socket } = useSocket();
  const [currentSocket, setCurrentSocket] = useState<any>(socket);
  
  const [participants, setParticipants] = useState<any>([]);
  const { user } = useAuth();
  const [offer, setOffer] = useState<any>();

  useEffect(() => {
    if (socket) {
      setCurrentSocket(socket);

      const handleRecieveCall = async (data: any) => {
        const { offer, conversation } = data;
        setOffer(offer);
        setIsCalling(true);
        setConversationCalling(conversation);
      };
      socket.on(SOCKET_EVENT.RECEIVE_CALL, handleRecieveCall);

      return () => {
        socket.off(SOCKET_EVENT.RECEIVE_CALL, handleRecieveCall);
      };
    }
  }, [socket]);

  const handleStartCall = async (conversation: any) => {
    const callWindow = window.open(
      `/call/${conversation._id}/true`,
      // `/call/${conversation._id}&startCall=true`,
      "_blank",
      "noopener,noreferrer,width=800,height=600"
    );
    if (callWindow) {
      callWindow.opener = null;
    }
  };

  const handleRecieve = async () => {
    setIsCalling(false);
    const offerJson = JSON.stringify(offer);
    const callWindow = window.open(
      `/call/${conversationCalling._id}/false?offer=${encodeURIComponent(
        offerJson
      )}`,
      // `/call/${conversationCalling._id}&startCall=false`,
      "_blank",
      "noopener,noreferrer,width=800,height=600"
    );
    if (callWindow) {
      callWindow.opener = null;
    }
  };

  const handleReject = () => {
    setIsCalling(false);
  };

  return (
    <CallContext.Provider
      value={{
        currentSocket,
        offer,
        setOffer,
        conversationCalling,
        setConversationCalling,
        isCalling,
        setIsCalling,
        participants,
        setParticipants,
        localStream,
        setLocalStream,
        handleStartCall,
        handleReject,
        handleRecieve,
      }}
    >
      <DialogCall
        isCalling={isCalling}
        conversation={conversationCalling}
        handleReject={handleReject}
        handleRecieve={handleRecieve}
      />
      {children}
    </CallContext.Provider>
  );
};
