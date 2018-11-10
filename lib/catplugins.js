var fs = require('fs'),
    path = require('path'),
    _ = require('underscore');

var xpath   = require('xpath');
var Dom     = require('xmldom').DOMParser;

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
                //console.log(items);
             
                for (var i=0; i<items.length; i++) {
                    var filepath = PlugInsPath + '\\' + items[i];
                    //console.log(items[i]);
 
                    /*fs.stat(filepath, function(err, stats) {
                        console.log(stats["ctime"]);
                        console.log(stats["size"]);
                    });*/

                    fs.stat(filepath, function(f, i) {
                        return function(err, stats) {
                            var NewEntry = {
                                File: '',
                                Reference:'',
                                Description:'',
                                Support:'',
                                Version:'',
                                Language:'',
                                Date:'',
                                Size:'',
                                Path: ''
                            };
        
                            //size in kbytes
                            NewEntry.Size = (stats["size"] / 1024);
                            NewEntry.Date = stats["ctime"];
                            NewEntry.Path=f;
                            NewEntry.File=i;

                            var data = fs.readFileSync(f, { encoding : 'UTF-8' });
                            // Create an XMLDom Element:
                            var doc = new Dom().parseFromString(data);
                            
                            var res = xpath.select("/PlugIn/@id",doc);
                            if (res.length==1)
                                NewEntry.Reference = res[0].nodeValue;

                            var res = xpath.select("/PlugIn/About/@descriptionfile",doc);
                            if (res.length==1)
                                NewEntry.Support = res[0].nodeValue;

                            var res = xpath.select("/PlugIn/About/version/@id",doc);
                            if (res.length==1)
                                NewEntry.Version = res[0].nodeValue;

                            var res = xpath.select("/PlugIn/About/title/tx[@l='eng']/@name",doc);
                            if (res.length==1)
                                NewEntry.Description = res[0].nodeValue;

                            var res = xpath.select("/PlugIn/About/WorkingLanguage/@wl",doc);
                            if (res.length==1)
                                NewEntry.Language = res[0].nodeValue.replace(" ",", ");
                                                                    
                            console.log(NewEntry);
                            ListedPlugins.push(NewEntry);
                        }
                    }(filepath, items[i]));
                }
            });
        },
    };
};

