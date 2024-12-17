import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { loadTossPayments } from "@tosspayments/payment-sdk";

function Home() {
  const [userId, setUserId] = useState("");
  const [titleId, setTitleId] = useState("");
  const [plantId, setPlantId] = useState("");
  const [user, setUser] = useState([]);
  const [titles, setTitles] = useState([]);
  const [isTitleChange, setTitleChange] = useState("");
  const [isProgressChange, setPlantChange] = useState("");
  const [shopItems, setShopItems] = useState([]);
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [itemName, setItemName] = useState("");
  const [questType, setQuestType] = useState("");
  const [quests, setQuests] = useState([]);
  const [questId, setQuestId] = useState("");
  const [questMessage, setQuestMessage] = useState("");
  const [error, setError] = useState(null);

  const { status } = useParams(); // 결제 성공 또는 실패
  const navigate = useNavigate();
  const location = useLocation();


  const hasCalledPurchase = useRef(false);

  useEffect(() => {
    if (status) {
      if (status === "success") {
        const queryParams = new URLSearchParams(location.search);
        const itemNameFromQuery = queryParams.get("itemName");

        if (!hasCalledPurchase.current && itemNameFromQuery) {
          hasCalledPurchase.current = true; // 플래그 설정
          console.log("ItemPurchase 호출", itemNameFromQuery);
          ItemPurchase(itemNameFromQuery);
        }
      } else if (status === "fail") {
        console.error("결제 실패 처리");
        setError("결제 실패");
      }

      // 3초 후 홈으로 이동
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }
  }, [status, navigate, location.search]);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  // 사용자 정보 가져오기
  const UserListButtonClick = async () => {
    if (!userId) {
      alert("User ID를 입력해주세요!");
      return;
    }
    try {
      const response = await axiosInstance.get(`/title/userList?userId=${userId}`);
      setUser(response.data);
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError("사용자 정보를 가져오는 중 오류 발생");
    }
  };

  // 칭호 리스트 가져오기
  const TitleListButtonClick = async () => {
    try {
      const response = await axiosInstance.get("/title/list");
      setTitles(response.data);
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError("칭호 리스트 요청 중 오류 발생");
    }
  };

  // 칭호 변경
  const TitleChangeButtonClick = async () => {
    if (!titleId) {
      alert("Title ID를 입력해주세요!");
      return;
    }
    try {
      const response = await axiosInstance.put(`/title/change?titleId=${titleId}`);
      setTitleChange(response.data);
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError("칭호 변경 중 오류 발생");
    }
  };

  // 칭호 달성
  const TitleProgressButtonClick = async () => {
    if (!plantId) {
      alert("Plant ID를 입력해주세요!");
      return;
    }
    try {
      const response = await axiosInstance.put(`/title/progress?plantId=${plantId}`);
      setPlantChange(response.data);
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError("칭호 달성 중 오류 발생");
    }
  };

  // 상점 아이템 리스트 가져오기
  const ShopListButtonClick = async () => {
    try {
      const response = await axiosInstance.get("/shop/list");
      setShopItems(response.data);
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError("상점 아이템 리스트 요청 중 오류 발생");
    }
  };

  // 아이템 구매 확인
  const ShopPurchaseButtonClick = async () => {
    if (!itemName) {
      alert("Item Name을 입력해주세요!");
      return;
    }
    try {
      const response = await axiosInstance.get(`/shop/check?itemName=${itemName}`);
      setPurchaseMessage(response.data);
      setError(null);
      ItemPurchase(itemName); // 구매 처리
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.data.check === "cash") {
        handlePayment(error.response.data);
      } else {
        setError(error.response?.data.message || "구매 실패");
      }
    }
  };

  // 결제 처리
  const handlePayment = (data) => {
    const orderId = btoa(new Date().getTime() + Math.random()); // 고유 주문 ID 생성
    loadTossPayments("test_ck_yL0qZ4G1VOYz6wvYM6Oo8oWb2MQY")
      .then((tossPayments) => {
        tossPayments.requestPayment("카드", {
          amount: data.price,
          orderId,
          orderName: data.itemName,
          successUrl: `http://localhost:3000/payments/success?itemName=${itemName}`,
          failUrl: "http://localhost:3000/payments/fail",
        });
      })
      .catch((error) => {
        console.error("결제 요청 실패:", error.message);
      });
  };

  // 아이템 구매
  const ItemPurchase = async (itemName) => {
    if (!itemName) {
      alert("아이템을 입력해주세요!");
      return;
    }
    try {
      const response = await axiosInstance.post(`/shop/purchase?itemName=${itemName}`);
      setPurchaseMessage(response.data);
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data || "구매 실패");
    }
  };


   // 퀘스트 리스트 요청
   const fetchQuests = async () => {
    if (!questType) {
      alert("퀘스트 타입을 입력해주세요!");
      return;
    }
    try {
      const response = await axiosInstance.get(`/quest/list?type=${questType}`);
      setQuests(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching quests:", error);
      setError("퀘스트 리스트 요청 중 오류 발생");
    }
  };

  // 퀘스트 진행 업데이트
  const updateQuestProgress = async () => {
    if (!questId) {
      alert("퀘스트 ID를 입력해주세요!");
      return;
    }
    try {
      const response = await axiosInstance.post(`/quest/progress?questId=${questId}`);
      setQuestMessage(response.data);
      setError(null);
    } catch (error) {
      console.error("Error updating quest progress:", error);
      setError("퀘스트 진행 중 오류 발생");
    }
  };

  // 퀘스트 보상 요청
  const claimQuestReward = async () => {
    if (!questId) {
      alert("퀘스트 ID를 입력해주세요!");
      return;
    }
    try {
      const response = await axiosInstance.post(`/quest/reward?questId=${questId}`);
      setQuestMessage(response.data);
      setError(null);
    } catch (error) {
      console.error("Error claiming quest reward:", error);
      setError("퀘스트 보상 요청 중 오류 발생");
    }
  };

  // 일일 퀘스트 리셋
  const resetDailyQuests = async () => {
    try {
      const response = await axiosInstance.post("/quest/reset");
      setQuestMessage(response.data);
      setError(null);
    } catch (error) {
      console.error("Error resetting daily quests:", error);
      setError("일일 퀘스트 리셋 중 오류 발생");
    }
  };


  return (
    <div>
      <h1>사용자 관리</h1>
      <input
        type="number"
        placeholder="User ID 입력"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={UserListButtonClick}>사용자 정보 요청</button>
      <code>{JSON.stringify(user)}</code>

      <h1>칭호 관리</h1>
      <button onClick={TitleListButtonClick}>칭호 리스트 요청</button>
      <code>{JSON.stringify(titles)}</code>
      <input
        type="number"
        placeholder="Title ID 입력"
        value={titleId}
        onChange={(e) => setTitleId(e.target.value)}
      />
      <button onClick={TitleChangeButtonClick}>칭호 변경</button>
      <input
        type="number"
        placeholder="Plant ID 입력"
        value={plantId}
        onChange={(e) => setPlantId(e.target.value)}
      />
      <button onClick={TitleProgressButtonClick}>칭호 달성</button>

      <h1>상점 관리</h1>
      <button onClick={ShopListButtonClick}>아이템 리스트 요청</button>
      <code>{JSON.stringify(shopItems)}</code>
      <input
        type="text"
        placeholder="Item Name 입력"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <button onClick={ShopPurchaseButtonClick}>아이템 구매</button>
      <p>{purchaseMessage}</p>

      <h1>퀘스트 관리</h1>
      <div>
        <input
          type="text"
          placeholder="퀘스트 타입 입력"
          value={questType}
          onChange={(e) => setQuestType(e.target.value)}
        />
        <button onClick={fetchQuests}>퀘스트 리스트 요청</button>
        <div>
          <strong>퀘스트 리스트:</strong> <code>{JSON.stringify(quests)}</code>
        </div>
      </div>

      <div>
        <input
          type="text"
          placeholder="퀘스트 ID 입력"
          value={questId}
          onChange={(e) => setQuestId(e.target.value)}
        />
        <button onClick={updateQuestProgress}>퀘스트 진행 업데이트</button>
        <button onClick={claimQuestReward}>퀘스트 보상 요청</button>
      </div>

      <div>
        <button onClick={resetDailyQuests}>일일 퀘스트 리셋</button>
        {questMessage && <p>{questMessage}</p>}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Home;
