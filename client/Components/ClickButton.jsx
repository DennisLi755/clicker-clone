//Simple react component that sets the user's score
const ClickButton = ({score}) => {
    return (
        <button id="clickButton" onClick={score}>Click me!</button>
    )
};

export default ClickButton;