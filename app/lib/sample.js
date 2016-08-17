'use strict';

const request = require('superagent');
const _ = require('lodash');
const Bluebird = require('bluebird');
const logger = require('winston');
const Queue = require(__base + 'app/mongoose/models/queue');

const state = {
    isWorking: false
};

const credentials = {
    token: null,
    name: null
};

class Reloader {

    start() {
        setInterval(_.bind(() => {
            if (!state.isWorking) {
                logger.info('START QUEUE');

                state.isWorking = true;

                Queue.find({
                    status:'New'
                }).limit(10).exec((err, queues) => {
                    if (err) {
                        logger.info('QUEUE ERROR');
                        state.isWorking = false;
                        return;
                    }

                    if (!queues.length) {
                        logger.info('NO PHONES FOR QUEUE');
                        state.isWorking = false;
                        return;
                    }


                    logger.info('QUEUE', queues.length, 'PHONES');

                    let countPhonesUpdated = 0;
                    let promises = [];

                    _.each(queues, (queue) => {
                        promises.push(this.reloadPhoneAsync(queue));
                    });

                    Bluebird.all(promises).then((responses) => {
                        state.isWorking = false;
                    });
                });
            } else {
               logger.info('IS WORKING');
            }
        }, this), 3000);
    }

    login(callback) {
        request
            .post('https://www.irecarga.com.br/api/ValidateUser.ashx?action=validateLoginSenha')
            .send('NN_LOGIN=' + process.env.USER_LOGIN)
            .send('NN_PASSWORD=' + process.env.USER_PASSWORD)
            .end(function(err, res){
                if (err) {
                    callback(err, false);
                } else {
                    var data = JSON.parse(res.text);
                    credentials.token = data.token;
                    credentials.name = data.nome;

                    callback(false, credentials);
                }
            }
        );
    }

    reloadPhone(queue, callback) {

        console.log(queue);

        request
            .post('http://localhost:3000/try')
            //.post('https://www.irec arga.com.br/api/ReloadPhone.ashx?action=reloadPhoneValue')
            .send('NN_DDD=' + queue.ddd)
            .send('NN_PHONENUMBER=' + queue.mobile)
            .send('NN_COMPANY=' + queue.carrier)
            .send('NN_VALUE=10,00')
            .send('NN_TOKEN=')
            .send('NN_OS=')
            .end(function(err, res){
                if (err) {
                    callback(err, false);
                } else {
                    queue.sent_at = new Date();
                    queue.status = 'Done';
                    //queue.result = res;
                    queue.save();
                    callback(false, res);
                }
            }
        );
        callback(false, 'OK');
    }
}

Bluebird.promisifyAll(Reloader.prototype);
module.exports = Reloader;
