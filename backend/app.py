from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import numpy as np
import pandas as pd
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from flask_pymongo import PyMongo
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)
SECRET_KEY = 'S3CRET'
app.config['MONGO_URI'] = 'mongodb+srv://chandupk112244:chandu1112@cluster0.1ifrdwe.mongodb.net/Book_Recommendation'
mongo = PyMongo(app)

popular = pd.read_pickle('popular.pkl')
model = pd.read_pickle('model.pkl')
books = pd.read_pickle('books.pkl')
book_pivot = pd.read_pickle('book_pivot.pkl')

bookname = list(popular['Book-Title'].values)
author = list(popular['Book-Author'].values)
image = list(popular['Image-URL-M'].values)
votes = list(popular['num_ratings'].values)
rating = list(popular['avg_rating'].values)

item = []
for i in range(len(bookname)):
    temp = []
    temp.append(bookname[i])
    temp.append(author[i])
    temp.append(image[i])
    temp.append(rating[i])
    item.append(temp)




# Global Authentication Middleware
@app.before_request
def before_request():
    if request.path in ['/register', '/login']:
        return
    if request.method.lower()=='options':
        return Response()

    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Missing token'}), 401

    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        request.current_user = decoded_token['username']
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired. Please Login!'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401


# User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = generate_password_hash(data.get('password'))
    expiration_time=datetime.utcnow() + timedelta(hours=1)

    if mongo.db.users.find_one({'username': username}):
        return jsonify({'message': 'User already exists, please login'}), 400

    mongo.db.users.insert_one({'username': username, 'password': password})
    token = jwt.encode({'username': username,
                        'exp':expiration_time}, SECRET_KEY, algorithm='HS256')

    return jsonify({'message': 'User registered successfully', 'access_token': token}), 201

# User Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    expiration_time=datetime.utcnow() + timedelta(hours=1)
    user = mongo.db.users.find_one({'username': username})
    if user and check_password_hash(user['password'], password):
        token = jwt.encode({'username': username,
                            'exp':expiration_time}, SECRET_KEY, algorithm='HS256')
        return jsonify({'message': 'Login successful', 'access_token': token}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401



@app.route('/user/me', methods=['OPTIONS', 'GET'])
def check():
    if request.method == 'GET':
        return jsonify({'username': request.current_user}), 200

@app.route('/home', methods=['OPTIONS', 'GET'])
def home():
    if request.method == 'GET':
        return jsonify({'item': item}), 200

@app.route('/books', methods=['GET'])
def search():
    search_query = request.args.get('search').replace(' ', '').replace(".", "")
    if search_query:
        filtered_books = books[(books['title'].str.replace(".", "").str.replace(' ', '').str.contains(search_query, case=False)) | (books['author'].str.replace(".", "").str.replace(' ', '').str.contains(search_query, case=False))].drop_duplicates(subset='title').to_dict(orient='records')
        if len(filtered_books) > 30:
            modified = filtered_books[:30]
            return jsonify(modified)
        else:
            return jsonify(filtered_books)

@app.route('/books/<bookname>')
def recommend(bookname):
    if bookname not in book_pivot.index:
        return jsonify({"message": "This book is not so popular to recommend. Please select some other book"})

    def recommend_book(book_name):
        book_id = np.where(book_pivot.index == book_name)[0][0]
        distance, suggestion = model.kneighbors(book_pivot.iloc[book_id, :].values.reshape(1, -1), n_neighbors=9)
        data = []
        for i in suggestion[0]:
            item = []
            temp_df = books[books['title'] == book_pivot.index[i]]
            item.extend(list(temp_df.drop_duplicates('title')['title'].values))
            item.extend(list(temp_df.drop_duplicates('title')['author'].values))
            item.extend(list(temp_df.drop_duplicates('title')['image_url'].values))
            item.extend(list(temp_df.drop_duplicates('title')['avg_rating'].values))
            data.append(item)
        return data

    recommend = recommend_book(bookname)
    return jsonify({"recommend": recommend})
# Add to Favorite Route
@app.route('/favourites/add', methods=['POST'])
def add_to_favorites():
    data = request.get_json()
    book_title = data.get('book_title')
    book_author = data.get('book_author')
    book_image=data.get('book_image')

    # Get the current user
    current_user = request.current_user

    # Check if the book is already in favorites
    if mongo.db.favorites.find_one({'username': current_user, 'book_title': book_title}):
        return jsonify({'message': 'Book already exists in favorites'}), 400

    # Insert the book into favorites
    mongo.db.favorites.insert_one({'username': current_user, 'book_title': book_title, 'book_author': book_author,'book_image':book_image})

    return jsonify({'message': 'Book added to favorites successfully'}), 201
# Retrieve Favorites Route
@app.route('/favourites', methods=['GET'])
def get_favorites():
    # Get the current user
    current_user = request.current_user

    # Retrieve favorite books for the current user
    user_favorites = mongo.db.favorites.find({'username': current_user}, {'_id': 0, 'username': 0})

    favorite_books = []

    for fav in user_favorites:
        favorite_books.append({'title': fav['book_title'], 'author': fav['book_author'],'book_image':fav['book_image']})

    return jsonify({'favorites': favorite_books}), 200


@app.route('/favourites/delete', methods=['POST'])
def delete_from_favorites():
    data = request.get_json()
    book_title = data.get('book_title')

    # Get the current user
    current_user = request.current_user

    # Check if the book exists in favorites
    existing_book = mongo.db.favorites.find_one({'username': current_user, 'book_title': book_title})

    if existing_book:
        # If the book exists, delete it from favorites
        mongo.db.favorites.delete_one({'username': current_user, 'book_title': book_title})
        return jsonify({'message': 'Book removed from favorites successfully'}), 200
    else:
        # If the book does not exist, return an error message
        return jsonify({'message': 'Book not found in favorites'}), 404

if __name__ == '__main__':
    app.run(debug=True)