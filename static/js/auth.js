import { firebaseConfig, database, auth } from './firebase-config.js';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { displayLoggedInFeatures, hideMenuFeatures } from './index.js';

export async function getUserDataByEmail(email) {
    try {
        const userQuery = query(collection(database, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error retrieving user data by email:", error);
        throw error;
    }
}
// Function obtains the current user's id
export function getCurrentUserId() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        // Return the user's unique ID (userId)
        return user.uid;
    } else {
        console.warn("No user is currently logged in.");
        return null;
    }
}
// Function to get user info based on userId
export async function getUserById(userId) {
    try {
        const userQuery = query(collection(database, 'users'), where('userId', '==', userId));
        const querySnapshot = await getDocs(userQuery);
        
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error retrieving user:", error);
        throw error;
    }
}
// Function to get all users' data
export async function getAllUsersData() {
    try {
        const usersCollection = collection(database, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const usersData = [];
        querySnapshot.forEach((doc) => {
            usersData.push(doc.data());
        });
        return usersData;
    } catch (error) {
        console.error("Error retrieving all users' data:", error);
        throw error;
    }
}

// Verify the user's existence and credentials
export async function verifyUserCredentials(email, password) {
    const userData = await getUserDataByEmail(email);
    
    if (userData) {
        return userData.email === email && userData.password === password;
    }
    else {
        return false;
    }
}

// Generate a unique user ID
export function generateUniqueId() {
    return 'user_' + new Date().getTime();
}

// Add a new user to the database
export async function addUserToDatabase(email, password, day, month, year, firstName, lastName, host) {
    if (!email || !password) {
        throw new Error("Email and password must be provided.");
    }

    const auth = getAuth();

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;
        const userBirthdate = [day, month, year];
        const userRef = doc(database, 'users', userId);
        
        await setDoc(userRef, {
            email: email,
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            userBirthdate: userBirthdate,
            host: host,
        });

        return userId;
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
}

// Signup form submission
export async function signupFormSubmit() {

    const signupForm = document.getElementById('signupForm');
    
        
        const formData = new FormData(signupForm);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const password = formData.get('password');

        const month = parseInt(formData.get('month'), 10);
        const day = parseInt(formData.get('day'), 10);
        const year = parseInt(formData.get('year'), 10);

        const host = formData.get('host') ? true : false;

        // Console log all the values to debug
        console.log({ email, password, firstName, lastName, day, month, year, host });

        // Check for undefined or empty email and password
        if (!email || !password || !firstName || !lastName || !day || !month || !year) {
            console.error("Field is missing.");
            const dialogPopup = document.getElementById('errorMatch');
            const closeButton = document.getElementById('closeModal');
            closeButton.onclick = () => {
                dialogPopup.style.display = 'none';
            };
            return;
        }
        // Check if user already exists
        const credentialsMatch = await verifyUserCredentials(email, password);
        if (credentialsMatch) {
            // User already exists, show modal
            const modalPopup = document.getElementById('errorModal');
            modalPopup.style.display = 'flex';
            const exitButton = document.getElementById('closeModal');
            exitButton.onclick = () => {
                modalPopup.style.display = 'none';
            };
        } else {
            // User does not exist; proceed to add data to database and redirect to home
            await addUserToDatabase(email, password, day, month, year, firstName, lastName, host);
            window.location.href = '/home';
        }
}

// Handle login
export async function handleLogin(email, password) {
    const auth = getAuth();
    try {
        const credentialsLogin = await signInWithEmailAndPassword(auth, email, password);
        console.log("Attempting to log in with:", { email, password });

        if (credentialsLogin) {
            console.log("Login successful, redirecting...");
            window.location.href = '/home';
        } else {
            console.error("Login failed, no credentials returned.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        throw new Error("Login failed. Check your credentials.");
    }
}

// Error handling function
export function signupError(error) {
    console.error("An error occurred:", error);

    // Show error modal if account already exists
    const dialogPopup = document.getElementById('errorModal');
    dialogPopup.textContent = error.message;
    dialogPopup.style.display = 'flex';

    const closeButton = document.getElementById('closeModal');
    closeButton.onclick = () => {
        dialogPopup.style.display = 'none';
    };
}

//Verify in user is a host
export async function verifyHostUser(user) {
    if (!user || !user.email) {
        throw new Error("User must be provided and must have an email.");
    }

    try {
        // Retrieve user data using their email
        const userData = await getUserDataByEmail(user.email);

        if (userData) {
            // Check if the user is a host
            const isHost = userData.host;

            if (isHost) {
                console.log("User is a host.");
                return true;
            } else {
                console.log("User is not a host.");
                return false;
            }
        } else {
            console.error("No user data found for the provided email.");
            return false;
        }
    } catch (error) {
        console.error("Error verifying host user:", error);
        throw error;
    }
}


//Handle displayed menu items
export function hideMenuItems() {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in.
            console.log("User is signed in:", user);

            try {
                const isHost = await verifyHostUser(user);

                if (isHost) {
                    // Display host-specific features
                    console.log("Displaying host features.");
                    displayLoggedInFeatures(user, true);
                } else {
                    // Display regular user features
                    console.log("Displaying regular user features.");
                    displayLoggedInFeatures(user, false);
                }
            } catch (error) {
                console.error("Error verifying user:", error);
            }
        } else {
            // User is signed out.
            console.log("No user is signed in.");
            hideMenuFeatures();
        }
    });
}


// Function to handle user logout
export async function logoutUser() {
    const auth = getAuth();
    try {
        await signOut(auth);
        console.log("User logged out successfully.");
        // Redirect to the homepage or login page
        window.location.href = '/login'; // Adjust the redirect as needed
    } catch (error) {
        console.error("Error logging out:", error);
        // Optionally display an error message to the user
    }
}
