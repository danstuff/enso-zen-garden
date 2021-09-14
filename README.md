# Zen Garden

## Getting Started (macOS/Linux)

To use this project, you must first have a be in a terminal environment with python 3.0 or greater installed. 

From the terminal, use `cd` to navigate to where you want to download the project. Enter the following into the terminal to download the GitHub repository and enter it:

    git clone https://github.com/ORG_NAME/REPO_NAME
    cd REPO_NAME


Next, you need to create a python virtual environment (venv) in order to install Flask. Enter the following into your command line to create the environment:

    python3 -m venv venv

Now, we can activate our virtual environment like so:

    . venv/bin/activate

Now that the virtual environment is activated, any Python packages we install (like Flask) will be installed just for this project, and not on the entire system. Type this to install flask:

    pip install flask

## Getting Started (Windows)

To use this project, you must first have a be in the Command Prompt with python 3.0 or greater installed. 

From the command line, use `cd` to navigate to where you want to download the project. Enter the following to download the GitHub repository and enter it:

    git clone https://github.com/ORG_NAME/REPO_NAME
    cd REPO_NAME


Next, you need to create a python virtual environment (venv) in order to install Flask. Enter the following into your command line to create the environment:

    py -3 -m venv venv

Now, we can activate our virtual environment like so:

    venv\Scripts\activate

Now that the virtual environment is activated, any Python packages we install (like Flask) will be installed just for this project, and not for the entire system. Type this to install flask:

    pip install flask

## Running the Project

To run the project, you must first be in the command line with your python virtual environment activated. Every time you open a new command window, make sure to re-activate it like so:

On Linux/macOS:

    . venv/bin/activate

On Windows:

    venv\Scripts\activate

Now you can start the server:

On Linux/macOS:

    export FLASK_APP=server
    flask run

On Windows:

    set FLASK_APP=server
    flask run

Flask should respond with an IP address that you can enter into your browser to view the app.
