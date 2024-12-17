import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Quest from "../Quest/Quest";
import Friend from "../Friend/Friend";
import PlantBook from "../PlantBook/PlantBook";
import "./Main.css";

function Main() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [questType, setQuestType] = useState("");
  const [isFriendPopupOpen, setIsFriendPopupOpen] = useState(false);
  const [isPlantBookOpen, setIsPlantBookOpen] = useState(false);

  const navigate = useNavigate();

  const goToShop = () => {
    navigate("/shop");
  };

  const openQuestPopup = (type) => {
    setQuestType(type);
    setIsPopupOpen(true);
  };

  const closeQuestPopup = () => {
    setIsPopupOpen(false);
  };

  const openFriendPopup = () => {
    setIsFriendPopupOpen(true);
  };

  const closeFriendPopup = () => {
    setIsFriendPopupOpen(false);
  };

  const openPlantBook = () => {
    setIsPlantBookOpen(true);
  };

  const closePlantBook = () => {
    setIsPlantBookOpen(false);
  };

  return (
    <div className="main-container">
      <button className="button shop" onClick={goToShop}>상점</button>
      <button className="button help" onClick={openPlantBook}>도감</button>
      <button className="button daily" onClick={() => openQuestPopup("daily")}>
        일일
      </button>
      <button className="button quest" onClick={() => openQuestPopup("longterm")}>
        장기
      </button>
      <button className="button friend" onClick={openFriendPopup}>친구</button>

      {isPopupOpen && <Quest type={questType} onClose={closeQuestPopup} />}
      {isFriendPopupOpen && <Friend onClose={closeFriendPopup} />}
      {isPlantBookOpen && <PlantBook onClose={closePlantBook} />}
    </div>
  );
}

export default Main;
