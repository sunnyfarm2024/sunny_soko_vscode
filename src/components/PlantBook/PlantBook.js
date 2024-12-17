import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PlantBook.css";

function PlantBook({ onClose }) {
  const [plants, setPlants] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get("http://localhost:8080/plant/book");
        setPlants(response.data);
      } catch (error) {
        console.error("Error fetching plant book data:", error);
      }
    };

    fetchPlants();
  }, []);

  const totalPages = Math.ceil(plants.length / 2);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = currentPage * 2;
  const currentPlants = plants.slice(startIndex, startIndex + 2);

  return (
    <div className="plantbook-popup" onClick={onClose}>
      <div className="plantbook-content" onClick={(e) => e.stopPropagation()}>
        <button
          className={`nav-button left-button ${currentPage === 0 ? "disabled" : ""}`}
          onClick={goToPrevPage}
          disabled={currentPage === 0}
        >
          ←
        </button>
        <div className="plant-display">
          <div className="plant-card left">
            {currentPlants[0] && (
              <>
                <div className="plant-image">
                  {currentPlants[0].plantImage !== "noImg"
                    ? <img src={currentPlants[0].plantImage} alt="Plant" />
                    : "□"}
                </div>
                <div className="plant-description">{currentPlants[0].plantDescription}</div>
              </>
            )}
          </div>
          <div className="plant-divider"></div>
          <div className="plant-card right">
            {currentPlants[1] && (
              <>
                <div className="plant-image">
                  {currentPlants[1].plantImage !== "noImg"
                    ? <img src={currentPlants[1].plantImage} alt="Plant" />
                    : "□"}
                </div>
                <div className="plant-description">{currentPlants[1].plantDescription}</div>
              </>
            )}
          </div>
        </div>
        <button
          className={`nav-button right-button ${currentPage === totalPages - 1 ? "disabled" : ""}`}
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
        >
          →
        </button>
        <button className="close-button" onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
}

export default PlantBook;
