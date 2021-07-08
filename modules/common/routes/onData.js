require('../../utils/initializer')();
const { DG_TOKEN, DG_OWNER, DG_DIST_KEY } = process.env;

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
module.exports = (req, res) => {
    const json = JSON.stringify({
        token   : DG_TOKEN,
        owner   : DG_OWNER,
        dist_key: DG_DIST_KEY
    });

    res.send(json);
}