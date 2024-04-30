const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
import ChangePasswordWindow from './Components/ChangePasswordWindow.jsx';
import ClickButton from './Components/ClickButton.jsx';
import Leaderboard from './Components/Leaderboard.jsx';
import Shop from './Components/Shop.jsx';

const App = () => {
    //score state that is the user's current score
    let [score, setScore] = useState(0);
    //powerups state that is the user's current powerup data
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
            Prem: true,
        }
    });
    //ticking state for tracking time elapsed (for the auto clicker upgrade)
    const [ticking] = useState(true);
    //data from the more score per click upgrade that tracks the progress of the upgrade
    const [scoreAdd, setScoreAdd] = useState(1);
    //data from the auto clicker upgrade that tracks the progress of the upgrade
    const [scoreAddAuto, setScoreAddAuto] = useState(0);
    //data for whether the user is premium
    const [userPremium, setUserPremium] = useState(false);
    //boolean so requests are only made after the page and data is loaded
    const [loading, setLoading] = useState(false);
    //variables for purely invoking a useEffect hook (more about this explained later)
    const [counter, setCounter] = useState(0);
    const [addCounter] = useState(1);
    //array of all users sorted by highest score first
    const [sortedUsers, setSortedUsers] = useState([]);
    //value to check what form should be shown (ChangePasswordForm or App Form)
    const [changeForm, setChangeForm] = useState(false);

    //Function for loading in all users and sorting them
    const loadAllUserData = async () => {
        const response = await fetch('/allUsers');
        const data = await response.json();
        const userData = data.user;
        const users = userData.sort((a, b) => b.score - a.score)
        setSortedUsers(users);
    }

    //useEffect hook for when the page loads
    useEffect(() => {
        // logic for loading score, powerups, and premium
        // data is loaded in and various useStates are updated depending on the data
        const loadData = async () => {
            const response = await fetch('/user');
            const data = await response.json();
            console.log(data);
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
        //Call functions to load all necessary program data
        loadData();
        loadAllUserData();
    }, []);

    //useEffect hook for the autoclicker upgrade
    //score is incremented every second
    useEffect(() => {
        if (powerUps.AutoClicker.Unlocked) {
            const timer = setTimeout(() => ticking && setScore(score + scoreAddAuto), 1e3);
            return () => clearTimeout(timer);
        }
    }, [score, ticking]);

    //useEffect hook for saving user data and retrieving all user data for the leaderboard every 10 seconds
    //only runs when loading is set to true and when counter is changed
    useEffect(() => {
        if (loading) {
            //save user data
            helper.sendPost('/user', { score, powerUps, premium: userPremium });
            console.log('saved');
            //load all user data
            loadAllUserData();
            //set a timer that purely changes the value of counter after 10 seconds,
            //which invokes this hook once more
            const timer = setTimeout(() => {
                setCounter(counter + addCounter);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [loading, counter]);

    //Function for setting score with new value (scoreAdd)
    //Necessary functionality for the more score per click upgrade
    const addScore = () => {
        setScore(score + scoreAdd);
    }

    //Function that runs when the auto clicker power up is bought
    //Necessary upgrade data is set, along with a new cost and new increment
    //Powerups state is updated with the new data
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

    //Function that runs when the more score per click power up is bought
    //Necessary upgrade data is set, along with a new cost and new increment
    //Powerups state is updated with the new data
    const moreScoreBuy = () => {
        if (!userPremium) {
            alert('You must be a premium user to buy this item.');
            return;
        }

        if (score >= powerUps.MoreScore.UpdatedCost) {
            setScore(score -= powerUps.MoreScore.UpdatedCost);
            setScoreAdd(powerUps.MoreScore.UpdatedIncrement);
            let newCost = powerUps.MoreScore.UpdatedCost * 2;
            let newIncrement = powerUps.MoreScore.UpdatedIncrement * 2;
            setPowerUps({
                ...powerUps,
                MoreScore: {
                    Unlocked: true,
                    Prem: true,
                    UpdatedCost: newCost,
                    UpdatedIncrement: newIncrement
                }
            });
            console.log(powerUps);
        }
    };

    //Shop data object that holds all the necessary power up data for displaying
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
                    <Leaderboard className="item" users={sortedUsers} />
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
    root.render(<App />);
};

window.onload = init;