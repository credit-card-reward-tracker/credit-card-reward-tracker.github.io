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
    let onCardsUpdatedCallback = null;

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
            // Start listening to user's data in Firestore
            subscribeToData();
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
     * Subscribe to real-time data updates from Firestore
     */
    function subscribeToData() {
        if (!currentUser || !db) return;

        const userDocRef = db.collection('users').doc(currentUser.uid);

        unsubscribeSnapshot = userDocRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const rewards = data.rewards || [];
                const cards = data.cards || [];

                // Notify callbacks with updated data
                if (onRewardsUpdatedCallback) {
                    onRewardsUpdatedCallback(rewards);
                }
                if (onCardsUpdatedCallback) {
                    onCardsUpdatedCallback(cards);
                }
            } else {
                // Create user document if it doesn't exist
                userDocRef.set({
                    rewards: [],
                    cards: [],
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
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
            console.error('Error saving rewards to Firestore:', error);
            return false;
        }
    }

    /**
     * Save cards to Firestore
     */
    async function saveCardsToCloud(cards) {
        if (!currentUser || !db) {
            return false;
        }

        try {
            const userDocRef = db.collection('users').doc(currentUser.uid);
            await userDocRef.set({
                cards: cards,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                email: currentUser.email
            }, { merge: true });
            return true;
        } catch (error) {
            console.error('Error saving cards to Firestore:', error);
            return false;
        }
    }

    /**
     * Save all data to Firestore
     */
    async function saveAllToCloud(rewards, cards) {
        if (!currentUser || !db) {
            return false;
        }

        try {
            const userDocRef = db.collection('users').doc(currentUser.uid);
            await userDocRef.set({
                rewards: rewards,
                cards: cards,
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
     * Load all data from Firestore (one-time fetch)
     */
    async function loadFromCloud() {
        if (!currentUser || !db) {
            return null;
        }

        try {
            const userDocRef = db.collection('users').doc(currentUser.uid);
            const doc = await userDocRef.get();

            if (doc.exists) {
                const data = doc.data();
                return {
                    rewards: data.rewards || [],
                    cards: data.cards || []
                };
            }
            return { rewards: [], cards: [] };
        } catch (error) {
            console.error('Error loading from Firestore:', error);
            return null;
        }
    }

    /**
     * Load rewards from Firestore (one-time fetch)
     */
    async function loadRewardsFromCloud() {
        const data = await loadFromCloud();
        return data ? data.rewards : null;
    }

    /**
     * Load cards from Firestore (one-time fetch)
     */
    async function loadCardsFromCloud() {
        const data = await loadFromCloud();
        return data ? data.cards : null;
    }

    /**
     * Migrate local data to cloud on first sign-in
     */
    async function migrateLocalToCloud(localRewards, localCards = []) {
        if (!currentUser || !db) {
            return false;
        }

        try {
            // Check if user already has data in cloud
            const cloudData = await loadFromCloud();

            if (cloudData) {
                const hasCloudRewards = cloudData.rewards && cloudData.rewards.length > 0;
                const hasCloudCards = cloudData.cards && cloudData.cards.length > 0;

                // Migrate local data if cloud is empty
                if (!hasCloudRewards && localRewards.length > 0) {
                    await saveRewardsToCloud(localRewards);
                    console.log('Migrated local rewards to cloud');
                }
                if (!hasCloudCards && localCards.length > 0) {
                    await saveCardsToCloud(localCards);
                    console.log('Migrated local cards to cloud');
                }
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

    /**
     * Set callback for cards updates from cloud
     */
    function setOnCardsUpdated(callback) {
        onCardsUpdatedCallback = callback;
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
        saveCardsToCloud,
        loadCardsFromCloud,
        migrateLocalToCloud,
        setOnAuthStateChanged,
        setOnRewardsUpdated,
        setOnCardsUpdated
    };
})();
