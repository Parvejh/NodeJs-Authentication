//our custom middleware to set the flash msg to response
module.exports.setFlash = function(req,res,next){
    res.locals.flash = {
        'success': req.flash('success'),
        'error' : req.flash('error')
    }
    next();
}