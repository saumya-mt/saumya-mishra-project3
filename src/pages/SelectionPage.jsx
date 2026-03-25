import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getJson, postJson } from "../lib/api";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SelectionPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [games, setGames] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadGames() {
      try {
        const nextGames = await getJson("/api/sudoku");
        if (!ignore) {
          setGames(nextGames);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadGames();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleCreateGame(difficulty) {
    try {
      setErrorMessage("");
      const result = await postJson("/api/sudoku", { difficulty });
      navigate(`/game/${result.gameId}`);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <section className="page card">
      <h1>Game Selection</h1>
      <div className="actions">
        <button type="button" className="button-link" onClick={() => handleCreateGame("NORMAL")} disabled={!isLoggedIn}>
          Create Normal Game
        </button>
        <button type="button" className="button-link" onClick={() => handleCreateGame("EASY")} disabled={!isLoggedIn}>
          Create Easy Game
        </button>
        <Link
          to="/custom"
          className={`button-link${!isLoggedIn ? " disabled-link" : ""}`}
          aria-disabled={!isLoggedIn}
          onClick={(event) => {
            if (!isLoggedIn) {
              event.preventDefault();
            }
          }}
        >
          Create Custom Game
        </Link>
      </div>
      {!isLoggedIn ? <p>Log in to create a new game. You can still view and open existing games.</p> : null}
      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
      {isLoading ? <p>Loading games...</p> : null}
      <ul className="game-list">
        {games.map((game) => (
          <li key={game.id}>
            <Link to={`/game/${game.id}`} className="game-link">
              <span>{game.name}</span>
              <small>
                {game.difficulty} by {game.creatorUsername} on {formatDate(game.createdAt)}
              </small>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SelectionPage;
