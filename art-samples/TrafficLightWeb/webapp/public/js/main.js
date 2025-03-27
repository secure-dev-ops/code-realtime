/*******************************************************************************
 * (c) Copyright HCL Technologies Ltd. 2018.  MIT Licensed!
 *******************************************************************************/

/**
 * Client application entry point
 * @author Mattias Mohlin
 */

$(function () {

    var socket = undefined;
    var isBrowser = true;
    
    if (isBrowser) {
        const baseUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
        const socketPath = `${window.location.pathname}socket.io`;
        console.log("baseUrl: " + baseUrl);
        console.log("socketPath: " + socketPath);
        socket = io(baseUrl,{
            path: socketPath
          });
    
    } else {
        socket = io();
    }

   
    socket.on('light', function(msg) {
        $('#light-label').text("Light: " + msg.light);
        $('#rl').css('fill', 'black');
        $('#yl').css('fill', 'black');
        $('#gl').css('fill', 'black');
        if (msg.light == 'red') {
            $('#rl').css('fill', 'red');            
        }
        else if (msg.light == 'yellow') {
            $('#yl').css('fill', 'yellow');
        }
        else if (msg.light == 'green') {
            $('#gl').css('fill', 'green');
        }
    });
    
    socket.on('pedlight', function(msg) {

        if(isBrowser){
            $('#pedSignal').attr('src', './images/' + msg.light);
        }else{
            $('#pedSignal').attr('src', '/images/' + msg.light);
        }
        
    });

    socket.on('pedcount', function(msg) {
        $('#pedCounter').text(msg.count);
        if (msg.count == '0') {
            setTimeout(() => {$('#pedCounter').text('');}, 1000);
        }
    });

    $('#ped_button').click(function() {
        if(isBrowser){
            $.get('./ped_button', function () {

            });
        }
        else{
            $.get('/ped_button', function () {

            });
        }
        
    });
});