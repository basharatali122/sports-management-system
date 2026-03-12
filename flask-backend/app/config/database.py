# from pymongo import MongoClient
# import os
# from dotenv import load_dotenv

# load_dotenv()

# MONGO_URL = os.getenv('MONGO_URL')

# client = None
# db = None

# def connect_db():
#     global client, db
#     try:
#         client = MongoClient(MONGO_URL)
#         db = client.get_default_database()
#         print("✅ Connected to Database")
#     except Exception as e:
#         print(f"❌ Database Connection error: {e}")

# def get_db():
#     return db



from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv('MONGO_URL')

client = None
db = None

def connect_db():
    global client, db
    try:
        client = MongoClient(MONGO_URL)
        db = client.get_default_database()
        print("✅ Connected to Database")
    except Exception as e:
        print(f"❌ Database Connection error: {e}")

def get_db():
    return db