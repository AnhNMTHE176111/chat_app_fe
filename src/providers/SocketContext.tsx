import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "../hooks";
import { Socket, io } from "socket.io-client";
import { URI } from "../constants";

interface SocketContextType {
  socket: Socket;
  onlineUsers: any;
}

export const SocketContext = createContext<any>(null);

export const SocketContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(URI.BASE_API, {
        query: {
          id: user.id,
          email: user?.email,
        },
      });
      newSocket.on("getOnlineUsers", (data) => {
        console.log("getOnlineUsers", data);
        setOnlineUsers(data);
      });
      setSocket(newSocket);
      return () => {
        newSocket.off("getOnlineUsers");
        newSocket.close();
      };
    } else {
      if (socket) {
        return () => {
          socket.close();
          setSocket(null);
        };
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
