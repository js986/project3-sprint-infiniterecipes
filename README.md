# InfiniteRecipes
A food recipes browser-based app.

# Heroku link
https://infiniterecipes.herokuapp.com/

# Set up React  
0. `cd ~/environment && git clone https://github.com/js986/CS490-Project3.git && cd CS490-Project3`    
1. Install npm dependencies!    
  a) `npm install`    
  b) `npm install -g webpack`    
  c) `npm install --save-dev webpack`    
  d) `npm install socket.io-client --save`
2. Install Python dependencies!
  a) Upgrade the pip: `pip install --upgrade pip`
  b) `pip install -r requirements.txt`
If you see any error messages, make sure you use `sudo pip` or `sudo npm`. If it says "pip cannot be found", run `which pip` and use `sudo [path to pip from which pip] install`  
  
# Getting PSQL to work with Python  
  
1. Update yum: `sudo yum update`, and enter yes to all prompts    
2. Upgrade pip: `sudo /usr/local/bin/pip install --upgrade pip`  
3. Get psycopg2: `sudo /usr/local/bin/pip install psycopg2-binary`    
4. Get SQLAlchemy: `sudo /usr/local/bin/pip install Flask-SQLAlchemy==2.1`    
  
# Setting up PSQL  
  
1. Install PostGreSQL: `sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs`    
    Enter yes to all prompts.    
2. Initialize PSQL database: `sudo service postgresql initdb`    
3. Start PSQL: `sudo service postgresql start`    
4. Make a new superuser: `sudo -u postgres createuser --superuser $USER`    
    If you get an error saying "could not change directory", that's okay! It worked!  
5. Make a new database: `sudo -u postgres createdb $USER`    
        If you get an error saying "could not change directory", that's okay! It worked!  
6. Make sure your user shows up:    
    a) `psql`    
    b) `\du` look for ec2-user as a user    
    c) `\l` look for ec2-user as a database    
7. Make a new user:    
    a) `psql` (if you already quit out of psql)    
    ## REPLACE THE [VALUES] IN THIS COMMAND! Type this with a new (short) unique password.   
    b) I recommend 4-5 characters - it doesn't have to be very secure. Remember this password!  
        `create user [some_username_here] superuser password '[some_unique_new_password_here]';`    
    c) `\q` to quit out of sql    
8. `cd` into `CS490-Project3` and make a new file called `sql.env` and add `SQL_USER=` and `SQL_PASSWORD=` in it  
9. Fill in those values with the values you put in 7. b)  
  
  
# Enabling read/write from SQLAlchemy  
There's a special file that you need to enable your db admin password to work for:  
1. Open the file in vim: `sudo vim /var/lib/pgsql9/data/pg_hba.conf`
If that doesn't work: `sudo vim $(psql -c "show hba_file;" | grep pg_hba.conf)`  
2. Replace all values of `ident` with `md5` in Vim: `:%s/ident/md5/g`  
3. After changing those lines, run `sudo service postgresql restart`  
4. Ensure that `sql.env` has the username/password of the superuser you created!  
5. Run your code!    
  a) `npm run watch`. If prompted to install webpack-cli, type "yes"    
  b) In a new terminal, `python app.py`    
  c) Preview Running Application (might have to clear your cache by doing a hard refresh)    

# Creating food recipes app
In order to build this app, we planned together and split tasks amongst oursleves:

1. Hasan Dulgeroglu
    - Plan and create models for the database in models.py
    - Create necessary functions for adding, removing, getting and searching data in the database in db_queries
    - Write unittests for database functions
    - Write unittests for socket functions

2. Jordan Sefah
    - Create recipes page where information on the recipe such as ingredients and directions are displayed
    - Create a form to post new recipes
    - Create cart to add ingredients to the cart
    - Add filter to search bar
    - Create main page where various posts are displayed

3. Dominik Nef
    - Create user profile page where posts of the user are displayed
    - Create about.html page
    - Incorporate Google Maps API inside the user's cart page

4. Risha Shah
    - Create and style search button to search for recipes 
    - Use Google oAuth to create Google Login
    - Use Google oAuth to create Google Logout
    - Create main page where various posts are displayed