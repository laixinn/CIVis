
const EuroService = require('../service/euro_service.js');

class EuroHandler {
    /**
     * 获取详细信息
     */
    static async getData(req, res) {
      let params = req.query;
      console.log(params)
      let data = await EuroService.getData(params);
      console.log(data)
      return res.json({code: 0 , data});
    }

}
module.exports = EuroHandler;
