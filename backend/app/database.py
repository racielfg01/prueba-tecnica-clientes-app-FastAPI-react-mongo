import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DATABASE_NAME = os.environ.get('DATABASE_NAME', 'innovasoft_db')

class MongoDB:
    client: AsyncIOMotorClient = None
    database = None

mongodb = MongoDB()

async def connect_to_mongo():
    try:
        mongodb.client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=5000)
        await mongodb.client.admin.command('ping')
        mongodb.database = mongodb.client[DATABASE_NAME]
        print(f"✅ Connected to MongoDB: {MONGO_URL}")
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        mongodb.client = None
        mongodb.database = None

async def close_mongo_connection():
    if mongodb.client:
        mongodb.client.close()
        print("Disconnected from MongoDB")