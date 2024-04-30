const helper = require('../helper.js');

// The dynamic form for changing the users password
const ChangePasswordWindow = () => {

    // function that calls a post request for the user's password
    // (only if the data is valid)
    const handlePassChange = (e) => {
        e.preventDefault();
        const pass = e.target.querySelector('#pass').value;
        const pass2 = e.target.querySelector('#pass2').value;
    
        if (!pass || !pass2) {
            helper.handleError('All fields are required!');
            return false;
        }
    
        if (pass !== pass2) {
            helper.handleError('Passwords do not match!');
            return false;
        }
    
        helper.sendPost(e.target.action, {pass, pass2});
        return false;
    }

    // html form for password changing
    return (
        <>
            <a id="changePasswordButton" href="/game">Back</a>
            <form id="signupForm"
                name="signupForm"
                onSubmit={handlePassChange}
                action="/updatePassword"
                method="POST"
                className="mainForm"
            >
                <label htmlFor="pass">New Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" />
                <label className="inputLabel" htmlFor="pass">Retype New Password: </label>
                <input id="pass2" type="password" name="pass2" placeholder="password" />
                <input className="formSubmit" type="submit" value="Change" />
            </form> 
        </>
    );
};

export default ChangePasswordWindow;