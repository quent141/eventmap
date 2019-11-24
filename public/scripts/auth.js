/*
//Add Admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const adminEmail = document.querySelector('#admin-email').value;
    const addAdminRole = functions.httpsCallable('addAdminRole');
    const showUser = functions.httpsCallable('showUser');

    //Call the function
    addAdminRole({ email: adminEmail }).then(result => {
        console.log(result);
    });

    //Call the function
    showUser( auth.currentUser() ).then(result => {
        console.log(result);
    });

});
*/


//Listen to auth changes
auth.onAuthStateChanged(user => {
    //User logged-in
    if (user){

        user.getIdTokenResult().then(idTokenResult => {
            //Get data
            user.admin = idTokenResult.claims.admin;
            setupUI(user);
        });

    } else{
        setupUI();
    }

    //Update markers
    setupMarkers(markers,user);
});


//Sign-up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    if ( signupForm['signup-name'].value.length < 5 || signupForm['signup-name'].value.length > 35
        || typeof(signupForm['signup-name'].value) != "string") {

        signupForm.querySelector('.error').innerHTML =
            "Your pseudo/name should be a string between 5 and 35 characters long";

    } else if ( signupForm['signup-aboutMe'].value.length > 900
        || typeof(signupForm['signup-aboutMe'].value) != "string" ){

        signupForm.querySelector('.error').innerHTML =
            "You should input less than 900 characters in your bio";

    } else if ( signupForm['signup-name'].value.includes("<") || signupForm['signup-name'].value.includes("'") ){

        signupForm.querySelector('.error').innerHTML =
            "Sorry, you cannot input the following characters in your name : ' and <";

    } else if ( signupForm['signup-aboutMe'].value.includes("<") || signupForm['signup-aboutMe'].value.includes(">") ){

        signupForm.querySelector('.error').innerHTML =
            "Sorry, you cannot input the following characters in the 'about you' section : > and <";

    } else {

       // sign-up the user & add firestore data
        auth.createUserWithEmailAndPassword(email, password).then(cred => {

            //Save the aboutMe info of the new user in the 'users' collection
            return db.collection('users').doc(cred.user.uid).set({
                aboutMe: signupForm['signup-aboutMe'].value,
                name: signupForm['signup-name'].value,
                totalNbEvents: 0,
            });

        }).then(() => {

            var user = auth.currentUser;
            //Update the displayName of the new user
            user.updateProfile({
                displayName: signupForm['signup-name'].value,
                //photoURL: "https://example.com/jane-q-user/profile.jpg"
            }).then(function() {
                //Update the name in the "account" section
                setupUI(user);
            }).catch(function(error) {
                // An error happened.
            });


            const modal = document.querySelector('#modal-signup');
            //Close the modal after signing in
            M.Modal.getInstance(modal).close();
            //Clear the sign up fields
            signupForm.reset();
            signupForm.querySelector('.error').innerHTML = ''
        }).catch(err => {
            signupForm.querySelector('.error').innerHTML = err.message;
        });
    }
});


//Logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});


//Login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    //log the user in
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // close the sign-up modal & reset form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        //Clear the logging fields
        loginForm.reset();
        loginForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message;
    });
});







