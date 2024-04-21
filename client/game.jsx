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

const Shop = ({data}) => {
    return (
        <>
            <h1>Here is the shop menu</h1>
            <ShopItem name={"Auto Clicker"} description={`Automatically increments score by ${data.AutoClicker.increment} every second`} premium={false} cost={data.AutoClicker.cost} func={data.AutoClicker.func} />
            <ShopItem name={"More score per click"} description={`Clicking increments score by ${data.MoreScore.increment}`} premium={false} cost={data.MoreScore.cost} func={data.MoreScore.func} />
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
    const [powerUpData, setPowerUpData] = useState({
        AutoClicker: {
            UpdatedCost: 10,
            UpdatedIncrement: 1,
        },
        MoreScore: {
            UpdatedCost: 20,
            UpdatedIncrement: 5
        }
    });
    const [ticking] = useState(true);
    const [scoreAdd, setScoreAdd] = useState(1);
    const [scoreAddAuto, setScoreAddAuto] = useState(0);

    useEffect(() => {
        const loadScore = async () => {
            const response = await fetch('/score');
            const data = await response.json();
            console.log(data.score);
            setScore(data.score);
        }
        // logic for loading bought power ups
        // logic for loading power up data
        loadScore();
    }, [])

    useEffect(() => {
        if (powerUps.AutoClicker) {
            const timer = setTimeout(() => ticking && setScore(score + scoreAddAuto), 1e3);
            return () => clearTimeout(timer);
        }
    }, [score, ticking])

    const addScore = () => {
        console.log(score);
        setScore(score + scoreAdd);
    }

    const autoClickerBuy = () => {
        if (score >= powerUpData.AutoClicker.UpdatedCost) {
            if (!powerUps.AutoClicker) {
                setPowerUps({ ...powerUps, "AutoClicker": true });
            }
            setScoreAddAuto(powerUpData.AutoClicker.UpdatedIncrement);
            setScore(score -= powerUpData.AutoClicker.UpdatedCost);
            let newCost = powerUpData.AutoClicker.UpdatedCost * 2;
            let newIncrement = powerUpData.AutoClicker.UpdatedIncrement * 2;
            setPowerUpData({
                ...powerUpData,
                AutoClicker: {
                    UpdatedCost: newCost,
                    UpdatedIncrement: newIncrement
                }
            });
            console.log(powerUps);
        }
    }

    const moreScoreBuy = () => {
        if (score >= powerUpData.MoreScore.UpdatedCost) {
            setScore(score -= powerUpData.MoreScore.UpdatedCost);
            setScoreAdd(powerUpData.MoreScore.UpdatedIncrement);
            if (!powerUps.moreScoreBuy) {
                setPowerUps({ ...powerUps, "moreScoreBuy": true });
            }
            let newCost = powerUpData.MoreScore.UpdatedCost * 2;
            let newIncrement = powerUpData.MoreScore.UpdatedIncrement * 2;
            setPowerUpData({
                ...powerUpData,
                MoreScore: {
                    UpdatedCost: newCost,
                    UpdatedIncrement: newIncrement
                }
            });
            console.log(powerUps);
        }
    }


    const data = {
        "AutoClicker": {
            func: autoClickerBuy,
            cost: powerUpData.AutoClicker.UpdatedCost,
            increment: powerUpData.AutoClicker.UpdatedIncrement
        },
        "MoreScore": {
            func: moreScoreBuy,
            cost: powerUpData.MoreScore.UpdatedCost,
            increment: powerUpData.MoreScore.UpdatedIncrement
        }
    }
    return (
        <>
            <nav><a href="/login"></a>
                <div class="navlink"><a onClick={() => handleLogout(score)} id="logoutButton" href="/logout">Log out</a></div>
            </nav>
            <h1>This is the game page.</h1>
            <p>Score: {score}</p>
            <Button score={addScore} />
            <Shop data={data} />
        </>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;