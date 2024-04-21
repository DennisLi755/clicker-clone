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

const handleLogout = (score, powerUps) => {
    console.log('logout button pressed');
    helper.sendPost('/score', { score });
    helper.sendPost('/powerups', { powerUps });
    return false;

}

const App = () => {
    let [score, setScore] = useState(0);
    const [powerUps, setPowerUps] = useState({
        AutoClicker: {
            Unlocked: false,
            UpdatedCost: 10,
            UpdatedIncrement: 1,
        },
        MoreScore: {
            Unlocked: false,
            UpdatedCost: 20,
            UpdatedIncrement: 5
        }
    });
    const [ticking] = useState(true);
    const [scoreAdd, setScoreAdd] = useState(1);
    const [scoreAddAuto, setScoreAddAuto] = useState(0);

    useEffect(() => {
        // logic for loading score and power ups
        const loadData = async () => {
            const response = await fetch('/powerups');
            const data = await response.json();
            console.log(data.powerUps);
            setPowerUps(data.powerUps);
            if (data.powerUps.AutoClicker.Unlocked) {
                setScoreAddAuto(data.powerUps.AutoClicker.UpdatedIncrement / 2);
            }
            if (data.powerUps.MoreScore.Unlocked) {
                setScoreAdd(data.powerUps.MoreScore.UpdatedIncrement / 2);
            }

            const scoreResponse = await fetch('/score');
            const scoreData = await scoreResponse.json();
            setScore(scoreData.score);
        }
        loadData();
    }, []);

    useEffect(() => {
        if (powerUps.AutoClicker.Unlocked) {
            const timer = setTimeout(() => ticking && setScore(score + scoreAddAuto), 1e3);
            return () => clearTimeout(timer);
        }
    }, [score, ticking]);

    const addScore = () => {
        console.log("Auto Clicker: " + powerUps.AutoClicker.Unlocked);
        console.log('More Score: ' + powerUps.MoreScore.Unlocked);
        setScore(score + scoreAdd);
    }

    const autoClickerBuy = () => {
        if (score >= powerUps.AutoClicker.UpdatedCost) {
            setScoreAddAuto(powerUps.AutoClicker.UpdatedIncrement);
            setScore(score -= powerUps.AutoClicker.UpdatedCost);
            let newCost = powerUps.AutoClicker.UpdatedCost * 2;
            let newIncrement = powerUps.AutoClicker.UpdatedIncrement * 2;
            setPowerUps({
                ...powerUps,
                AutoClicker: {
                    Unlocked: true,
                    UpdatedCost: newCost,
                    UpdatedIncrement: newIncrement
                }
            });
            console.log(powerUps);
        }
    }

    const moreScoreBuy = () => {
        if (score >= powerUps.MoreScore.UpdatedCost) {
            setScore(score -= powerUps.MoreScore.UpdatedCost);
            setScoreAdd(powerUps.MoreScore.UpdatedIncrement);
            let newCost = powerUps.MoreScore.UpdatedCost * 2;
            let newIncrement = powerUps.MoreScore.UpdatedIncrement * 2;
            setPowerUps({
                ...powerUps,
                MoreScore: {
                    Unlocked: true,
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
            cost: powerUps.AutoClicker.UpdatedCost,
            increment: powerUps.AutoClicker.UpdatedIncrement
        },
        "MoreScore": {
            func: moreScoreBuy,
            cost: powerUps.MoreScore.UpdatedCost,
            increment: powerUps.MoreScore.UpdatedIncrement
        }
    }
    return (
        <>
            <nav><a href="/login"></a>
                <div class="navlink"><a onClick={() => handleLogout(score, powerUps)} id="logoutButton" href="/logout">Log out</a></div>
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