from flask import Flask, render_template, flash, request, redirect, url_for, session
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from flask_sqlalchemy import SQLAlchemy
from flask import jsonify

from flask_migrate import Migrate
from sqlalchemy import text

app = Flask(__name__)

app.config['SECRET_KEY'] = "12345"
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://admin:Taha.Asif@localhost/flask_blog_project'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Turn off Flask-SQLAlchemy event tracking
db = SQLAlchemy(app)
migrate = Migrate(app, db)


# Model
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    birthday = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer(), nullable=False)
    description = db.Column(db.String(250), nullable=True)


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/profile')
def profile():
    user_name = session.get('user_name')
    email = session.get('email')
    if user_name and email:
        return render_template('user.html', user=user_name)
    else:
        flash("You need to log in first.", 'warning')
        return redirect(url_for('home'))


@app.route('/logout')
def logout():
    session.pop('user_name', None)
    session.pop('email', None)
    flash('You have been logged out', 'info')
    return redirect(url_for('home'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.json
        email = data.get('email')
        password = data.get('password')

        user = Users.query.filter_by(email=email, password=password).first()

        if user:
            session['user_name'] = user.name
            session['email'] = user.email

            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Invalid email or password'})
    else:
        # Handle other HTTP methods if needed
        return redirect(url_for('home'))


@app.route('/register',  methods=['POST'])
def register():
    if request.method == 'POST':
        data = request.json  # Access JSON data using request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        birthday = data.get('birthday')
        age = data.get('age')
        description = data.get('description')

        try:
            new_user = Users(name=name, email=email, password=password, birthday=birthday, age=age,
                             description=description)
            db.session.add(new_user)
            db.session.commit()

            # Set session variables
            session['user_name'] = name
            session['email'] = email

            # Return success flag
            return jsonify({'success': True})
        except Exception as e:
            # Handle the exception and return failure flag
            return jsonify({'success': False, 'error': str(e)})
    else:
        # Handle other HTTP methods if needed
        return redirect(url_for('home'))


@app.errorhandler(404)
def page_not_found(error):
    return render_template("error_404.html")


@app.errorhandler(500)
def server_error(error):
    return render_template("error_500.html")


app.run(debug=True)
