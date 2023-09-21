// const uuid = require('uuid/v1');
const euro = require('../model/euro');
class EuroService {

    static async getData(params) {
      return new Promise((resolve, reject) => {
        euro.find(params, (err, euro) => {
          if (err) {
            reject(err)
          } else {
            resolve(euro)
          }
          // console.log(euro)
        })
      })
    }


}
module.exports = EuroService;
