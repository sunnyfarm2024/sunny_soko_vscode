import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Quest.css";

function Quest({ type, onClose }) {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/quest/list?type=${type}`);
        setQuests(response.data);
      } catch (error) {
        console.error("Error fetching quests:", error);
      }
    };

    fetchQuests();
  }, [type]);

  const claimReward = async (questId) => {
    try {
      const response = await axios.post(`http://localhost:8080/quest/reward?questId=${questId}`);
      alert(response.data);
      setQuests((prevQuests) =>
        prevQuests.map((quest) =>
          quest.questId === questId ? { ...quest, completed: true } : quest
        )
      );
    } catch (error) {
      console.error("Error claiming reward:", error);
      alert("보상 수령에 실패했습니다.");
    }
  };

  return (
    <div className="quest-popup" onClick={onClose}>
      <div className="quest-content" onClick={(e) => e.stopPropagation()}>
        <table>
          <tbody>
            {quests.map((quest) => (
              <tr key={quest.questId}>
                <td>{quest.questDescription}</td>
                <td>{quest.reward}</td>
                <td>
                  {quest.completed ? (
                    "✓"
                  ) : quest.questProgress >= quest.questRequirement ? (
                    <button onClick={() => claimReward(quest.questId)}>받기</button>
                  ) : (
                    `${quest.questProgress}/${quest.questRequirement}`
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Quest;
