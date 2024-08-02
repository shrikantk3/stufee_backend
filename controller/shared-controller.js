const  resultAPI = (err, rows, feilds, _message)=>{
    return {
        results: err?null:rows,
        message: err?err.sqlMessage:_message,
        valid:err?false:true
    }
}

module.exports = resultAPI;