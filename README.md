# Sudoku Project 3

Fullstack Sudoku app built with React, Vite, Express, MongoDB, and Mongoose.

## Project Links

- GitHub Repo: https://github.com/saumya-mt/saumya-mishra-project3
- Deployed App: https://saumya-mishra-project3.onrender.com
- Video Walkthrough: `ADD_VIDEO_LINK_HERE`

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

- Password Encryption: Implemented with `bcryptjs`. Code: [userController.js](/Users/saumyamishra/Documents/saumya-mishra-project3/server/src/controllers/userController.js)

- Delete Game: The creator can delete their own game, and user win counts are decremented for players who completed the deleted game. Code: [GamePage.jsx](/Users/saumyamishra/Documents/saumya-mishra-project3/src/pages/GamePage.jsx) and [sudokuController.js](/Users/saumyamishra/Documents/saumya-mishra-project3/server/src/controllers/sudokuController.js)

- Custom Games: A custom 9x9 board can be submitted and validated on the backend, and the puzzle is only accepted if it has exactly one valid solution. Code: [CustomGamePage.jsx](/Users/saumyamishra/Documents/saumya-mishra-project3/src/pages/CustomGamePage.jsx), [sudokuController.js](/Users/saumyamishra/Documents/saumya-mishra-project3/server/src/controllers/sudokuController.js), and [sudoku.js](/Users/saumyamishra/Documents/saumya-mishra-project3/src/utils/sudoku.js)
