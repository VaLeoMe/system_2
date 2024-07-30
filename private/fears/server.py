import array
from datetime import datetime
from hashlib import sha256
import json
import os
from time import time
from flask import Flask, Response, jsonify, request
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

import glob


formsPath = "/home/eder/cheesechain/private/db2bc/BackupFiles/"
#formsPath = "./BackupFiles/"

app = Flask(__name__,static_url_path='/static')
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["100000000 per day", "10000 per hour"]
)

class Form():

    def __init__(self):
        self.id = None
        self.timestamps = []

    def __init__(self, id):
        self.id = id
        self.timestamps = []

    def addTimestamp(self,timestamp):
        self.timestamps.sort()
        if len(self.timestamps)!=0:
            if self.timestamps[-1] == timestamp:
                return
            else:
                self.timestamps.append(timestamp)
        else:
            self.timestamps.append(timestamp)
    
    def hashContent(self):
        return
    
    def lastUpdateTimestamp(self):
        self.timestamps.sort()
        return self.timestamps[-1]

    def lastUpdateFilename(self):
        return self.id+"-"+self.lastUpdateTimestamp()

    def toJSON(self):
        self.timestamps.sort()
        data = {"id":self.id,
                "lastUpdate":datetime.fromtimestamp(int(self.lastUpdateTimestamp())),
                "lastUpdateTimestamp":self.lastUpdateTimestamp(),
                "lastUpdateFilename":self.lastUpdateFilename(),
                "timestamps":self.timestamps
                }
        return data

def getFormsList():
    files = glob.glob(formsPath+"/*.json")
    files = [os.path.basename(x) for x in files] # remove the paths
    files = [x[:-5] for x in files] # remove the .json
    allForms = {}
    for form in files:
        id,timestamp=form.split('-') # split between and id and timestamp
        if id in allForms: # if the form already exists in the dict 
            #print(allForms[id].toJSON()) 
            allForms[id].addTimestamp(timestamp) #just add the timestamp
        else: #if not in the dict, need to create a new object
            newForm = Form(id)
            newForm.addTimestamp(timestamp)
            allForms[id]=newForm
            #print(allForms[id].toJSON())

    return allForms


@app.route('/api/getAllForms',methods=['GET'])
def getAllForms():
    error = None
    if request.method == 'GET':
        formsList = getFormsList()
        retorno = {}
        for form in formsList:
            retorno[form]=formsList[form].toJSON()
        return jsonify(retorno)
    else:
        return jsonify(error="Only GET method is supported")

@app.route('/api/getForm/',methods=['GET'])
def getForm():
    error = None
    if request.method == 'GET':
        try:
            formID = request.args.get('form_id')
            formsList = getFormsList()
            return formsList[formID].toJSON()
        except Exception as e:
           return jsonify(error=str(e))
    else:
        return jsonify(error="Only GET method is supported")

@app.route('/api/getAnswersForm',methods=['GET'])
def getAnswersForm():
    error = None
    if request.method == 'GET':
        try:
            formID = request.args.get('form_id')
            formTimestamp = request.args.get('timestamp')
            formFilename = open(formsPath + formID + "-" + formTimestamp + ".json", "r")
            return jsonify(formFilename.read())
            #return jsonify(form.read())
        except Exception as e:
           return jsonify(error=str(e))
    else:
        return jsonify(error="Only GET method is supported")


@app.route('/api/getRecentFormAnswers',methods=['GET'])
def getRecentFormAnswers():
    error = None
    if request.method == 'GET':
        try:
            formID = request.args.get('form_id')
            formsList = getFormsList()
            formFilename = open(formsPath + formsList[formID].lastUpdateFilename() + ".json", "r")
            return jsonify(formFilename.read())
            #return jsonify(form.read())
        except Exception as e:
           return jsonify(error=str(e))
    else:
        return jsonify(error="Only GET method is supported")


@app.route('/api/getAnswersHash',methods=['GET'])
def getAnswersHash():
    error = None
    if request.method == 'GET':
        try:
            formID = request.args.get('form_id')
            formTimestamp = request.args.get('timestamp')
            formFilename = open(formsPath + formID + "-" + formTimestamp + ".json", "r")
            return jsonify({
                'id':formID,
                'timestamp':formTimestamp,
                'hash':sha256(formFilename.read().encode('utf-8')).hexdigest()
                })
            #return jsonify(form.read())
        except Exception as e:
           return jsonify(error=str(e))
    else:
        return jsonify(error="Only GET method is supported")

if __name__ == "__main__":
    #Secret to generate sessions and tokens
    app.secret_key = '854PnCpfwxsHD5hbeWxYkXAqkvW4t2XMKTjwg7vmntsxxNtxyzN7ZtSSxhQD3HdLBBbpTndsa8L5vRfL3AKsJaRFHycsFMgPdZM9YsLApz6jvm6hh2HBbqA7dry3NhnR'    

    #Run HTTP for HTTPs should use the 'ssl' folder with key and certificate
    app.run(host='0.0.0.0',threaded=True) #listen in all interfaces
