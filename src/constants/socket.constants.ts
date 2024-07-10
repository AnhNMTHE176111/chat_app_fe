export const SOCKET_EVENT = {
  GET_ONLINE_USERS: "get-online-users",

  /** MESSAGE */
  READ_MESSAGE: "read-message",
  SEND_MESSAGE: "send-message",
  NEW_MESSAGE: "new-message",
  REACT_MESSAGE: "react-message",
  DELETE_MESSAGE: "delete-message",
  DELETED_MESSAGE: "deleted-message",

  /** CALL */
  JOIN_ROOM: "join-room",
  PARTICIPANT_JOINED: "participant-joined",
  PARTICIPANT_LEFT: "participant-left",
  CALL_MADE: "call-made",
  MAKE_ANSWER: "make-answer",
  ANSWER_MADE: "answer-made",
  CANDIDATE: "candidate",
  CALLING_OFFER: "calling-offer",
  CALLING_DISCONNECT: "disconnect",
  START_CALL: "start-call",
  RECEIVE_CALL: 'receive-call'
};
