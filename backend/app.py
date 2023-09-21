# -*- encoding: utf-8 -*-

from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import csv
import json
import logging
from CNN import root_getMissing, root_selectFeature, root_getPreProjection, root_getProjection, root_setPositive, \
    root_setNegative, root_startTrain, root_getDynamicData, root_getActivation, root_initPos, root_setExpand, \
    root_sampleDetails, root_connect, root_inference, root_saveModel, root_getLasso, root_getValidNum, root_applyNegative, \
    root_addLogs, root_switchLogs, root_stopTrain

app = Flask(__name__)
cors = CORS(app, resources={r"/euro/*": {"origins": "*"}}, supports_credential=True)


@app.route('/')
def hello_world():
    return jsonify({'code': 0, 'data': 'Hello World!'})


@app.route('/euro/getMissing', methods=['GET', 'POST'])
def getMissing():
    req = request.get_json()
    miss_list = root_getMissing(req)
    response = {
        'code': 0,
        'data': miss_list
    }
    return jsonify(response)


@app.route('/euro/selectFeature', methods=['GET', 'POST'])
def selectFeature():
    req = request.get_json()
    selected_features = req
    root_selectFeature(selected_features)

    return jsonify({'code': 0, 'data': 'Pretrain Done'})


@app.route('/euro/getValidNum', methods=['GET', 'POST'])
def getValidNum():
    num = root_getValidNum()
    response = {
        'code': 0,
        'data': num
    }
    return jsonify(response)


@app.route('/euro/initPos', methods=['GET', 'POST'])
def initPos():
    req = request.get_json()
    links, set_range, set_num = root_initPos(req)
    response = {
        'code': 0,
        'data': {
            'links': links,
            'range': set_range,
            'set_num': set_num
        }
    }
    return jsonify(response)


@app.route('/euro/selectSets', methods=['GET', 'POST'])
def selectSets():
    req = request.get_json()
    links = root_setExpand(req)
    response = {
        'code': 0,
        'data': links
    }
    return jsonify(response)


@app.route('/euro/sampleDetails', methods=['GET', 'POST'])
def sampleDetails():
    req = request.get_json()
    data = root_sampleDetails(req)
    data = json.loads(json.dumps(data).replace('NaN', '\"NaN\"'))
    response = {
        'code': 0,
        'data': data
    }
    return jsonify(response)


@app.route('/euro/connect', methods=['GET', 'POST'])
def connect():
    req = request.get_json()
    root_connect(req)

    return 'Connect changed'


@app.route('/euro/setPositive', methods=['GET', 'POST'])
def setPositive():
    root_setPositive()
    return 'Set Positive Done'


@app.route('/euro/setNegative', methods=['GET', 'POST'])
def setNegative():
    req = request.get_json()
    root_setNegative(req)
    return jsonify({'code': 0, 'data': 'Select Negative Strategy Done'})

@app.route('/euro/applyNegative', methods=['GET', 'POST'])
def applyNegative():
    req = request.get_json()
    neg_full, neg_semi = root_applyNegative(req)
    return jsonify({'code': 0, 'data': neg_full+neg_semi})

@app.route('/euro/startTrain', methods=['GET', 'POST'])
def startTrain():
    req = request.get_json()
    lr = req['learning_rate']
    epoch = req['epoch']
    t = req['temperature']
    m = req['m']
    root_startTrain(lr, epoch, t, m)

    return jsonify({'code': 0, 'data': 'Train Done'})


@app.route('/euro/getDynamicData', methods=['GET', 'POST'])
def getDynamicData():
    d = root_getDynamicData()
    response = {
        'code': 0,
        'data': d
    }
    return jsonify(response)


@app.route('/euro/getPreProjection', methods=['GET', 'POST'])
def getPreProjection():
    projection = root_getPreProjection()
    projection = json.loads(json.dumps(projection).replace('NaN', '\"NaN\"'))
    response = {
        'code': 0,
        'data': projection
    }
    return jsonify(response)


@app.route('/euro/getLasso', methods=['GET', 'POST'])
def getLasso():
    req = request.get_json()
    data = root_getLasso(req)
    response = {
        'code': 0,
        'data': data
    }
    return jsonify(response)


@app.route('/euro/getProjection', methods=['GET', 'POST'])
def getProjection():
    projection = root_getProjection()
    projection = json.loads(json.dumps(projection).replace('NaN', '\"NaN\"'))
    response = {
        'code': 0,
        'data': projection
    }
    return jsonify(response)


@app.route('/euro/getActivation', methods=['GET', 'POST'])
def getActivation():
    activation = root_getActivation()
    response = {
        'code': 0,
        'data': activation
    }
    return jsonify(response)


@app.route('/euro/getInference', methods=['GET', 'POST'])
def getInference():
    data = root_inference()
    data = json.loads(json.dumps(data).replace('NaN', '\"NaN\"'))
    response = {
        'code': 0,
        'data': data
    }
    return jsonify(response)


@app.route('/euro/saveModel', methods=['GET', 'POST'])
def saveModel():
    data = root_saveModel()
    response = {
        'code': 0,
        'data': data
    }
    return jsonify(response)


@app.route('/euro/addLogs', methods=['GET', 'POST'])
def addLogs():
    data = root_addLogs()
    response = {
        'code': 0,
        'data': data
    }
    return jsonify(response)


@app.route('/euro/switchLogs', methods=['GET', 'POST'])
def switchLogs():
    req = request.get_json()
    data = root_switchLogs(req)
    response = {
        'code': 0,
        'data': data
    }
    return jsonify(response)

@app.route('/euro/stopTrain', methods=['GET', 'POST'])
def stopTrain():
    root_stopTrain()
    response = {
        'code': 0,
        'data': 'stop train'
    }
    return jsonify(response)


if __name__ == '__main__':
    app.debug = True
    app.run()
