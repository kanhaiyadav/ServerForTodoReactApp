const User = require('../model/users_model.js');

module.exports.unknown = (req, res) => {
    return res.render('unknown');
}
module.exports.home = async (req, res) => {
    try {
        let user = await User.findById(req.user._id).populate("tasks");
        return res.render('home', {
            user: user
        });
    } catch (err) {
        res.render('error', {
            message: 'User not found',
            error: err
        });
    }
}





