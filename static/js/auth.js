import { database, auth } from './firebase-config.js';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Get user data by user ID
export async function getUserData(userId) {
    const userRef = doc(database, 'users', userId);
    try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error retrieving user data:", error);
        throw error; 
    }
}

// Verify the user's existence and credentials
export async function verifyUserCredentials(email, password) {
    const userId = await getUserIdByEmail(email);
    const userData = await getUserData(userId);
    
    if (userData) {
        return userData.password === password; // Return true if password matches
    }
    return false; // User does not exist
}

// Generate a unique user ID
export function generateUniqueId() {
    return 'user_' + new Date().getTime();
}

// Add a new user to the database
export async function addUserToDatabase(email, password) {
    if (!email || !password) {
        throw new Error("Email and password must be provided.")
    }
    const userId = generateUniqueId();
    const userRef = doc(database, 'users', userId);
    
    try {
        await setDoc(userRef, {
            email: email,
            password: password,
        });
        return userId; // Return new userId
    } catch (error) {
        console.error("Error adding user to database:", error);
        throw error; // Propagate error
    }
}

// Signup form submission
export async function signupFormSubmit() {
    const signupForm = document.getElementById('signupForm');
    
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(signupForm);
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Check for undefined or empty email and password
        if (!email || !password) {
            console.error("Email or password is missing.");
            // Optionally show an error message to the user
            return;
        }
               
        try {
            // Check if user already exists
            const userId = await getUserIdByEmail(email);
            const credentialsMatch = await verifyUserCredentials(email, password);
            if (credentialsMatch) {
                throw new Error("Account with this email already exists.");
            }
        } catch (error) {
            if (error.message === "User not found. Please sign up.") {
                // User doesn't exist; add new user to the database
                await addUserToDatabase(email, password);
                window.location.href = '/login';
            } else {
                handleError(error);
            }
        }
    });
}

// Handle login
export async function handleLogin(email, password) {
    try {
        const userExists = await verifyUserCredentials(email, password);
        const auth = getAuth();

        if (userExists) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    window.location.href = "/home.html"; // Redirect to home/modify with url later
                }
            });
        } else {
            throw new Error("Login failed. Check your credentials.");
        }
    } catch (error) {
        handleError(error);
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
