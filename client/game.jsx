const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const App = () => {
    let loadedScore;

    const [score, setScore] = useState(1);

    useEffect(() => {
        const loadScore = async () => {
            const response = await fetch('/getScore');
            const data = await response.json();
            console.log(data.score);
            setScore(data.score);
        }
        loadScore();
    }, [])

    return (
        <>
            <h1>This is the game page.</h1>
            <p>Score: {score}</p>
        </>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;