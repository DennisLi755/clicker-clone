import BoardItem from './BoardItem.jsx';

//Leaderboard component that takes an array of users and displays the top
//5 users in order of score
const Leaderboard = ({users}) => {
    return (
        <div className="board">
            <h2>Leaderboard</h2>
            {users.slice(0, 5).map((user) => (
                <BoardItem name={user.username} score={user.score}/>
            ))}
        </div>
    )
};

export default Leaderboard;