import { doc, onSnapshot, setDoc } from "firebase/firestore";
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