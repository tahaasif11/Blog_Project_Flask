from flask import Flask, render_template, flash, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from flask import jsonify
import config

from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail, Message

from flask_migrate import Migrate
from sqlalchemy import text

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

app.config['SECRET_KEY'] = config.SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://admin:Taha.Asif@localhost/flask_blog_project'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Turn off Flask-SQLAlchemy event tracking
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Configure your email settings here
MAIL_USERNAME = config.MAIL_USERNAME
MAIL_PASSWORD = config.MAIL_PASSWORD


app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 26
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = MAIL_USERNAME
app.config['MAIL_PASSWORD'] = MAIL_PASSWORD


mail = Mail(app)

# Initialize the serializer with your app's secret key
serializer = URLSafeTimedSerializer(app.secret_key)


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


@app.route('/forgot_password',  methods=['POST'])
def forgot_password():
    if request.method == 'POST':
        data = request.json
        email = data.get('email')

        token = serializer.dumps(email, salt='forgot-password')
        print(f'Token for {email}: {token}')

        subject = 'Password Reset Request'
        reset_link = url_for('reset_password', token=token, _external=True)
        body = f'Click the following link to reset your password: {reset_link}'

        # Create the MIMEText object for the email body
        msg = MIMEMultipart()
        msg.attach(MIMEText(body, 'plain'))

        # Set the email subject and recipients
        msg['Subject'] = subject
        msg['From'] = MAIL_USERNAME  # Replace with your email address
        msg['To'] = email

        # Use your SMTP server to send the email
        try:
            server = smtplib.SMTP('mail.tecspine.com', 26)
            server.starttls()
            server.login(MAIL_USERNAME, MAIL_PASSWORD)  # Replace with your email and password

            server.sendmail(MAIL_USERNAME, email, msg.as_string())
            server.quit()

            flash('Password reset link sent to your email. Please check your inbox.', 'success')
        except Exception as e:
            print(e)
            flash('Failed to send the reset email. Please try again later.', 'danger')

        return jsonify({'success': True})
    return render_template('home.html')


@app.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    try:
        email = serializer.loads(token, salt='forgot-password', max_age=3600)
    except Exception as e:
        print(e)
        flash('Invalid or expired token. Please try again.', 'danger')
        return redirect(url_for('home'))

    if request.method == 'GET':
        return render_template('reset_password.html',user_email=email)


@app.route('/update_reset_password', methods=['POST'])
def update_reset_password():
    if request.method == 'POST':
        data = request.json
        email = data.get('email')
        password = data.get('password')
        user = Users.query.filter_by(email=email).first()

        if user:
            user.password = password
            db.session.commit()
            flash('Password updated successfully')
            return jsonify({'success': True}), 200
        else:
            flash('Password not updated')
            return jsonify({'success': False, 'error': 'Password Not updated'}), 401




@app.route('/logout')
def logout():
    session.pop('user_name', None)
    session.pop('email', None)
    flash('You have been logged out', 'info')
    return redirect(url_for('home'))


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.json
        email = data.get('email')
        password = data.get('password')

        user = Users.query.filter_by(email=email, password=password).first()

        if user:
            session['user_name'] = user.name
            session['email'] = user.email

            # Set the user information in cookies
            resp = jsonify({'success': True})
            resp.set_cookie('user_name', user.name)
            resp.set_cookie('user_email', user.email)
            return resp
        else:
            return jsonify({'success': False, 'error': 'Invalid email or password'})
    else:
        return redirect(url_for('home'))


@app.route('/register',  methods=['POST'])
def register():
    if request.method == 'POST':
        data = request.json
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

            # Set the user information in cookies
            resp = jsonify({'success': True})
            resp.set_cookie('user_name', name)
            resp.set_cookie('user_email', email)
            return resp
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})
    else:
        return redirect(url_for('home'))


@app.errorhandler(404)
def page_not_found(error):
    return render_template("error_404.html")


@app.errorhandler(500)
def server_error(error):
    return render_template("error_500.html")


app.run(debug=True)
