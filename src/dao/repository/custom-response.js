/**
 * @typedef {import('express').Request} ExpressRequest
 * @typedef {import('express').Response} ExpressResponse
 * @typedef {import('express').NextFunction} ExpressNextFunction
 * @description
 * @param {ExpressRequest} req
 * @param {Response} res
 * @param {ExpressNextFunction} next
 */


export default (req, res, next)=>{
    res.okResponse =(data)=>{
        res.status(200).send({
            status: 'success',
            result: data
        });
    };
    res.clientErrorResponse= (message)=>{
        res.status(400).send({
            status:'error',
            error:message
        });
    };
    res.serverErrorResponse = (message)=>{
        res.status(500).send({
            status:'error',
            error: message
        });
    };
}

/**
 * @typedef {function} okResponse
 * @param {any} data
 */
/**
 * @typedef {function} clientErrorResponse
 * @param {string} message
 */
/**
 * @typedef {function} clientErrorResponse
 * @param {string} message
 */
/**
 * @typedef {Object} CustomResponse
 * @property {okResponse} okResponse
 * @property {clientErrorResponse} clientErrorResponse
 * @property {serverErrorResponse} serverErrorResponse
 * @typedef {ExpressResponse & CustomResponse} Response
 */