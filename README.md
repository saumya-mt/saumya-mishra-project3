# Sudoku Project 3

Fullstack Sudoku app built with React, Vite, Express, MongoDB, and Mongoose.

## Project Links

- GitHub Repo: https://github.com/saumya-mt/saumya-mishra-project3
- Deployed App: https://saumya-mishra-project3.onrender.com
- Video Walkthrough: https://northeastern-my.sharepoint.com/personal/mishra_sau_northeastern_edu/_layouts/15/stream.aspx?id=%2Fpersonal%2Fmishra_sau_northeastern_edu%2FDocuments%2FRecordings%2FWeb_development_project3-20260327_160326-Meeting+Recording.mp4&referrer=StreamWebApp.Web&referrerScenario=AddressBarCopied.view.54d30eb9-14f8-470a-9a96-1d03f2897ded

## Collaborator

- None

## Writeup

### 1. What were some challenges you faced while making this app?

One challenge was turning Project 2 from a frontend-only app into a fullstack app. In this project, I had to make the frontend, backend, and database work together instead of only worrying about what happened in the browser. A difficult part of that was making sure a user could create a game, make progress, refresh the page, and still come back to the same saved state.

Another challenge was figuring out how to store the data in MongoDB in a way that matched the assignment requirements. I needed to keep track of users, games, saved progress, completed games, and high scores. A lot of debugging came from making sure reset, save, reload, and delete all worked correctly without breaking something else.

The custom game bonus was also challenging because it needed backend validation. It was not enough to just let the user type numbers into a board. I had to make sure the custom puzzle followed Sudoku rules and had exactly one valid solution before it could be accepted.

### 2. Given more time, what additional features, functional or design changes would you make?

Given more time, I would improve the overall polish of the app. I would add better success and error messages for things like login, registration, saving progress, and submitting a custom game. I would also improve the mobile layout more and clean up some parts of the interface.

I would also add more features related to competition and tracking progress. For example, it would be useful to have more detailed leaderboards, user stats, fastest completion times, and maybe a simple profile page.

On the technical side, I would add more automated testing. I already added a smoke test for the main app flow, but with more time I would add more route tests and Sudoku logic tests to make the project easier to maintain.

### 3. What assumptions did you make while working on this assignment?

I assumed that cookies were the intended way to handle login sessions because the assignment specifically mentioned using cookies. Because of that, I built the login and register flow so that a cookie is set when a user successfully authenticates, and later requests use that cookie to identify the user.

I also assumed that users who are not logged in should still be able to open pages and see games, but should not be able to edit the Sudoku board. That matched how I interpreted the logged-out experience section of the assignment, so I made the board viewable but read-only when a user is logged out.

I also assumed that when a user has already completed a game, opening that same game again should show it as completed and display the solved board. For the custom game bonus, I assumed the custom board should be 9x9 because the assignment specifically describes the custom page as a normal Sudoku board.

### 4. How long did this assignment take to complete?

Estimated time spent: about 20-25 hours total.

### 5. What bonus points did you accomplish? Please link to code where relevant and add any required details.

- Password Encryption: I implemented password encryption so user passwords are not stored in plain text in the database. When a user registers, the password is hashed using bcryptjs before being saved. When the user logs in, the entered password is compared against the hashed password instead of directly checking the original string. This adds an extra layer of security and makes the authentication system more realistic and closer to how production apps work Code: [userController.js](https://github.com/saumya-mt/saumya-mishra-project3/blob/main/backend/src/controllers/userController.js)

- Delete Game: Implemented the delete game bonus so that the creator of a game can delete it directly from the game page. This only appears for the user who created that game. On the backend, when a game is deleted, the app also updates the high score data correctly by reducing the win count for any users who had completed that game. That way, the scoreboard stays accurate even after a game is removedCode: [GamePage.jsx](https://github.com/saumya-mt/saumya-mishra-project3/blob/main/frontend/src/pages/GamePage.jsx) and [sudokuController.js](https://github.com/saumya-mt/saumya-mishra-project3/blob/main/backend/src/controllers/sudokuController.js)

- Custom Games: I also implemented the custom games bonus. On the games page, the user can choose to create a custom Sudoku puzzle. This opens a custom board page where the user can enter their own 9x9 puzzle. When they submit it, the backend validates the puzzle and only accepts it if it has exactly one valid solution. If the puzzle is valid, it is stored as a new game and the user is redirected to that game page. This feature required both frontend and backend work, including puzzle validation logic Code: [CustomGamePage.jsx](https://github.com/saumya-mt/saumya-mishra-project3/blob/main/frontend/src/pages/CustomGamePage.jsx), [sudokuController.js](https://github.com/saumya-mt/saumya-mishra-project3/blob/main/backend/src/controllers/sudokuController.js), and [sudoku.js](https://github.com/saumya-mt/saumya-mishra-project3/blob/main/frontend/src/utils/sudoku.js)
