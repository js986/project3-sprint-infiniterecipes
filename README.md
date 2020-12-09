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
To continue building this app, we planned together and split tasks amongst oursleves:

1. Hasan Dulgeroglu
    - Edit database model to add rating tables with relation to recipe
    - Add remove shared and saved recipes, edit recipe functions

2. Jordan Sefah
    - Favorite button to be able to favorite recipes on home page 
    - Implement save functionality for recipes
    - Extend database and socket tests
    - Implement posting user's finished dish functionality

3. Dominik Nef
    - Implement forking recipes where users can copy edit an existing recipe and re-post
    - Add youtube url when posting a recipe
    - Fill out and beautify about page
    - Portray images and other recipe information on User Page 

4. Risha Shah
    - Implement forking recipes where users can copy edit an existing recipe and re-post
    - Add youtube url when posting a recipe
    - Styling and designing pages
    - Linting files 

# Technical issues we came across and were able to solve it:
1. When implementing the youtube url feature whereby a user is able to add a video of their recipe, the youtube video either 
   did not display or showed an error saying that it cannot be found. After a lot of debugging and going through code the step by step,
   we istalled another react compenent which worked.

2. When implementing final dish recipe whereby a user has the option to post a picture after using somebody's recipe, the images did not display at first.
   This was because the client was unable to receive the list of images, therefore after tracing back to the code, we were able to fix the error on the client side.
