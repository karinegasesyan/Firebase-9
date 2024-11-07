import {initializeApp} from 'firebase/app';
import {getFirestore, collection, onDocs, onSnapshot, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, getDoc, updateDoc} from 'firebase/firestore';
import {getAuth, createUserWithEmailAndPassword,signOut, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA-DKvUCXaExE3CXG5HgENk3bmRrDKgC6A",
    authDomain: "fir-9-dojp.firebaseapp.com",
    projectId: "fir-9-dojp",
    storageBucket: "fir-9-dojp.firebasestorage.app",
    messagingSenderId: "716380498166",
    appId: "1:716380498166:web:d887219d8281ea84da64d7",
    measurementId: "G-2K4WVVM51C"
  };

  // init firebase app
  initializeApp(firebaseConfig);

  //init services
  const db = getFirestore();
  const auth = getAuth();


  //collection ref
  const colRef = collection(db, 'Books');

  //queries
  const q = query(colRef, orderBy('createdAt'));

  //get collection data 

//   getDocs(colRef)
//     .then((snapshot) => {
//         // console.log(snapshot.docs);
//         let listedBooks = [];
//         snapshot.docs.forEach((doc) => {
//             listedBooks.push({ ...doc.data(), id: doc.id })
//         })
//         console.log(listedBooks);
//     })
//     .catch(error => {
//         console.log(error.message);
//     })


// real time collection data
const unsubCol = onSnapshot(colRef, (snapshot) => {
    // onSnapshot(q, (snapshot) => {
        let listedBooks = [];
        snapshot.docs.forEach((doc) => {
            listedBooks.push({ ...doc.data(), id: doc.id })
        })
        console.log(listedBooks);
    })

    //adding documents
    const addBookForm = document.querySelector('.add');
    addBookForm.addEventListener('submit', (e) => {
        e.preventDefault();

        addDoc(colRef, {
            title: addBookForm.title.value,
            author: addBookForm.author.value,
            createAt: serverTimestamp()
        })
        .then(() => {
            addBookForm.reset();
        })
        .catch(error => {
            console.log('error');
        })
    });

    //deleting documents
    const deleteBookForm = document.querySelector('.delete');
    deleteBookForm.addEventListener('submit', (e) => {
        e.preventDefault();

       const docRef = doc(db, 'Books', deleteBookForm.id.value);
       deleteDoc(docRef)
       .then(() => {
        deleteBookForm.reset();
       })
       .catch(error =>{
        console.log('error');
       })

    });

    //get a single document
    const docRef = doc(db, 'Books', '78YFvfXSX1MKpSTvhscp');

    getDoc(docRef)
        .then((doc) => {
            console.log(doc.data(), doc.id);
        })
        .catch(error => {
            console.log('error');
        })

    const unsubDoc = onSnapshot(docRef, (doc) => {
        console.log(doc.data(), doc.id);
    })

    //updating document

    const updateForm = document.querySelector('.update');
    updateForm.addEventListener('submit', (e) => {
        e.preventDefault;
        const docRef = doc(db, 'Books', updateForm.id.value);
        updateDoc(docRef, {
            title: 'this is the updated title'
        })
        .then(() => {
            updateForm.reset();
        })
        .catch(error => {
            console.log('error');
        })
    })

    //signing users up
    const signupForm = document.querySelector('.signup');
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = signupForm.email.value;
        const password = signupForm.password.value;
        createUserWithEmailAndPassword(auth, email, password)
            .then((cred) => {
               // console.log('user created', cred.user);
                signupForm.reset();
            }).catch((error) => {
                console.log(error.message);
            })
    })

    //logging & logging out
    const logoutButton = document.querySelector('.logout');
    logoutButton.addEventListener('click', () => {
        signOut(auth)
        .then(() => {
           //console.log('the user signed out'); 
        })
        .catch((error) => {
            console.log(error.message);
        })

    })

    const loginForm = document.querySelector('.login');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            //console.log('user logged in', cred.user);
        })
        .catch((error) => {
            console.log(error.message);
        })

    })

    //subscribing to auth changes
    const unsubAuth = onAuthStateChanged( auth, (user) => {
        console.log('user status changed:', user);
    })

    
    //unsubscribing from changes
    const unsubscribBtn = document.querySelector('.unsub');
    unsubscribBtn.addEventListener('click', () => {
        console.log('unsubscribing');
        // unsubCol();
        // unsubDoc();
        // unsubAuth();
    })