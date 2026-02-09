const logger = (req, res, next)=>{
    req.requestTime = Date.now()
    next()
}

export default  logger