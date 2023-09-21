const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/chendu"


mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true })
.then(res =>{
    res && console.log('connection success');
}).catch(err=>{
    err && console.log('connection failed')
});

const testSchema = new mongoose.Schema({
    // clusters:{
    // }
})
// const testModel = mongoose.model('testmodel', testSchema, 'test10');
const euro = module.exports = mongoose.model('euro',testSchema,'test10')
