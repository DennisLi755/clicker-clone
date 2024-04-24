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
            <ShopItem name={"Auto Clicker"} description={`Automatically increments score by ${data.AutoClicker.increment} every second`} premium={data.AutoClicker.premium} cost={data.AutoClicker.cost} func={data.AutoClicker.func} />
            <ShopItem name={"More score per click"} description={`Clicking increments score by ${data.MoreScore.increment}`} premium={data.MoreScore.premium} cost={data.MoreScore.cost} func={data.MoreScore.func} />
            <ShopItem name={"Placeholder"} description={`PlaceHolder: ${data.Premium.increment}`} premium={data.Premium.premium} cost={data.Premium.cost} func={data.Premium.func} />
        </>
    )
}

const Button = ({score}) => {
    return (
        <button onClick={score}>Click me!</button>
    )
}

const handleLogout = (score, powerUps, premium) => {
    console.log('logout button pressed');
    helper.sendPost('/user', { score, powerUps, premium });
    return false;

}

const App = () => {
    let [score, setScore] = useState(0);
    const [powerUps, setPowerUps] = useState({
        AutoClicker: {
            Unlocked: false,
            UpdatedCost: 10,
            UpdatedIncrement: 1,
            Prem: false,
        },
        MoreScore: {
            Unlocked: false,
            UpdatedCost: 20,
            UpdatedIncrement: 5,
            Prem: false,
        },
        Premium: {
            Unlocked: false,
            UpdatedCost: 30,
            UpdatedIncrement: 10,
            Prem: true,
        }
    });
    const [ticking] = useState(true);
    const [scoreAdd, setScoreAdd] = useState(1);
    const [scoreAddAuto, setScoreAddAuto] = useState(0);
    const [userPremium, setUserPremium] = useState(false);

    useEffect(() => {
        // logic for loading score and power ups
        const loadData = async () => {
            // setScore(scoreData.score);
            const response = await fetch('/user');
            const data = await response.json();
            console.log(data.user);
            setPowerUps(data.user.powerUps);
            if (data.user.powerUps.AutoClicker.Unlocked) {
                setScoreAddAuto(data.user.powerUps.AutoClicker.UpdatedIncrement / 2);
            }
            if (data.user.powerUps.MoreScore.Unlocked) {
                setScoreAdd(data.user.powerUps.MoreScore.UpdatedIncrement / 2);
            }
            setScore(data.user.score);
            setUserPremium(data.user.premium);
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
                    Prem: false,
                    UpdatedCost: newCost,
                    UpdatedIncrement: newIncrement
                }
            });
            console.log(powerUps);
        }
    };

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
                    Prem: false,
                    UpdatedCost: newCost,
                    UpdatedIncrement: newIncrement
                }
            });
            console.log(powerUps);
        }
    };

    const premiumBuy = () => {
        if (!userPremium) {
            alert('You must be a premium user to buy this item.');
            return;
        }

        if (score >= powerUps.Premium.UpdatedCost) {
            setScore(score -= powerUps.Premium.UpdatedCost);
            //setScoreAdd(powerUps.MoreScore.UpdatedIncrement);
            let newCost = powerUps.Premium.UpdatedCost * 2;
            let newIncrement = powerUps.Premium.UpdatedIncrement * 2;
            setPowerUps({
                ...powerUps,
                Premium: {
                    Unlocked: true,
                    Prem: true,
                    UpdatedCost: newCost,
                    UpdatedIncrement: newIncrement
                }
            });
            console.log(powerUps);
        }
    };


    const data = {
        "AutoClicker": {
            func: autoClickerBuy,
            cost: powerUps.AutoClicker.UpdatedCost,
            increment: powerUps.AutoClicker.UpdatedIncrement,
            premium: powerUps.AutoClicker.Prem,
        },
        "MoreScore": {
            func: moreScoreBuy,
            cost: powerUps.MoreScore.UpdatedCost,
            increment: powerUps.MoreScore.UpdatedIncrement,
            premium: powerUps.MoreScore.Prem,
        },
        "Premium": {
            func: premiumBuy,
            cost: powerUps.Premium.UpdatedCost,
            increment: powerUps.Premium.UpdatedIncrement,
            premium: powerUps.Premium.Prem
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