from time import sleep
from random import randint
from selenium import webdriver
from bs4 import BeautifulSoup
import requests, csv
from selenium.webdriver.common.keys import Keys

import sys

#sys.argv are the arguments given in the spawn line, 
#here I can get information from the index.js
#print(f'These are the scraping args: {sys.argv[1]}') 

def randomize_sleep(min, max):
    sleep(randint(min*100, max*100) / 100)

def web_scraper():
    global driver
    driver = webdriver.Chrome('./chromedriver.exe') 

    driver.get('https://freerice.com/')
    randomize_sleep(3, 4)

    driver.close()

    

web_scraper()

'''the problem is using the Chrome webdriver without a local machine, since normally i could 
type inside webdriver.Chrome() brackets to specify the PATH of said webdriver that's in my repo, 
but since we wanna do this through heroku I looked into setting up selenium as a server:
https://selenium-python.readthedocs.io/installation.html#installing-python-bindings-for-selenium
https://selenium-python.readthedocs.io/getting-started.html#selenium-remote-webdriver
I stopped working on this since once I could setup the server (which is already gonna be hard enough
with also having to install java for heroku somehow), I still wouldn't know how to make it set itself up
every time we ran the bot through heroku.
driver = webdriver.Chrome('./chromedriver') this is how i'd normally link the driver or the complete PATH'''