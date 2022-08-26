( function( w, d, n, c ) {
    w.CalltouchDataObject = n;
    w[n] = function() {w[n]['callbacks'].push( arguments );};
    if ( !w[n]['callbacks'] ) {w[n]['callbacks'] = [];}
    w[n]['loaded'] = false;
    if ( typeof c !== 'object' ) {c = [ c ];}
    w[n]['counters'] = c;
    for ( var i = 0; i < c.length; i += 1 ) {p( c[i] );}

    function p( cId ) {
        var a = d.getElementsByTagName( 'script' )[0],
            s = d.createElement( 'script' ),
            i = function() {a.parentNode.insertBefore( s, a );};
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://mod.calltouch.ru/init.js?id=' + cId;
        if ( w.opera == '[object Opera]' ) {d.addEventListener( 'DOMContentLoaded', i, false );} else {i();}
    }
} )( window, document, 'ct', 'an7b15ey' );

Element.prototype.matches||(Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.webkitMatchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector),Element.prototype.closest||(Element.prototype.closest=function(e){for(var t=this;t;){if(t.matches(e))return t;t=t.parentElement}return null});
(function(sId, nn) {
    var CT_URL = 'https://api-node'+nn+'.calltouch.ru/calls-service/RestAPI/requests/'+sId+'/register/', request = window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest(), ct_data = {}, сt_сheck = false;
    try {
        document.addEventListener('click', function(e) {
            var t_el = e.target;
            if (t_el.closest('button[type="submit"]')) {
                var f = t_el.closest('form');
                var phone = '', sub = '';
                try { phone = f.querySelector('input[type="tel"]').value; }catch(e){}
                sub = 'Заявка c ' + location.hostname;
                ct_data.subject = sub; ct_data.phoneNumber = phone; ct_data.sessionId = window.call_value;
                var post_data = Object.keys(ct_data).reduce(function(a,k){a.push(k+'='+encodeURIComponent(ct_data[k]));return a},[]).join('&');
                сt_сheck = !!phone;
                if (сt_сheck){
                    console.log(ct_data);
                    request.open("POST", CT_URL, true);
                    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    request.send(post_data);
                    сt_сheck = false, ct_data = {};
                }
            }
        });
    } catch (e) { console.log(e); }
})('40154', '15');
