import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config"

export const getUserDetails = () => {
    return new Promise((resolve , reject ) => {
        const unsubscribe = auth.onAuthStateChanged((userCred) => {
            if(userCred){
                const userData = userCred.providerData[0];
                console.log(userData);
                const unsubscribe = onSnapshot(doc(db , 'users', userData?.uid) , (_doc) => {
                    // fetching the data
                    if(_doc.exists()){
                        resolve(_doc.data())
                    }
                    else{
                        setDoc(doc(db , 'users' , userData?.uid) , userData /* data from line 8 */ ).then(() => {
                            resolve(userData);

                        }) 
                    }
                })
                return unsubscribe;
            }

            else{
                reject(new Error("User is not authenticated"));
            }

            // make sure to unsubscribe from the listener to prevent the memory leaks

            unsubscribe();
        })
    })
}   


export const getTemplates = () => {
    return new Promise((resolve , reject) => {
        const templateQuery = query(
            collection(db , "templates"),
            orderBy("timestamp" , "asc")
        )


        const unsubscribe = onSnapshot(templateQuery , (querySnap) => {
            const templates = querySnap.docs.map((doc) => doc.data());
            resolve(templates);

        })

        return unsubscribe;
    })


}


/* 1 .The function getUserDetails is defined as an asynchronous function that returns a Promise. This allows it to perform asynchronous operations and resolve or reject the Promise based on the outcome.
2. Inside the function, a new Promise is created using the new Promise constructor. This Promise will be resolved or rejected based on the authentication state and the availability of user data in Firestore.
3 .The auth.onAuthStateChanged listener is used to monitor the authentication state changes. It takes a callback function that will be triggered whenever the authentication state changes.
4 .Within the callback function of onAuthStateChanged, the userCred parameter represents the current authentication state. If userCred is truthy (i.e., the user is authenticated), the code proceeds to fetch the user data from Firestore.
5 . The userCred.providerData[0] expression retrieves the provider data of the authenticated user. This typically contains information about the user's authentication provider, such as their UID.
6 .The onSnapshot function from Firestore is used to listen for changes in the user's data stored in the "users" collection in Firestore. The doc(db, 'users', userData?.uid) expression creates a reference to the user's document in Firestore, where userData?.uid is the UID of the authenticated user.
7. Inside the callback function of onSnapshot, the code checks if the user's document exists in Firestore using _doc.exists(). If the document exists, it resolves the Promise with the user data retrieved from Firestore (_doc.data()).
8. If the user's document does not exist in Firestore, the code uses the setDoc function to create a new document with the user's data (userData) in the "users" collection. After successfully creating the document, it resolves the Promise with the userData.
9. If the userCred is falsy (i.e., the user is not authenticated), the code rejects the Promise with an error message "User is not authenticated".
10. The unsubscribe function is called to clean up the listeners and prevent memory leaks. It is important to unsubscribe from the listeners when they are no longer needed to avoid unnecessary memory consumption. */