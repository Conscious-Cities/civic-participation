const accountController = require('../../controllers/accounts.controller');

/* GET acounts listing. */
module.exports = async function(req, res) {
    const accountName = req.body.accountName;
    if (!accountName) {
        res.status(400);
        res.send({ message: 'req body should contain all the data!' });
        return;
    }
    const accountDoc = await accountController.findOne({ accountName: accountName });
    if (!accountDoc) {
        res.status(404);
        res.send({ message: `Not found account with account name ${accountName}` });
    }

    const accountDocInfo = {
        accountType: accountDoc.accountType,
        accountName: accountDoc.accountName,
        commonName: accountDoc.commonName,
    };

    const retObj = req.addBlockchainRes(accountDocInfo);
    res.send(retObj);
};