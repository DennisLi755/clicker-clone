import ShopItem from './ShopItem.jsx';

//Shop component that takes in an object describing the data of the store
const Shop = ({data}) => {
    return (
        <div className='board'>
            <h2>Shop</h2>
            <ShopItem name={"Auto Clicker"} description={`Automatically increments score by ${data.AutoClicker.increment} every second`} premium={data.AutoClicker.premium} cost={data.AutoClicker.cost} func={data.AutoClicker.func} />
            <ShopItem name={"More score per click"} description={`Clicking increments score by ${data.MoreScore.increment}`} premium={data.MoreScore.premium} cost={data.MoreScore.cost} func={data.MoreScore.func} />
        </div>
    )
};

export default Shop;