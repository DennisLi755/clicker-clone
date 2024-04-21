const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const ShopItem = ({name, description, premium, cost, func}) => {
    return (
        <ul>
            <li>Name: {name}</li>
            <li>Description: {description}</li>
            <li>Premium?: {premium.toString()}</li>
            <li>Cost: {cost}</li>
            <button onClick={func}>Buy me!</button>
        </ul>
    )
}

const Shop = ({score, functions}) => {
    return (
        <>
            <h1>Here is the shop menu</h1>
            <ShopItem name={"Auto Clicker"} description={"Automatically increments score by 1 every second"} premium={false} cost={10} func={functions.AutoClicker} />
            <ShopItem name={"More score per click"} description={"Clicking increments score by 15"} premium={false} cost={20} func={functions.MoreScore} />
        </>
    )
}

const Button = ({score}) => {
    return (
        <button onClick={score}>Click me!</button>
    )
}

const handleLogout = (score) => {
    console.log('logout button pressed');
    helper.sendPost('/score', { score });
    return false;

}

const App = () => {
    let [score, setScore] = useState(0);
    let [powerUps, setPowerUps] = useState({});
    const [ticking, setTicking] = useState(true);
    const [scoreAdd, setScoreAdd] = useState(1);

    useEffect(() => {
        const loadScore = async () => {
            const response = await fetch('/score');
            const data = await response.json();
            console.log(data.score);
            setScore(data.score);
        }
        // logic for loading bought power ups
        loadScore();
    }, [])

    useEffect(() => {
        if (powerUps.AutoClicker) {
            const timer = setTimeout(() => ticking && setScore(score + 1), 1e3);
            return () => clearTimeout(timer);
        }
    }, [score, ticking])

    const addScore = () => {
        console.log(score);
        setScore(score + scoreAdd);
    }

    const autoClickerBuy = () => {
        if (powerUps.AutoClicker) {
            alert("This powerup has already been bought");
            return;
        }

        if (score >= 10) {
            setScore(score -= 10);
            setPowerUps({ ...powerUps, "AutoClicker": true });
            console.log(powerUps);
        }
    }

    const moreScoreBuy = () => {
        if (powerUps.moreScoreBuy) {
            alert("This powerup has already been bought");
            return;
        }

        if (score >= 20) {
            setScore(score -= 20);
            setScoreAdd(5);
            setPowerUps({ ...powerUps, "moreScoreBuy": true });
            console.log(powerUps);
        }
    }


    const functions = {
        "AutoClicker": autoClickerBuy,
        "MoreScore": moreScoreBuy,
    }

    return (
        <>
            <nav><a href="/login"></a>
                <div class="navlink"><a onClick={() => handleLogout(score)} id="logoutButton" href="/logout">Log out</a></div>
            </nav>
            <h1>This is the game page.</h1>
            <p>Score: {score}</p>
            <Button score={addScore} />
            <Shop score={score} functions={functions} />
        </>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;