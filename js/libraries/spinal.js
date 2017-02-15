function Spinal(baseURL)
{
    if(baseURL == null)
    {
        baseURL = 'http://localhost:5000';
        console.log('no url given, using default: ' + baseURL);
    }

    this.baseURL     =  baseURL;
    this.baseRoute   =  '/ar/json/';
    this.get         =  function(keys, onSuccess, onError)
                        {
                            var req = new XMLHttpRequest();
                            req.addEventListener('load', function(r) {
                                
                                var response = req.response;
                                if(req.status == 200)
                                {
                                    if(typeof onSuccess == 'function')
                                        onSuccess(response)
                                }
                                else if(onError != null)
                                {
                                    if(typeof onError == 'function')
                                        onError(response);
                                }

                            });

                            req.responseType = "json";
                            req.open('GET', this.baseURL + this.baseRoute + 'data?keys=' + keys);
                            req.send();

                        };

    this.post        =  function (obj, onSuccess, onError)
                        {
                            var req = new XMLHttpRequest();
                            req.addEventListener('load', function(r) {
                                
                                var response = req.response;
                                if(req.status == 200)
                                {
                                    if(typeof onSuccess == 'function')
                                        onSuccess(response);
                                }
                                else if(onError != null)
                                {
                                    if(typeof onError == 'function')
                                        onError(response);
                                }

                            });

                            req.responseType = "json";
                            req.open('POST', this.baseURL + this.baseRoute + 'data');
                            req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                            req.send(JSON.stringify(obj));
                        };     
}
