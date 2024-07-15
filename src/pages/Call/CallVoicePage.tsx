import { Box, Grid, IconButton, Typography } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";

import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useParams } from "react-router-dom";
import { getConversationByID } from "../../services";
import { useAuth, useCall, useSocket } from "../../hooks";
import { SOCKET_EVENT } from "../../constants";

interface CallVoicePageProps {}

const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const CallVoicePage: FC<CallVoicePageProps> = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const offerParam = urlParams.get("offer");
  const [offer, setOffer] = useState<any>();
  const [signaling, setSignaling] = useState(true);

  useEffect(() => {
    if (offerParam) {
      try {
        const decodedOffer = decodeURIComponent(offerParam);
        setOffer(JSON.parse(decodedOffer));
        console.log("Parsed offer:", JSON.parse(decodedOffer));
      } catch (error) {
        console.error("Error parsing offer:", error);
      }
    }
  }, [offerParam]);

  const [conversation, setConversation] = useState<any>();
  const { conversation_id, initialize_call } = useParams<string>();
  const localVideoRef = useRef<any>();
  const otherVideoRef = useRef<any>();
  const {
    conversationCalling,
    isCalling,
    setIsCalling,
    setConversationCalling,
    participants,
    setParticipants,
    localStream,
    setLocalStream,
    handleStartCall,
  } = useCall();
  const [hasStartedCall, setHasStartedCall] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState<any>(true);
  const [audioEnabled, setAudioEnabled] = useState<any>(true);
  const [callStartTime, setCallStartTime] = useState<any>(null);
  const { socket, onlineUsers } = useSocket();
  const { user } = useAuth();
  const [currentParticipants, setCurrentParticipants] = useState<any>();
  const [currentSocket, setCurrentSocket] = useState<any>(socket);
  const [isConfiged, setIsConfiged] = useState(false);
  const [peerConnections, setPeerConnections] = useState<any>({});
  const [peerConnection, setPeerConnection] = useState<any>({});
  const [otherUser, setOtherUser] = useState();

  useEffect(() => {
    if (socket) {
      setCurrentSocket(socket);

      const handleAnswerMade = async (data: any) => {
        const { answer, socketId } = data;
        // const peerConnection = peerConnections[socketId];
        if (peerConnection) {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
          setSignaling(false);
        }
      };

      const handleCandidate = async (data: any) => {
        const { candidate, socketId } = data;
        // const peerConnection = peerConnections[socketId];
        if (peerConnection) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      };

      socket.on(SOCKET_EVENT.ANSWER_MADE, handleAnswerMade);
      socket.on(SOCKET_EVENT.CANDIDATE, handleCandidate);
      socket.on(SOCKET_EVENT.END_CALL, (data: any) => {
        window.close();
      });

      socket.on(SOCKET_EVENT.IS_IN_ANOTHER_CALL, (data: any) => {
        window.alert("User is in another call");
        window.close();
      });

      window.addEventListener("beforeunload", hanldeUnload);
      return () => {
        socket.off(SOCKET_EVENT.ANSWER_MADE, handleAnswerMade);
        socket.off(SOCKET_EVENT.CANDIDATE, handleCandidate);
        socket.off(SOCKET_EVENT.END_CALL);
        socket.off(SOCKET_EVENT.IS_IN_ANOTHER_CALL);
        window.removeEventListener("beforeunload", hanldeUnload);
      };
    }
  }, [socket, peerConnection]);

  useEffect(() => {
    if (conversation_id) {
      getConversationByID(conversation_id)
        .then((result: any) => {
          setConversation(result.data);
        })
        .then(() => {
          getUserMedia();
        });
    }
  }, []);

  useEffect(() => {
    if (
      currentSocket &&
      localStream &&
      conversation &&
      initialize_call == "true"
    ) {
      handleConfigStartCall();
    }
  }, [currentSocket, initialize_call, conversation, localStream]);

  useEffect(() => {
    if (
      currentSocket &&
      localStream &&
      conversation &&
      initialize_call == "false" &&
      offer
    ) {
      handleConfigReceiveCall(conversation);
    }
  }, [currentSocket, initialize_call, conversation, localStream, offer]);

  const getUserMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    if (localVideoRef) {
      setLocalStream(stream);
      localVideoRef.current.srcObject = stream;
    }
  };

  const handleConfigStartCall = async () => {
    const currentPeerConnection = new RTCPeerConnection(ICE_SERVERS);

    currentPeerConnection.onicecandidate = (
      event: RTCPeerConnectionIceEvent
    ) => {
      if (event.candidate) {
        currentSocket?.emit(SOCKET_EVENT.CANDIDATE, {
          candidate: event.candidate,
          conversation: conversation,
        });
      }
    };

    currentPeerConnection.ontrack = (event: RTCTrackEvent) => {
      otherVideoRef.current.srcObject = event.streams[0];
    };

    localStream?.getTracks().forEach((track: any) => {
      currentPeerConnection.addTrack(track, localStream);
    });

    const offer = await currentPeerConnection.createOffer();
    await currentPeerConnection.setLocalDescription(offer);
    currentSocket?.emit(SOCKET_EVENT.START_CALL, {
      offer: offer,
      conversation: conversation,
      hasVideo: false,
    });

    setPeerConnection(currentPeerConnection);
  };

  const handleConfigReceiveCall = async (currentConversation: any) => {
    const currentPeerConnection = new RTCPeerConnection(ICE_SERVERS);
    currentPeerConnection.onicecandidate = (
      event: RTCPeerConnectionIceEvent
    ) => {
      if (event.candidate) {
        currentSocket?.emit(SOCKET_EVENT.CANDIDATE, {
          candidate: event.candidate,
          conversation: currentConversation,
        });
      }
    };

    currentPeerConnection.ontrack = (event: RTCTrackEvent) => {
      otherVideoRef.current.srcObject = event.streams[0];
    };

    localStream?.getTracks().forEach((track: any) => {
      currentPeerConnection.addTrack(track, localStream);
    });

    await currentPeerConnection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    /** create answer */
    const answer = await currentPeerConnection.createAnswer();
    await currentPeerConnection.setLocalDescription(answer);
    currentSocket?.emit(SOCKET_EVENT.MAKE_ANSWER, {
      answer,
      conversation: currentConversation,
    });

    setSignaling(false);
    setPeerConnection(currentPeerConnection);
  };

  const toggleVideo = () => {
    localStream.getVideoTracks().forEach((track: any) => {
      track.enabled = !track.enabled;
    });
    setVideoEnabled((prev: any) => !prev);
  };
  const toggleAudio = () => {
    localStream.getAudioTracks().forEach((track: any) => {
      track.enabled = !track.enabled;
    });
    setAudioEnabled((prev: any) => !prev);
  };
  const endCall = () => {
    hanldeUnload();
    window.close();
  };
  const hanldeUnload = () => {
    currentSocket.emit(SOCKET_EVENT.END_CALL, {
      conversation,
    });
    setConversationCalling(null);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "2fr 8fr 2fr",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Box sx={{ margin: "5px" }}>
        <Typography variant="subtitle1" fontSize={18} textAlign={"center"}>
          {conversation?.title}
        </Typography>
        {signaling ? (
          <Typography variant="subtitle2" fontSize={18} textAlign={"center"}>
            Calling...
          </Typography>
        ) : (
          <Typography
            variant="subtitle2"
            fontSize={18}
            color={"green"}
            textAlign={"center"}
          >
            Connected
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "auto",
        }}
      >
        <Grid
          container
          spacing={1}
          sx={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
          }}
        >
          <Grid item xs={6}>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignContent={"center"}
            >
              <img
                src={"/logo_main.png"}
                alt="default"
                style={{ width: "50%" }}
              />
            </Box>
          </Grid>

          <video
            autoPlay
            ref={otherVideoRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "none",
            }}
          />

          {/* {!participants.length && (
              <Grid item xs={6}>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignContent={"center"}
                >
                  <img
                    src={"/logo_main.png"}
                    alt="default"
                    style={{ width: "50%" }}
                  />
                </Box>
              </Grid>
            )} */}

          {/* {participants.map((participant: any, index: number) => (
            <Grid
              key={participant.id}
              item
              xs={12}
              sm={Math.min(participants.length, 2) === 1 ? 12 : 6}
              md={Math.min(participants.length, 3) === 1 ? 12 : 4}
            >
              <video
                autoPlay
                ref={(ref) => {
                  if (ref) {
                    console.log("participant.id", participant.id);
                    console.log("participant.stream", participant.stream);

                    ref.srcObject = participant.stream;
                  }
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Grid>
          ))} */}
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          alignContent: "cetner",
          width: "100%",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}></Grid>
          <Grid item xs={6} container justifyContent="center" gap={5}>
            <IconButton
              size="large"
              onClick={toggleVideo}
              color="inherit"
              disabled
            >
              {videoEnabled ? (
                <VideocamIcon fontSize="large" />
              ) : (
                <VideocamOffIcon fontSize="large" />
              )}
            </IconButton>
            <IconButton size="large" onClick={endCall} color="secondary">
              <CallEndIcon fontSize="large" />
            </IconButton>
            <IconButton size="large" onClick={toggleAudio} color="inherit">
              {audioEnabled ? (
                <MicIcon fontSize="large" />
              ) : (
                <MicOffIcon fontSize="large" />
              )}
            </IconButton>
          </Grid>
          <Grid item xs={3} container justifyContent="flex-end">
            <Box justifyContent={"center"} display={"flex"} margin={"5px"}>
              <video
                autoPlay
                muted
                ref={localVideoRef}
                style={{ width: "70%" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CallVoicePage;
