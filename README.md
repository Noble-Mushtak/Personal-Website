# The Personal Website of Noble Mushtak #

My personal Web site, as a [Django](https://www.djangoproject.com/) project. You can [visit this Web site here](https://rebrand.ly/nhmsite).

## Running Locally 

The following instructions work on Ubuntu 20.04, they have not been tested on other operating systems.

Note that the following instructions will install a MySQL server onto your computer, which may run in the background even when you are not running the Web site. After installation, you can stop the service with `sudo systemctl stop mysql.service` and then start the service with `sudo systemctl start mysql.service` when you are ready to run the Web site. You can also run `sudo systemctl disable mysql.service` so that the MySQL server does not start every time you boot your computer.

First, make sure you have [Python 3](https://www.python.org/downloads/) and [pip](https://pip.pypa.io/en/stable/installation/) installed. Then, run the following commands in the directory where you have cloned this repository:

    sudo apt-get install mysql-server
    sudo apt-get install mysql-client
    sudo apt-get install libmysqlclient-dev
    pip install -r requirements.txt

Next, you will need to set up a MySQL user and database. The `website/mock_secrets.py` is set up to use MySQL with the user `noble` and a database named `website` with an empty password, so modify that file if you would like to use a different username or database name.

To create a MySQL database and user account, run `sudo mysql` in the terminal and then enter the following commands into the prompt that shows up:

    CREATE DATABASE website;
    CREATE USER 'noble' IDENTIFIED BY '';
    GRANT ALL privileges on website.* to noble;
    FLUSH privileges;
    exit

(Note that the second string in the `CREATE USER` command represents an empty password.)

Finally, run the following in the terminal in order to set up the necessary SQL tables:

    DJANGO_LOCAL=True python3 manage.py makemigrations
    DJANGO_LOCAL=True python3 manage.py migrate

At this point, everything is set up, so now you can run `./runserver.sh` in the terminal and visit http://localhost:8070/ to see this Web site running on your computer!