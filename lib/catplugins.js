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
        getListOfPlugins: function () {
            var ListedPlugins = [];

            fs.readdir(PlugInsPath, function(err, items) {
                console.log(items);
             
                for (var i=0; i<items.length; i++) {
                    var filepath = PlugInsPath + '\\' + items[i];
                    console.log(items[i]);
                    var NewEntry = {
                        File: items[i],
                        Reference:'',
                        Description:'',
                        Support:'',
                        Version:'',
                        Language:'',
                        Date:'',
                        Size:''
                    }

                    /*fs.stat(filepath, function(err, stats) {
                        console.log(stats["ctime"]);
                        console.log(stats["size"]);
                    });*/

                    fs.stat(filepath, function(f) {
                        return function(err, stats) {
                            NewEntry.Size = stats["size"];
                            NewEntry.Date
                            console.log(stats["size"]);
                            console.log(stats["ctime"]);
                        }
                    }(filepath));
                    ListedPlugins.push(NewEntry);
                }
            });
        },
    };
};

