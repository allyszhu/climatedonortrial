import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const initFirebase = async() => {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch(err){
  
    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     */
    if (!/already exists/u.test(err.message)) {
      // eslint-disable-next-line no-console
      console.error('Firebase admin initialization error', err.stack);
    }
  
  }
}


/*Attempts to authenticate a user with a given email and password.*/
export const signIn = async (email, password) => {
    initFirebase();   
    
    return firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
      console.log("Signed in!");
      return true, null;
    })
    .catch((error) => {
      
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error " + errorCode + ": " + errorMessage);
      return false, error
    });
};

export const signUp = async (userType, email, password,fullName, interests) => {
  initFirebase();

  return firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    let userId = user.uid;
    // userId -> user type, interests, etc. 
    // continue with sign up process, add fields (not username and password related) to our own firestore table.
    firebase.firestore().collection("users").doc(userId).set({
          fullName: fullName,
          email: email,
          userType: userType,
          interests: interests, 
          projectsDonatedTo: {}
      })
      .then(() => {
          console.log("Document successfully written!");
          return null;
      })
      .catch((error) => {
          console.error("Error writing document: ", error);
          return error;
      });
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
    console.log("Error " + errorCode + ": " + errorMessage);
    return error;
  });

}

async function getProjectDoc(projectId) {
  return firebase.firestore().collection('projects').doc(projectId).get()
  .then((projectDoc) => {
        if (projectDoc.exists) {
          return Promise.resolve(projectDoc);
        } else {
            // doc.data() will be undefined in this case
            return Promise.reject("no such document")
        }
  })
  .catch((err) => {
    console.log(err);
    return Promise.reject(err);
  });

}


export const getProjectsByDonor = async (userId) => {
  initFirebase();   

  return firebase.firestore().collection('users').doc(userId).get()
  .then(async (userDoc) => {
    if(userDoc.exists) {
      const projects = userDoc.data().projectsDonatedTo;
      if(projects) {
        const promises = Object.keys(projects).map(getProjectDoc)
      return Promise.allSettled(promises).
      then((results) => {
        return results.filter(x => x.status === "fulfilled").map(x => x.value);
      });
      } else {
        return []
      }
      
    } else {
      console.log("no such user");
      return [];
    }
    
  });
};


export default firebase;