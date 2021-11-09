# Enso - A Virtual Zen Garden

## Getting Started 

To use this project, you must first have a be in a terminal environment with python 3.0 or greater installed. 

From the terminal, use `cd` to navigate to where you want to download the project. Enter the following into the terminal to download the GitHub repository and enter it:

    git clone https://github.com/ZenGardenCapping/Zen-Garden-Capping.git
    cd Zen-Garden-Capping/

As a prerequisite, you must obtain the 'secure.py' file from the "Capping Shared Folder" google drive and copy it to the `Zen-Garden-Capping/modules` folder.

## Installation (macOS/Linux)

Next, you need to create a python virtual environment (venv) in order to install Flask. Enter the following into your command line to create the environment:

    python3 -m venv venv

Now, we can activate our virtual environment like so. You will need to do this every time you open a new terminal window:

    . venv/bin/activate

Now that the virtual environment is activated, any Python packages we install (like Flask) will be installed just for this project, and not on the entire system. Type this to install the required libraries. You only need to do this once per virtual environment:

    pip install flask sqlalchemy gunicorn

## Installation (Windows)

Next, you need to create a python virtual environment (venv) in order to install Flask. Enter the following into your command line to create the environment:

    py -3 -m venv venv

Now, we can activate our virtual environment like so. You will need to do this every time you open a new terminal window:

    venv\Scripts\activate

Now that the virtual environment is activated, any Python packages we install (like Flask) will be installed just for this project, and not on the entire system. Type this to install the required libraries. You only need to do this once per virtual environment:

    pip install flask sqlalchemy gunicorn

## Running the Project

To run the project, first enter your virtual environment. Then start a Gunicorn server using the following command:

    gunicorn -b 0.0.0.0:5000 routes:app

Gunicorn should respond with an IP address that you can enter into your browser to view the app.
    
