//React Component that models an entry on the leader board
const BoardItem = ({name, score}) => {
    return (
        <ul>
            <li>Name: {name}</li>
            <li>Score: {score}</li>
        </ul>
    ) 
};

export default BoardItem;