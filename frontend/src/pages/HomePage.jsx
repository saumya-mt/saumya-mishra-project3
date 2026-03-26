import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="page card center">
      <h1>Sudoku Master</h1>
      <div className="actions">
        <Link className="button-link" to="/rules">
          Rules
        </Link>
        <Link className="button-link" to="/games">
          Play Game
        </Link>
      </div>
    </section>
  );
}

export default HomePage;
