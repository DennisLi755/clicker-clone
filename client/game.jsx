const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
import Button from 'react-bootstrap/Button';

const BoardItem = ({name, score}) => {
    return (
        <ul>
            <li>Name: {name}</li>
            <li>Score: {score}</li>
        </ul>
    )
}

const LeaderBoard = ({users}) => {
    return (
        <div className="board">
            <h2>Leaderboard</h2>
            {users.slice(0, 5).map((user) => (
                <BoardItem name={user.username} score={user.score}/>
            ))}
        </div>
    )
}

const ShopItem = ({name, description, premium, cost, func}) => {
    return (
        <ul>
            <li>Name: {name}</li>
            <li>Description: {description}</li>
            <li>Premium?: {premium.toString()}</li>
            <li>Cost: {cost}</li>
            <Button variant="primary" onClick={func}>Buy me!</Button>
        </ul>
    )
}

const Shop = ({data}) => {
    return (
        <div className='board'>
            <h2>Shop</h2>
            <ShopItem name={"Auto Clicker"} description={`Automatically increments score by ${data.AutoClicker.increment} every second`} premium={data.AutoClicker.premium} cost={data.AutoClicker.cost} func={data.AutoClicker.func} />
            <ShopItem name={"More score per click"} description={`Clicking increments score by ${data.MoreScore.increment}`} premium={data.MoreScore.premium} cost={data.MoreScore.cost} func={data.MoreScore.func} />
            <ShopItem name={"Placeholder"} description={`PlaceHolder: ${data.Premium.increment}`} premium={data.Premium.premium} cost={data.Premium.cost} func={data.Premium.func} />
        </div>
    )
}

const ClickButton = ({score}) => {
    return (
        <button onClick={score}>Click me!</button>
    )
}

const handleSignup = (e) => {
    e.preventDefault();
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (!pass !== !pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {pass, pass2});
    return false;
}

const ChangePasswordWindow = (props) => {
    return (
        <>
            <a id="changePasswordButton" href="/game">Back</a>
            <form id="signupForm"
                name="signupForm"
                onSubmit={handleSignup}
                action="/updatePassword"
                method="POST"
                className="mainForm"
            >
                <label htmlFor="pass">New Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" />
                <label htmlFor="pass">Retype New Password: </label>
                <input id="pass2" type="password" name="pass2" placeholder="password" />
                <input className="formSubmit" type="submit" value="Sign up" />
            </form>
        </>
    );
};

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
    const [loading, setLoading] = useState(false);
    const [counter, setCounter] = useState(0);
    const [addCounter] = useState(1);
    const [sortedUsers, setSortedUsers] = useState([]);

    const [changeForm, setChangeForm] = useState(false);

    const loadAllUserData = async () => {
        const response = await fetch('/allUsers');
        const data = await response.json();
        const userData = data.user;
        const users = userData.sort((a, b) => b.score - a.score)
        setSortedUsers(users);
    }

    useEffect(() => {
        // logic for loading score and power ups
        const loadData = async () => {
            // setScore(scoreData.score);
            const response = await fetch('/user');
            const data = await response.json();
            setPowerUps(data.user.powerUps);
            if (data.user.powerUps.AutoClicker.Unlocked) {
                setScoreAddAuto(data.user.powerUps.AutoClicker.UpdatedIncrement / 2);
            }
            if (data.user.powerUps.MoreScore.Unlocked) {
                setScoreAdd(data.user.powerUps.MoreScore.UpdatedIncrement / 2);
            }
            setScore(data.user.score);
            setUserPremium(data.user.premium);
            setLoading(true);
        }
        loadData();
        loadAllUserData();
    }, []);

    useEffect(() => {
        console.log(sortedUsers);
    }, [sortedUsers])

    useEffect(() => {
        if (powerUps.AutoClicker.Unlocked) {
            const timer = setTimeout(() => ticking && setScore(score + scoreAddAuto), 1e3);
            return () => clearTimeout(timer);
        }
    }, [score, ticking]);

    useEffect(() => {
        if (loading) {
            helper.sendPost('/user', { score, powerUps, premium: userPremium });
            console.log('saved');
            loadAllUserData();
            const timer = setTimeout(() => {
                setCounter(counter + addCounter);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [loading, counter]);

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
            <nav>
                <div class="navlink">
                    <a onClick={() => handleLogout(score, powerUps, userPremium)} id="logoutButton" href="/logout">Log out</a>
                </div>
                <div class="navlink"><a onClick={() => setChangeForm(!changeForm)} id="changePasswordButton">Change Password</a></div>
                {userPremium ? <input type="checkbox" id="premium" onClick={(() => setUserPremium(!userPremium))} checked />
                    : <input type="checkbox" id="premium" onClick={(() => setUserPremium(!userPremium))} />}
                <label for="premium">Premium</label>
            </nav>
            <h1>Clicker Clone</h1>
            {changeForm ? 
                <ChangePasswordWindow /> :
                <div className="container">
                    <LeaderBoard className="item" users={sortedUsers} />
                    <div className="item">
                        <p>Score: {score}</p>
                        <ClickButton score={addScore} />
                    </div>
                    <Shop className="item" data={data} />
                </div>
            }
        </>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    // const changePasswordButton = document.getElementById('changePasswordButton');
    // changePasswordButton.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     root.render(<ChangePasswordWindow />);
    //     return false;
    // });
    root.render(<App />);
};

window.onload = init;