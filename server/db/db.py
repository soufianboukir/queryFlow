from pymongo import MongoClient
import certifi
import os

uri = os.getenv("MONGO_URI")

client = MongoClient(uri, tlsCAFile=certifi.where())
db = client["oauth_db"]
#history = db["histtory"]
