//React Component that models an item in the upgrade shop
const ShopItem = ({name, description, premium, cost, func}) => {
    return (
        <ul>
            <li>Name: {name}</li>
            <li>Description: {description}</li>
            <li>Premium: {premium.toString()}</li>
            <li>Cost: {cost}</li>
            <button onClick={func}>Buy me!</button>
        </ul>
    )
};

export default ShopItem;