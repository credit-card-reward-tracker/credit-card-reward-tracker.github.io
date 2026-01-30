/**
 * Authentication Module
 * Handles Google sign-in with Firebase and cloud sync
 */

const Auth = (function () {
    // Firebase configuration - REPLACE WITH YOUR OWN CONFIG
    const firebaseConfig = {
        apiKey: "AIzaSyD7ugL_7stq3j_shG9mgONKb6g2D8ZaN5w",
        authDomain: "cc-reward-tracker.firebaseapp.com",
        projectId: "cc-reward-tracker",
        storageBucket: "cc-reward-tracker.firebasestorage.app",
        messagingSenderId: "761265744241",
        appId: "1:761265744241:web:ba359bb0c74525e1d62ed0",
        measurementId: "G-JM5YW1XTJG"
    };

    let app = null;
    let auth = null;
    let db = null;
    let currentUser = null;
    let unsubscribeSnapshot = null;

    // Callbacks
    let onAuthStateChangedCallback = null;
    let onRewardsUpdatedCallback = null;

    /**
     * Check if Firebase is configured
     */
    function isConfigured() {
        return firebaseConfig.apiKey !== "YOUR_API_KEY";
    }

    /**
     * Initialize Firebase
     */
    function init() {
        if (!isConfigured()) {
            console.log('Firebase not configured. Using local storage only.');
            console.log('To enable cloud sync, update auth.js with your Firebase config.');
            return false;
        }

        try {
            // Initialize Firebase
            app = firebase.initializeApp(firebaseConfig);
            auth = firebase.auth();
            db = firebase.firestore();

            // Listen for auth state changes
            auth.onAuthStateChanged(handleAuthStateChanged);

            console.log('Firebase initialized successfully');
            return true;
        } catch (error) {
            console.error('Firebase initialization error:', error);
            return false;
        }
    }

    /**
     * Handle auth state changes
     */
    function handleAuthStateChanged(user) {
        currentUser = user;

        if (user) {
            console.log('User signed in:', user.email);
            // Start listening to user's rewards in Firestore
            subscribeToRewards();
        } else {
            console.log('User signed out');
            // Stop listening to Firestore
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
                unsubscribeSnapshot = null;
            }
        }

        // Notify callback
        if (onAuthStateChangedCallback) {
            onAuthStateChangedCallback(user);
        }
    }

    /**
     * Sign in with Google
     */
    async function signInWithGoogle() {
        if (!isConfigured()) {
            alert('Firebase is not configured. Please update auth.js with your Firebase config.');
            return null;
        }

        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await auth.signInWithPopup(provider);
            return result.user;
        } catch (error) {
            console.error('Sign in error:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                // User closed popup, not an error
                return null;
            }
            throw error;
        }
    }

    /**
     * Sign out
     */
    async function signOut() {
        if (auth) {
            await auth.signOut();
        }
    }

    /**
     * Get current user
     */
    function getCurrentUser() {
        return currentUser;
    }

    /**
     * Check if user is signed in
     */
    function isSignedIn() {
        return currentUser !== null;
    }

    /**
     * Subscribe to real-time rewards updates from Firestore
     */
    function subscribeToRewards() {
        if (!currentUser || !db) return;

        const userDocRef = db.collection('users').doc(currentUser.uid);

        unsubscribeSnapshot = userDocRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const rewards = data.rewards || [];

                // Notify callback with updated rewards
                if (onRewardsUpdatedCallback) {
                    onRewardsUpdatedCallback(rewards);
                }
            } else {
                // Create user document if it doesn't exist
                userDocRef.set({ rewards: [], createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            }
        }, (error) => {
            console.error('Firestore snapshot error:', error);
        });
    }

    /**
     * Save rewards to Firestore
     */
    async function saveRewardsToCloud(rewards) {
        if (!currentUser || !db) {
            return false;
        }

        try {
            const userDocRef = db.collection('users').doc(currentUser.uid);
            await userDocRef.set({
                rewards: rewards,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                email: currentUser.email
            }, { merge: true });
            return true;
        } catch (error) {
            console.error('Error saving to Firestore:', error);
            return false;
        }
    }

    /**
     * Load rewards from Firestore (one-time fetch)
     */
    async function loadRewardsFromCloud() {
        if (!currentUser || !db) {
            return null;
        }

        try {
            const userDocRef = db.collection('users').doc(currentUser.uid);
            const doc = await userDocRef.get();

            if (doc.exists) {
                const data = doc.data();
                return data.rewards || [];
            }
            return [];
        } catch (error) {
            console.error('Error loading from Firestore:', error);
            return null;
        }
    }

    /**
     * Migrate local rewards to cloud on first sign-in
     */
    async function migrateLocalToCloud(localRewards) {
        if (!currentUser || !db || localRewards.length === 0) {
            return false;
        }

        try {
            // Check if user already has rewards in cloud
            const cloudRewards = await loadRewardsFromCloud();

            if (cloudRewards && cloudRewards.length === 0) {
                // No cloud rewards, migrate local
                await saveRewardsToCloud(localRewards);
                console.log('Migrated local rewards to cloud');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Migration error:', error);
            return false;
        }
    }

    /**
     * Set callback for auth state changes
     */
    function setOnAuthStateChanged(callback) {
        onAuthStateChangedCallback = callback;
    }

    /**
     * Set callback for rewards updates from cloud
     */
    function setOnRewardsUpdated(callback) {
        onRewardsUpdatedCallback = callback;
    }

    // Public API
    return {
        init,
        isConfigured,
        signInWithGoogle,
        signOut,
        getCurrentUser,
        isSignedIn,
        saveRewardsToCloud,
        loadRewardsFromCloud,
        migrateLocalToCloud,
        setOnAuthStateChanged,
        setOnRewardsUpdated
    };
})();
