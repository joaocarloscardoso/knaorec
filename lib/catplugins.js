var fs = require('fs'),
    path = require('path'),
    _ = require('underscore');

module.exports = function(dir){
    var PlugInsPath = dir;
    return {
        // Return only base file name without dir
        getMostRecentFileName: function() {
            var files = fs.readdirSync(PlugInsPath);

            // use underscore for max()
            return _.max(files, function (f) {
                var fullpath = path.join(PlugInsPath, f);

                // ctime = creation time is used
                // replace with mtime for modification time
                return fs.statSync(fullpath).ctime;
            });
        },
    };
};

