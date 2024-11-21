import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../Api/UserRequests";
import { Avatar } from "@mui/material";

const Conversation = ({ data, currentUser, online, lastMessage }) => {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = data.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
        console.log(data);

        dispatch({ type: "SAVE_USER", data });
      } catch (error) {
        console.log(error);
      }
    };

    if (userId) getUserData();
  }, [data.members, currentUser, dispatch]);

  return (
    <>
      <div className="follower conversation">
        <div>
          {online && <div className="online-dot"></div>}
          <Avatar
            src={userData?.avatar || "/default-avatar.png"}
            sx={{ width: 56, height: 56 }}
          />
          <div className="name" style={{ fontSize: "0.8rem" }}>
            <span>{userData?.fullname || "Unknown User"}</span>
            <span style={{ color: online ? "#51e200" : "" }}>
              {online ? "Online" : "Offline"}
            </span>
          </div>

          {lastMessage && (
            <div
              className="last-message"
              style={{ fontSize: "0.7rem", color: "#a0a0a0" }}
            >
              {lastMessage.text}
            </div>
          )}
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;