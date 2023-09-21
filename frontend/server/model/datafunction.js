var getdata = function(model){
    return new Promise((resolve, reject) => {
        model.find({}
            ,{'product_id':1,'history_parameters':1}
            ,function(err,doc){
            //console.log(doc);
            resolve(doc);
            //return doc;
        })
    })
}

var selectID = function(model,ID){
    return new Promise((resolve, reject)=>{
        model.find({product_id:ID},
            function(err,doc){
                resolve(doc);
            })
    })
}

var selectWord = function(model,selectedword){
    return new Promise((resolve, reject)=>{
        resolve(model.find({word:selectedword},
            function(err,doc){
                    // resolve(doc);
        }).then())
    })
}
var selectcluster = function(model){
    return new Promise((resolve, reject)=>{
        model.find({},
            function(err,doc){
                // console.log(doc);
                resolve(doc);
            })
    })
}

module.exports = {getdata,selectID,selectWord,selectcluster};
