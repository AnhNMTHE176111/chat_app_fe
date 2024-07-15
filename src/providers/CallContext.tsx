import { createContext, FC, useCallback, useEffect, useState } from "react";
import { useAuth, useSocket } from "../hooks";
import { CALL_TYPE, SOCKET_EVENT } from "../constants";
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
  const [hasVideo, setHasVideo] = useState();

  useEffect(() => {
    if (socket) {
      setCurrentSocket(socket);

      const handleReceiveCall = async (data: any) => {
        const { offer, conversation, hasVideo } = data;
        setHasVideo(hasVideo);
        if (!conversationCalling) {
          setOffer(offer);
          setIsCalling(true);
          setConversationCalling(conversation);
        } else {
          socket.emit(SOCKET_EVENT.IS_IN_ANOTHER_CALL, {
            conversation: conversation,
          });
          setIsCalling(false);
          setConversationCalling(null);
        }
      };

      const handleAlreadyMadeAnswer = async (data: any) => {
        const { offer, conversation, hasVideo } = data;
        setHasVideo(hasVideo);
        setIsCalling(false);
      };

      socket.on(SOCKET_EVENT.RECEIVE_CALL, handleReceiveCall);
      socket.on(SOCKET_EVENT.ALREADY_MADE_ANSWER, handleAlreadyMadeAnswer);
      socket.on(SOCKET_EVENT.END_CALL, (data: any) => {
        const { conversation } = data;
        setIsCalling(false);
        setConversationCalling(null);
      });

      return () => {
        socket.off(SOCKET_EVENT.RECEIVE_CALL, handleReceiveCall);
        socket.off(SOCKET_EVENT.ALREADY_MADE_ANSWER, handleAlreadyMadeAnswer);
        socket.off(SOCKET_EVENT.END_CALL);
      };
    }
  }, [socket]);

  const handleStartCall = async (conversation: any, type: string) => {
    if (conversationCalling) {
      alert("You are calling now.");
      return;
    }
    if (conversation && conversation._id) {
      setConversationCalling(conversation);
      const uri =
        type == CALL_TYPE.VIDEO
          ? `/call-video/${conversation._id}/true?has_video=true`
          : `/call-voice/${conversation._id}/true?has_video=false`;
      const callWindow = window.open(
        uri,
        "_blank",
        "noopener,noreferrer,width=800,height=600"
      );
      if (callWindow) {
        callWindow.opener = null;
      }
    }
  };

  const handleRecieve = async () => {
    setIsCalling(false);
    if (offer && conversationCalling && conversationCalling._id) {
      const offerJson = JSON.stringify(offer);
      const uri = hasVideo
        ? `/call-video/${
            conversationCalling._id
          }/false?&offer=${encodeURIComponent(offerJson)}`
        : `/call-voice/${
            conversationCalling._id
          }/false?&offer=${encodeURIComponent(offerJson)}`;
      const callWindow = window.open(
        uri,
        "_blank",
        "noopener,noreferrer,width=800,height=600"
      );
      if (callWindow) {
        callWindow.opener = null;
      }
    }
  };

  const handleReject = () => {
    setIsCalling(false);
    currentSocket.emit(SOCKET_EVENT.END_CALL, {
      conversation: conversationCalling,
    });
    setConversationCalling(null);
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
