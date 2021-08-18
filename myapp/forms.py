from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import InputRequired


class LoginForm(FlaskForm):
    ipaddress = StringField('ipaddress', validators=[InputRequired()])
    password = PasswordField('password', validators=[InputRequired()])