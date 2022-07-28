import {db} from './firebase';
import { doc, setDoc,getDoc } from "firebase/firestore"; 
// Add a new document in collection "cities"

exports.handler = async function(event, context) {
    // get body
    const body = JSON.parse(event.body);
    const docRef = doc(db, "urls", body.hash);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return {
            statusCode: 409,
            body: JSON.stringify(docSnap.data())
        };
      } 

   try {
    await setDoc(doc(db, "urls", body.hash), body);
    return {
        statusCode: 200,
        body: JSON.stringify(body)
    };
   } catch (error) {
    return {
        statusCode: 500,
        body: JSON.stringify(error)
    };
   }
}
// END
