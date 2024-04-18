const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const Button = ({score}) => {
    return (
        <button onClick={score}>Click me!</button>
    )
}

const handleLogout = (e, score) => {
    //e.preventDefault();
    console.log('logout button pressed');
    helper.sendPost('/score', { score });
    return false;
}

const App = () => {
    let [score, setScore] = useState(0);

    useEffect(() => {
        const loadScore = async () => {
            const response = await fetch('/score');
            const data = await response.json();
            console.log(data.score);
            setScore(data.score);
        }
        loadScore();
    }, [])

    const addScore = () => {
        console.log(score);
        setScore(score++);
    }

    const logoutButton = document.getElementById('logoutButton');

    logoutButton.addEventListener('click', (e) => handleLogout(e, score));

    return (
        <>
            <h1>This is the game page.</h1>
            <p>Score: {score}</p>
            <Button score={addScore} />
        </>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;