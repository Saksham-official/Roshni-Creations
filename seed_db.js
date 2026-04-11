import fs from 'fs';
import { MongoClient } from 'mongodb';

async function seed() {
    const url = "mongodb+srv://parv240385_db_user:malikji0002@cluster0.h0r1tl3.mongodb.net/roshni_creations?appName=Cluster0";
    const client = new MongoClient(url);

    try {
        await client.connect();
        const database = client.db('roshni_creations');
        const products_collection = database.collection('products');
        
        const dataPath = 'backend/app/data/products.json';
        if (fs.existsSync(dataPath)) {
            const fileData = fs.readFileSync(dataPath, 'utf-8');
            const parsedData = JSON.parse(fileData);
            const products = parsedData.products || [];
            
            if (products.length > 0) {
                await products_collection.deleteMany({});
                await products_collection.insertMany(products);
                console.log(`Successfully seeded ${products.length} products to database 'roshni_creations' collection 'products' using new connection URL.`);
            } else {
                console.log("No products found in the json.");
            }
        } else {
            console.log("Product json not found.");
        }
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await client.close();
    }
}
seed();
