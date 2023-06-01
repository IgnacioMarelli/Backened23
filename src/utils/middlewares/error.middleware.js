export default (error, req, res, next) =>{
    console.log(error.cause)
    switch(Math.floor(error.code / 100)){
        case 1:
            res.status(400).send({
                status: 'error',
                error: error.cause,
              });
            break;
        case 2: 
            res.status(400).send({
                status: 'error',
                error: error.cause,
            });
            break;
        case 3:
            res.status(500).send({
                status: 'error',
                error: 'Unhanddled error',
              });
            break;
        default:
            res.status(500).send({
                status: 'error',
                error: 'Unhanddled error',
              });
    }
}