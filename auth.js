import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Validate student ID starts with 102568
function validateStudentId(studentId) {
    return studentId.startsWith('102568');
}

// Register new user
export async function registerUser(fullName, studentId, password) {
    try {
        // Validate student ID
        if (!validateStudentId(studentId)) {
            throw new Error('رقم الطالب يجب أن يبدأ بـ 102568');
        }

        // Create email from student ID
        const email = `${studentId}@student.edu`;

        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save additional user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
            fullName: fullName,
            studentId: studentId,
            email: email,
            createdAt: new Date().toISOString(),
            completedExercises: 0
        });

        return { success: true, user: user };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, error: error.message };
    }
}

// Login user
export async function loginUser(studentId, password) {
    try {
        const email = `${studentId}@student.edu`;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: error.message };
    }
}

// Logout user
export async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        return { success: false, error: error.message };
    }
}

// Check if user is logged in
export function checkAuthState(callback) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.exists() ? userDoc.data() : null;
            callback({ loggedIn: true, user: user, userData: userData });
        } else {
            callback({ loggedIn: false, user: null, userData: null });
        }
    });
}

// Get current user data
export async function getCurrentUserData() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    resolve({ user: user, userData: userDoc.data() });
                } else {
                    resolve({ user: user, userData: null });
                }
            } else {
                resolve({ user: null, userData: null });
            }
        });
    });
}
