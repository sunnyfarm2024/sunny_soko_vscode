import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Friend.css";

function Friend({ onClose }) {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("list");

  useEffect(() => {
    fetchFriendList();
  }, []);

  const fetchFriendList = async () => {
    try {
      const response = await axios.get("http://localhost:8080/friend/list");
      const data = response.data;
      setFriends(data.ACCEPTED || []);
      setPendingRequests(data.PENDING || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const searchFriend = async () => {
    if (!searchQuery) return;
    try {
      const response = await axios.get(`http://localhost:8080/friend/search?userName=${searchQuery}`);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Error searching friend:", error);
    }
  };

  const sendFriendRequest = async (friendUserId) => {
    try {
      await axios.post(`http://localhost:8080/friend/pending?friendUserId=${friendUserId}`);
      alert("친구 요청을 보냈습니다.");
      setSearchResults([]);
      setSearchQuery("");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const acceptFriendRequest = async (friendUserId) => {
    try {
      await axios.post(`http://localhost:8080/friend/accept?friendUserId=${friendUserId}`);
      alert("친구 요청을 수락했습니다.");
      fetchFriendList();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const rejectFriendRequest = async (friendUserId) => {
    try {
      await axios.post(`http://localhost:8080/friend/reject?friendUserId=${friendUserId}`);
      alert("친구 요청을 거절했습니다.");
      fetchFriendList();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  return (
    <div className="friend-popup" onClick={onClose}>
      <div className="friend-content" onClick={(e) => e.stopPropagation()}>
        <h2>친구</h2>
        {currentView === "list" && (
          <>
            <table>
              <tbody>
                {friends.map((friend) => (
                  <tr key={friend.userId}>
                    <td><div className="friend-profile">{friend.profile || "□"}</div></td>
                    <td>{friend.userName}</td>
                    <td>
                      <button className="arrow-button" onClick={() => alert(`${friend.userName}의 농장으로 이동`)}>
                        →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {currentView === "add" && (
          <>
            <div className="friend-search">
              <input
                type="text"
                placeholder="친구 이름 입력"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={searchFriend}>🔍</button>
            </div>
            <table>
              <tbody>
                {searchResults.map((result) => (
                  <tr key={result.userId}>
                    <td><div className="friend-profile">{result.profile || "□"}</div></td>
                    <td>{result.userName}</td>
                    <td>
                      <button onClick={() => sendFriendRequest(result.userId)}>요청</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {currentView === "requests" && (
          <>
            <table>
              <tbody>
                {pendingRequests.map((request) => (
                  <tr key={request.userId}>
                    <td><div className="friend-profile">{request.profile || "□"}</div></td>
                    <td>{request.userName}</td>
                    <td>
                      <button onClick={() => acceptFriendRequest(request.userId)}>수락</button>
                      <button onClick={() => rejectFriendRequest(request.userId)}>거절</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div className="friend-buttons">
          <button
            className={currentView === "list" ? "active" : ""}
            onClick={() => setCurrentView("list")}
          >
            친구 목록
          </button>
          <button
            className={currentView === "add" ? "active" : ""}
            onClick={() => setCurrentView("add")}
          >
            친구 추가
          </button>
          <button
            className={currentView === "requests" ? "active" : ""}
            onClick={() => setCurrentView("requests")}
          >
            친구 요청
          </button>
        </div>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
    </div>
  );
}

export default Friend;
