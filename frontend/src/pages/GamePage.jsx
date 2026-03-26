import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GameHeader from "../components/GameHeader";
import SudokuBoard from "../components/SudokuBoard";
import { useAuth } from "../context/AuthContext";
import { useSudoku } from "../context/SudokuContext";
import { deleteJson, getJson, postJson, putJson } from "../lib/api";

function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { dispatch, state } = useSudoku();
  const [status, setStatus] = useState({ isLoading: true, errorMessage: "" });
  const [didRecordWin, setDidRecordWin] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadGame() {
      try {
        setStatus({ isLoading: true, errorMessage: "" });
        const game = await getJson(`/api/sudoku/${gameId}`);
        if (!ignore) {
          dispatch({ type: "LOAD_GAME", payload: { game } });
          setDidRecordWin(Boolean(game.completed));
          setStatus({ isLoading: false, errorMessage: "" });
        }
      } catch (error) {
        if (!ignore) {
          setStatus({ isLoading: false, errorMessage: error.message });
        }
      }
    }

    loadGame();
    return () => {
      ignore = true;
    };
  }, [dispatch, gameId]);

  useEffect(() => {
    if (!isLoggedIn || !state.isComplete || !state.gameId || didRecordWin) {
      return;
    }

    postJson("/api/highscore", { gameId: state.gameId })
      .then(() => setDidRecordWin(true))
      .catch(() => {});
  }, [didRecordWin, isLoggedIn, state.gameId, state.isComplete]);

  useEffect(() => {
    if (
      !isLoggedIn ||
      status.isLoading ||
      state.gameId !== gameId ||
      !Array.isArray(state.board) ||
      state.isComplete
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      putJson(`/api/sudoku/${gameId}`, {
        board: state.board,
        secondsElapsed: state.secondsElapsed,
      }).catch(() => {});
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    gameId,
    isLoggedIn,
    state.board,
    state.gameId,
    state.isComplete,
    state.secondsElapsed,
    status.isLoading,
  ]);

  async function handleResetGame() {
    dispatch({ type: "RESET_GAME" });

    if (!isLoggedIn || state.gameId !== gameId) {
      return;
    }

    try {
      await putJson(`/api/sudoku/${gameId}`, { resetProgress: true });
    } catch {
      // Keep the local reset if the backend save fails.
    }
  }

  async function handleDeleteGame() {
    if (!window.confirm("Are you sure you want to delete this game? This cannot be undone.")) {
      return;
    }
    try {
      setIsDeleting(true);
      await deleteJson(`/api/sudoku/${gameId}`);
      navigate("/games");
    } catch (error) {
      setStatus((current) => ({ ...current, errorMessage: error.message }));
      setIsDeleting(false);
    }
  }

  if (status.isLoading) {
    return (
      <section className="page card">
        <p>Loading game...</p>
      </section>
    );
  }

  if (status.errorMessage) {
    return (
      <section className="page card">
        <p className="form-error">{status.errorMessage}</p>
      </section>
    );
  }

  return (
    <section className="page card game-page">
      <GameHeader title={state.gameName || "Sudoku Game"} />
      {!isLoggedIn ? <p>You can view this game while logged out, but editing requires login.</p> : null}
      <SudokuBoard />
      <div className="game-controls">
        <button type="button" onClick={handleResetGame} disabled={!isLoggedIn}>
          Reset
        </button>
        {state.isOwner && (
          <button
            type="button"
            className="delete-button"
            onClick={handleDeleteGame}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Game"}
          </button>
        )}
        {state.isComplete ? <p className="win-message">Puzzle solved.</p> : null}
      </div>
    </section>
  );
}

export default GamePage;
