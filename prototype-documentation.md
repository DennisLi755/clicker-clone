# Clicker Clone (IGME 430 Project 2) Prototype Documentation

## What is the intended purpose of your application?

The intended purpose of my application is to provide an experience extremely similar to that of [Cookie Clicker](https://en.wikipedia.org/wiki/Cookie_Clicker), a simple web idle game. The main thing that sets the project apart is that user data is stored in a MongoDB database, which is saved when the user logs out and retrieved again when the user logs back in.

## What work has been completed for this milestone?

The functional aspects of the front end and back end are operational. Data can be saved and retrieved/displayed. This data includes the users score, and the various upgrades they can unlock.

## What work is left, and how do you plan to complete it?

There are a few more things to be done before the project is considered complete:
<ul>
<li>Profit Model</li>
<li>Aesthetic Styling</li>
<li>Leaderboard feature (stretch)</li>
</ul>
The profit model is a simple premium users feature, that would be a check box. Some items in the shop would only be availabe to premium users. For styling, I plan to use CSS Bootstrap and Tailwind to expedite the process. The leaderboard feature is another React component that pulls the scores of all users and ranks them in real time.

### What does your timeline/roadmap look like to finish on time?

My plan is to work on the above features in the order they are listed. My general timeline is to have the profit model done by 4/25, styling done by 4/28, and the leaderboard to be completed by 4/30.

## How are you using React?

React is used as the main framework for developing the front end.

### What components have you made?

<ul>
<li><code>Button:</code></li>
A simple button component that works as the medium in which the player gets more score
<li><code>Shop:</code></li>
A wrapper component that houses many different <code>ShopItems</code>. Data is sent through the wrapper as an object for distributing specific data to the children components.
<li><code>ShopItem:</code></li>
A component that models a shop item. Displays the different points of data and attributes for each upgrade.
</ul>

### What components do you still plan to add?

The only component that I plan on adding is a Leaderboard component, which would be an unordered list of the names of the users with the highest scores, along with the score.

### What data are you storing in MongoDB?

I am storing number and object data within MongoDB. The user has two new attributes: score and power ups. Score is a simple number that represents the number of points the user has. Power ups is a JSON Object that holds different data about power ups, like whether the user has unlocked it and how far the user has upgraded the power up.

### What data do you still need to store?

The only other piece of data the database would need to store is whether or not the user is a premium user or not. This will be done when the profit model is implemented.

## What is your profit model?

I plan to implement a premium users feature. In a practical sense, this feature would be locked behind some monetary payment, however, for the purposes of this project, I just plan to have a simple checkbox which marks the user as premium or not. The benefit that premium users get is that they would have access to special store items.

### Have you implemented it yet?

No, my plan would be for just a simple boolean value on the database, which the front end gets and displays. When the user click's the checkbox, a POST request is sent to the server to update the users data accordingly. The client side would be updated too, which is what the shop purchases would be checking against.

## Do you have a plan for g oing above and beyond? If so, what is it?

My plan is to implement a leaderboard feature. My idea is that after a set period of time (10-20 seconds), all user data would be saved on the server, and the client would get all the user data and update the leaderboard accordingly. The intention is to limit how many requests are being done, but keeping the leaderboard somewhat consistent and live.

## If you used any borrowed code or code fragments, where did you get them from? What do the code fragments do? Where are they in your code?

The base of this project was built from the DomoMaker project in IGME 430. Austin Willoughby provided most of the code from that project. Besides that, my implementation for adding to the score every second was found from this [Stack Overflow Thread](https://stackoverflow.com/questions/20598628/do-style-tags-work-in-markdown).

## Endpoints

### /score
<ul>
<li>Supported Methods: GET, POST</li>
<li>Query Params: N/A</li>
<li>Middleware: Requires Login</li>
<li>Description: Gets the score of the user or updates it from the client</li>
<li>Return Type: JSON</li>
</ul>

### /powerups
<ul>
<li>Supported Methods: GET, POST</li>
<li>Query Params: N/A</li>
<li>Middleware: Requires Login</li>
<li>Description: Gets the power up data of the user or updates it from the client</li>
<li>Return Type: JSON</li>
</ul>