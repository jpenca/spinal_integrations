function Spinal(baseURL) {

    if (baseURL == null) {
        baseURL = 'http://localhost:5000';
        console.log('no url given, using default: ' + baseURL);
    }

    var self = this;

    this.baseURL = baseURL;
    this.baseRoute = '/ar/json/';

    var banks = "ABCDEFGH";

    this.getKit = position => this.getSingle('kit.' + (position ? position : 'x'));
    this.getPattern = position => {
       var p = position ? position : 'x';
       if (banks.indexOf(p[0]) > -1) {
           p = banks.indexOf(p[0]) * 16 + parseInt(p.substring(1));
       }
       return this.getSingle('pat.' + p);
   }
   this.getPoolSound = position => this.getSingle('snd.' + position);
   this.getTrackSound = position => this.getSingle('snd.x.' + position);
   this.getSong = () => this.getSingle('son.x');
   this.getGlobal = () => this.getSingle('glo.x');
   this.getSettings = () => this.getSingle('set.x');

   this.getParams = () => {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.addEventListener('load', function(r) {
                var response = req.response;
                if (req.status == 200) {
                    resolve(response);
                } else {
                    reject(response);
                }
            });

            req.responseType = "json";
            req.open('GET', self.baseURL + self.baseRoute + 'params');
            req.send();
        });
   }

    this.get = function (keys) {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.addEventListener('load', function(r) {
                var response = req.response;
                if (req.status == 200) {
                    resolve(response);
                } else {
                    reject(response);
                }
            });

            req.responseType = "json";
            req.open('GET', self.baseURL + self.baseRoute + 'data?keys=' + keys);
            req.send();
        });
    };

    this.getSingle = function (key) {
        console.log('getSingle key: ' + key);
        return new Promise(function (resolve, reject) {
            self.get(key).then(r => resolve(r[key]), r => reject(r));
        });
    };

    this.post = function (obj) {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.addEventListener('load', () => {
                var response = req.response;
                if (req.status == 200) {
                    resolve(response);
                } else {
                    reject(response);
                }
            });

            req.responseType = "json";
            req.open('POST', self.baseURL + self.baseRoute + 'data');
            req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            req.send(JSON.stringify(obj));
        });
    };
}