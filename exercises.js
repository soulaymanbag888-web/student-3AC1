import { db } from './firebase.js';
import { collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { checkAuthState, getCurrentUserData } from './auth.js';

// Load exercises from Firebase
export function loadExercises() {
    const exercisesContainer = document.getElementById('exercisesContainer');
    const noExercisesMessage = document.getElementById('noExercisesMessage');

    if (!exercisesContainer) {
        console.error('Exercises container not found');
        return;
    }

    // Query exercises collection ordered by date
    const exercisesQuery = query(collection(db, "exercises"), orderBy('date', 'desc'));

    // Listen for real-time updates
    onSnapshot(exercisesQuery, (snapshot) => {
        const exercises = [];
        
        snapshot.forEach((doc) => {
            exercises.push({
                id: doc.id,
                ...doc.data()
            });
        });

        if (exercises.length === 0) {
            // Show message when no exercises exist
            if (noExercisesMessage) {
                noExercisesMessage.style.display = 'block';
            }
            exercisesContainer.innerHTML = '';
        } else {
            // Hide the no exercises message
            if (noExercisesMessage) {
                noExercisesMessage.style.display = 'none';
            }
            
            // Display exercises
            displayExercises(exercises);
        }
    }, (error) => {
        console.error("Error loading exercises:", error);
        exercisesContainer.innerHTML = '<p class="error-message">حدث خطأ في تحميل التمارين</p>';
    });
}

// Display exercises in the container
function displayExercises(exercises) {
    const exercisesContainer = document.getElementById('exercisesContainer');
    exercisesContainer.innerHTML = '';

    exercises.forEach((exercise) => {
        const exerciseCard = document.createElement('div');
        exerciseCard.className = 'exercise-card';
        
        // Format date
        const date = exercise.date ? new Date(exercise.date).toLocaleDateString('ar-SA') : '';
        
        exerciseCard.innerHTML = `
            <h3 class="exercise-title">${exercise.title || 'بدون عنوان'}</h3>
            <p class="exercise-description">${exercise.description || 'لا يوجد وصف'}</p>
            <span class="exercise-date">${date}</span>
        `;
        
        exercisesContainer.appendChild(exerciseCard);
    });
}

// Check authentication and load exercises
export function initExercisesPage() {
    checkAuthState((state) => {
        if (!state.loggedIn) {
            window.location.href = 'login.html';
            return;
        }
        loadExercises();
    });
}
