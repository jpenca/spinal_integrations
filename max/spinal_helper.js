inlets = 2;
outlets = 4;

var parsed; // global??

setinletassist(0,"json string");
setinletassist(1,"command message");

setoutletassist(0,"js object");
setoutletassist(1,"result of get command");
setoutletassist(2,"result of stringify command");
setoutletassist(3,"status of xhrpost command");

function anything()
{
	var a = arrayfromargs(messagename, arguments);
    if (a.length == 0 ) {
        return;
    }

    var obj = a[0];

    post(typeof obj);

    if(typeof obj === 'string') {
        post('parsing: ' + obj + '\n');
        parsed = JSON.parse(obj);
        outlet(0, parsed);    
    }
}

Object.resolve = function(path, obj) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : undefined
    }, obj || obj)
}

function get(obj, path)
{
    if (parsed == null)
    {
        post('get: root obj == null\n');
        return;
    }

    var myObj;

    if(arguments.length == 2)
    {
        myObj = parsed[arguments[0]];  
        post('get 3: ' + myObj + '\n'); 
        var out = Object.resolve(arguments[1], myObj);
        post('get result: ' + out + '\n');
        outlet(1, out);
    }
    else if (arguments.length == 1)
    {
        myObj = parsed;
        post('get 2: ' + myObj + '\n');
        var out = Object.resolve(arguments[0], myObj);
        post('get result: ' + out + '\n');
        outlet(1, out);
    }
    else
    {
        post('get arg cnt: ' + arguments.length + '\n');
        return;
    }

    if(myObj == null)
    {
        post('get: myObj == null\n');
        return;
    }

	
}

function deepSet(obj, path, value) {
    var schema = obj;  // a moving reference to internal objects within obj
    var pList = path.split('.');
    var len = pList.length;
    for(var i = 0; i < len-1; i++) {
        var elem = pList[i];
        if( !schema[elem] ) schema[elem] = {}
        schema = schema[elem];
    }

    schema[pList[len-1]] = value;
    // post(JSON.stringify(schema, null, 2) + '\n');
    // post('deep set!! ' + JSON.stringify(schema, null, 2) + '\n');
    // return schema;
}

function deepDelete(obj, path) {
    var schema = obj;  // a moving reference to internal objects within obj
    var pList = path.split('.');
    var len = pList.length;
    for(var i = 0; i < len-1; i++) {
        var elem = pList[i];
        if( !schema[elem] ) schema[elem] = {}
        schema = schema[elem];
    }

    // schema[pList[len-1]] = value;
    delete schema[pList[len-1]];
    // post(JSON.stringify(schema, null, 2) + '\n');
    // post('deep set!! ' + JSON.stringify(schema, null, 2) + '\n');
    // return schema;
}

function set(obj, path, value)
{
    if(arguments.length == 3) {
        var myObj = parsed[obj];
        deepSet(myObj, path, value);
    }
    else if (arguments.length == 2) {
        parsed = {};
    }
}

function del(obj, path)
{
    if (parsed == null)
        return;

	var myObj = parsed[obj];
	deepDelete(myObj, path);
}

function stringify(obj)
{
    if (parsed == null)
    {
        post('stringify: root obj == null\n');
        return;
    }

    if(arguments.length == 1)
    {
        var myObj = parsed[obj];
        outlet(2, JSON.stringify(myObj));    
    }
    else if (arguments.length == 0)
    {
        outlet(2, JSON.stringify(parsed));       
    }
}

function xhrpost(obj, address)
{
    if (parsed == null)
        outlet(3, 0);

	var myObj = parsed[obj];
    if(myObj == null)
        outlet(3, 0);

	var string = JSON.stringify(myObj);

	var xhr = new XMLHttpRequest();
	xhr.open('POST', address);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhr.onreadystatechange = function(r) {
                                
                                outlet(3, r.status);

                            }


    xhr.send(string);

}
