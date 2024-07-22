import { app, auth } from "../app/firebaseConfig";
import { getDatabase, ref, get } from "firebase/database";

class Config {

    async getWebsiteConfig() {
        return new Promise(async (resolve, reject) => {
            const database = getDatabase(app);
            try {
                const webSitePath = `website`;
                const snapshot = await get(ref(database, webSitePath));
                if (snapshot.exists()) {
                    resolve(snapshot.val());
                } else {
                    resolve(null);
                }
            } catch (error) {
                console.error("Error reading data: ", error);
                reject(error);
            }
        });
    }
}

export default Config;