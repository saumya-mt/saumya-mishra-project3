import React from "react";
import { useEffect, useState } from "react";
import { getJson } from "../lib/api";

function ScoresPage() {
  const [scores, setScores] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadScores() {
      try {
        const nextScores = await getJson("/api/highscore");
        if (!ignore) {
          setScores(nextScores);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
        }
      }
    }

    loadScores();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="page card">
      <h1>High Scores</h1>
      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
      <table className="scores-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Sudokus Solved</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={score.username}>
              <td>{index + 1}</td>
              <td>{score.username}</td>
              <td>{score.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ScoresPage;
