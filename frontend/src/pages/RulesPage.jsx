import React from "react";
function RulesPage() {
  return (
    <section className="page card">
      <h1>Rules</h1>
      <ol className="rules-list">
        <li>Each row must contain all numbers exactly once.</li>
        <li>Each column must contain all numbers exactly once.</li>
        <li>Each sub-grid must contain all numbers exactly once.</li>
        <li>Pre-filled cells are locked and cannot be edited.</li>
      </ol>
      <div className="credits">
        <h2>Credits</h2>
        <p>Made by Team Sudoku</p>
        <p>
          Email: <a href="mailto:team@sudokumaster.dev">team@sudokumaster.dev</a>
        </p>
        <p>
          GitHub: <a href="https://github.com/example" target="_blank" rel="noreferrer">github.com/example</a>
        </p>
      </div>
    </section>
  );
}

export default RulesPage;
