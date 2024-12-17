import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import axios from "axios";
import "./Shop.css";

function Shop() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState(null);
  const { status } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const hasCalledPurchase = useRef(false);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  useEffect(() => {
    axiosInstance
      .get("/shop/list")
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  useEffect(() => {
    if (status) {
      if (status === "success") {
        const queryParams = new URLSearchParams(location.search);
        const itemNameFromQuery = queryParams.get("itemName");

        if (!hasCalledPurchase.current && itemNameFromQuery) {
          hasCalledPurchase.current = true;
          console.log("ItemPurchase 호출", itemNameFromQuery);
          ItemPurchase(itemNameFromQuery);
        }
      } else if (status === "fail") {
        console.error("결제 실패 처리");
      }

      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, navigate, location.search]);

  const filterItems = (category) => {
    setCategory(category);
  };

  const filteredItems =
    category === "ALL" ? items : items.filter((item) => item.itemCategory === category);

  const goToMain = () => {
    navigate("/");
  };

  const openPopup = (item) => {
    setSelectedItem(item);
  };

  const closePopup = () => {
    setSelectedItem(null);
  };

  const confirmPurchase = async () => {
    try {
      const response = await axiosInstance.get(`/shop/check?itemName=${selectedItem.itemName}`);
      ItemPurchase(selectedItem.itemName);
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.data.check === "cash") {
        handlePayment(error.response.data);
      } else {
        alert(error.response?.data.message);
      }
    }
    closePopup();
  };


  const handlePayment = (item) => {
    const orderId = btoa(new Date().getTime() + Math.random());
    loadTossPayments("test_ck_yL0qZ4G1VOYz6wvYM6Oo8oWb2MQY")
      .then((tossPayments) => {
        tossPayments.requestPayment("카드", {
          amount: item.price,
          orderId,
          orderName: item.itemName,
          successUrl: `http://localhost:3000/shop/success?itemName=${item.itemName}`,
          failUrl: "http://localhost:3000/shop/fail",
        });
      })
      .catch((error) => {
        console.error("결제 요청 실패:", error.message);
        alert("결제 요청 중 오류가 발생했습니다.");
      });
  };

  const ItemPurchase = async (itemName) => {
    try {
      const response = await axiosInstance.post(`/shop/purchase?itemName=${itemName}`);
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data);
    }
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>상점</h1>
        <div className="shop-balance">
          <span>물: 100</span>
          <span>코인: 200</span>
          <span>캐시: 50</span>
        </div>
        <button className="close-button" onClick={goToMain}>X</button>
      </div>
      <div className="shop-categories">
        {["ALL", "SEED", "FERTILIZER", "GNOME", "DECORATION", "CURRENCY"].map((cat) => (
          <button key={cat} onClick={() => filterItems(cat)}>{cat}</button>
        ))}
      </div>
      <div className="shop-items">
        {filteredItems.map((item) => (
          <div key={item.itemName} className="shop-item">
            <img
              src={item.itemImage !== "null" ? item.itemImage : "placeholder.png"}
              alt={item.itemName}
            />
            <div>
              <h3>{item.itemName}</h3>
              <p>{item.itemDescription}</p>
              <button onClick={() => openPopup(item)}>
                {item.price} {item.currency === "COIN" ? "코인" : item.currency === "DIAMOND" ? "다이아" : "캐시"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedItem && (
        <div className="popup">
          <div className="popup-content">
            <h2>{selectedItem.itemName}</h2>
            <p>{selectedItem.itemDescription}</p>
            <p>
              가격: {selectedItem.price} {selectedItem.currency === "COIN" ? "코인" : selectedItem.currency === "DIAMOND" ? "다이아" : "캐시"}
            </p>
            <div className="popup-buttons">
              <button onClick={confirmPurchase}>구매</button>
              <button onClick={closePopup}>취소</button>
            </div>
          </div>
        </div>
      )}
      <button className="inventory-button">인벤토리 →</button>
    </div>
  );
}

export default Shop;