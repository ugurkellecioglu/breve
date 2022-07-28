import {db} from './firebase';
import { doc, setDoc,getDoc } from "firebase/firestore"; 
// Add a new document in collection "cities"

exports.handler = async function(event, context) {
  //redirect to google
 try {
    const hash = event.path.split("/v/")[1];
    const docRef = doc(db, "urls", hash);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return {
            statusCode: 301,
            headers: {
                "Location": docSnap.data().givenUrl
            }
        };
        }
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: "Not found"
            })
        };

 } catch (error) {
    return {
        statusCode: 500,
        body: JSON.stringify(error)
    };
 }
    
}
// END
