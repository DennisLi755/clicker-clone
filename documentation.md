# Clicker Clone (IGME 430 Project 2) Documentation

## What is the purpose of your application? What does it do?

The intended purpose of my application is to provide an experience extremely similar to that of [Cookie Clicker](https://en.wikipedia.org/wiki/Cookie_Clicker), a simple web idle game. The main thing that sets the project apart is that user data is stored in a MongoDB database, which is saved when the user logs out and retrieved again when the user logs back in.

## How are you using React?

React is used as the main framework for developing the front end.

### What components have you made?

<ul>
<li><code>ClickButton:</code></li>
A simple button component that works as the medium in which the player gets more score
<li><code>Shop:</code></li>
A wrapper component that houses many different <code>ShopItems</code>. Data is sent through the wrapper as an object for distributing specific data to the children components.
<li><code>ShopItem:</code></li>
A component that models a shop item. Displays the different points of data and attributes for each upgrade.
<li><code>Leaderboard:</code></li>
A wrapper component that houses many different <code>BoardItems</code>. The specific user array is sent through the wrapper component and mapped through to dynamically create <code>BoardItems</code>.
<li><code>BoardItem:</code></li>
A component that models an entry in the <code>Leaderboard</code>. Displays the name and the score of each user.
<li><code>ChangePasswordWindow:</code></li>
A form that takes a new password from the user and updates the users password.
</ul>

## What data are you storing in MongoDB?

I am storing number, object, and boolean data within MongoDB. The user has three new attributes: score, power ups, and premium. Score is a simple number that represents the number of points the user has. Power ups is a JSON Object that holds different data about power ups, like whether the user has unlocked it and how far the user has upgraded the power up. The premium field simply tracks whether or not the user is a premium user.

## What went right in the development of this project?

In general, the overall development of the project went extremely smoothly. Implementing each endpoint, along with the Controller function for it was straight-forward, especially with MongoDB's wondeful documentation. Front-end development went well too, with either none or minor bugs throughout the lifetime of the project.

## What went wrong in the development of this project?

Once I had my design and idea, implementation had no major obstacles. However, the project originally had a different idea behind it. My original concept was a fusion between rhythm games and clicker games, with a song playing in the background and the user would have to click to the beat of the song to generate score and combo. This idea was quickly scrapped due to the complexity of it, so instead I decided to just go with the clicker game.

## What did you learn while developing this project?

The main thing that I learned throughout the project was how to use new technologies, like Express, MongoDB, and React. While we were introduced to them in the DomoMaker assignment, this project really cemented certain concepts, like how PUT requests work with MongoDB. React was a large learning point of the project as well. Managing differnet components, dynamic state, and conditional rendering were skill that I was able to cultivate throughout this project.

## If you were to continue, what would you do to improve your applicaion?

The main thing I would do to improve the application would be to turn the front-end interface into a more enjoyable experience. The styling and aesthetic is very barebones, so if I were to continue with the project that would be the first area of improvement. Utilizing frameworks like bootstrap or tailwind or creating custom assets would be my first step in that endeavor.

## If you went above and beyond, how did you do so?

My above and beyond feature was a leaderboard that displays the top 5 users with the highest score. The leaderboard is updated with all the user data on the database every 10 seconds. That data is set to an array on the front-end, which is then sorted based on the score and displayed through the ```Leaderboard``` component.

## If you used any borrowed code or code fragments, where did you get them from? What do the code fragments do? Where are they in your code?

The base of this project was built from the DomoMaker project in IGME 430. Austin Willoughby provided most of the code from that project. Besides that, my implementation for adding to the score every second was found from this [Stack Overflow Thread](https://stackoverflow.com/questions/20598628/do-style-tags-work-in-markdown).

## Endpoints

### /allUsers
<ul>
<li>Supported Methods: GET</li>
<li>Query Params: N/A</li>
<li>Middleware: N/A</li>
<li>Description: Gets an array of all the names and scores of every user in the database</li>
<li>Return Type: JSON</li>
</ul>

### /user
<ul>
<li>Supported Methods: GET, POST</li>
<li>Query Params: N/A</li>
<li>Middleware: Requires Login</li>
<li>Description: Gets or updates the data of a specified user (id taken from the session). Points of data that are updated are score, power ups, and premium</li>
<li>Return Type: JSON</li>
</ul>

### /updatePassword
<ul>
<li>Supported Methods: POST</li>
<li>Query Params: N/A</li>
<li>Middleware: Requires Secure, Requires Login</li>
<li>Description: Updates the password of the current user (id stored in session)</li>
<li>Return Type: JSON</li>
</ul>