/*******************************************************************************
 * (c) Copyright HCL Technologies Ltd. 2020. 
 *******************************************************************************/

/**
 * Client application entry point
 * @author Mattias Mohlin
 */

$(function () {
    var socket = io();    

    function updateTimer(elapsedTime) {
        let timeStr = '';
        if (elapsedTime.hasOwnProperty('hours'))
            timeStr += elapsedTime.hours + ' hours ';
        if (elapsedTime.hasOwnProperty('minutes'))
            timeStr += elapsedTime.minutes + ' minutes ';
        timeStr += elapsedTime.seconds + ' seconds';
        $('#timer-clock').text(timeStr);
    }

    socket.on('timer_tick', function(msg) {
        $('#timer-label').text('Testing running for ');  
        updateTimer(msg.elapsed_time);
    });
    
    socket.on('terminated', function(msg) {
        $('#timer-label').text('Terminated on: ');
        $('#timer-clock').text(msg.timestamp);
        
        // Disable all buttons
        $('button').prop('disabled', true);
    });

    socket.on('test_execution_started', function(msg) {
        $('#timer-label').text('Testing running for ');
        $('#timer-clock').text('0 seconds');
    });

    socket.on('test_execution_stopped', function(msg) {
        $('#timer-label').text('Testing finished in ');        
    });

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    // Finds the table row that shows the status for the testCase
    function getTestCaseStatusRow(testCase) {
        let div = $('#testcases');
        return div.find('td').filter(function() { return $(this).text() == testCase.name; }).parent().next();
    }

    // Only if the testCase has a non-empty build log, ensure there is a link for opening it
    function refreshBuildLogLinkIfNeeded(row, testCase) {
        if (testCase.buildLog != "" && row.find('.testcase-buildlog a').length == 0) {            
            row.find('.testcase-buildlog').append('<a href="/buildLog?testCase=' + encodeURIComponent(testCase.name) + '" target="_blank">Build Log</a>');
        }
        else if (testCase.buildLog == "" && row.find('.testcase-buildlog a').length > 0) {
            row.find('.testcase-buildlog a').remove();
        }
    }

    // Only if the testCase has non-empty test logs, ensure there are links for opening them.
    function refreshTestLogLinksIfNeeded(row, testCase) {
        if (testCase.testLogStdOut != "" && row.find('.testcase-testlog-stdout a').length == 0) {            
            row.find('.testcase-testlog-stdout').append('<a href="/testLog?testCase=' + encodeURIComponent(testCase.name) + '&stream=stdout" target="_blank">Test Log (stdout)</a>');
        }
        else if (testCase.testLogStdOut == "" && row.find('.testcase-testlog-stdout a').length > 0) {            
            row.find('.testcase-testlog-stdout a').remove();
        }

        if (testCase.testLogStdErr != "" && row.find('.testcase-testlog-stderr a').length == 0) {            
            row.find('.testcase-testlog-stderr').append('<a href="/testLog?testCase=' + encodeURIComponent(testCase.name) + '&stream=stderr" target="_blank">Test Log (stderr)</a>');
        }
        else if (testCase.testLogStdErr == "" && row.find('.testcase-testlog-stderr a').length > 0) {            
            row.find('.testcase-testlog-stderr a').remove();
        }
    }

    // Make sure the state of the filter checkbox is correctly applied
    function applyFilter() {
        let isFilterApplied = $("#filter_failed").is(':checked');
        $('.testcase-status.testcase-success').each(function (i) {
            $(this).add($(this).prev()).toggle(!isFilterApplied);
        });
    }

    function updateTestCase(row, testCase) {
        if (row.length == 0)
            return; // Not found
        
        // Remove any old dynamic classes before setting new ones        
        row.removeClass('testcase-success testcase-failure testcase-status-Pending testcase-status-Building testcase-status-Built testcase-status-Running testcase-status-Completed');
        row.addClass('testcase-status-'+ testCase.state);
        row.find('.testcase-state').text(testCase.state);        

        refreshBuildLogLinkIfNeeded(row, testCase);
        refreshTestLogLinksIfNeeded(row, testCase);

        if (testCase.hasOwnProperty('buildResultCode') && testCase.buildResultCode != 0) {
            // Build failure
            row.find('.testcase-state').attr('title', 'The build failed with status code ' + testCase.buildResultCode);
            row.addClass('testcase-failure');  
            row.find('.testcase-state').text(row.find('.testcase-state').text() + ' (FAILED)');
        }
        else if (testCase.hasOwnProperty('verdict')) {
            // The test was run and we have a verdict
            if (testCase.verdict == 'passed')
                row.addClass('testcase-success');  
            else
                row.addClass('testcase-failure');  
            let testCaseStateCell = row.find('.testcase-state');
            testCaseStateCell.text(testCaseStateCell.text() + ' (' + testCase.verdict +')');
        }

        if (testCase.hasOwnProperty('endTime')) {
            // Progress for this testcase has stopped. Show elapsed time.
            let elapsedSec = Math.floor((new Date(testCase.endTime) - new Date(testCase.startTime)) / 1000);
            let elapsedMinutes = 0;
            let elapsedHours = 0;
     
            if (elapsedSec >= 3600) {
                elapsedHours = Math.floor(elapsedSec/3600);
                elapsedSec = elapsedSec % 3600;
            }
            if (elapsedSec >= 60) {
                elapsedMinutes = Math.floor(elapsedSec/60);
                elapsedSec = elapsedSec % 60;
            }
            let elapsedTime = '';
            if (elapsedHours)
                elapsedTime += elapsedHours + ' h ';
            if (elapsedMinutes)
                elapsedTime += elapsedMinutes + ' min ';
            elapsedTime += elapsedSec + ' sec ';

            row.find('.testcase-elapsedTime').text(elapsedTime);
        }
        else {
            // Test case has no end time (i.e. it's running).
            row.find('.testcase-elapsedTime').text('');
        }

        // Update executive summary       
        let passedCount = $('.testcase-status.testcase-success').length;
        let failureCount = $('.testcase-status.testcase-failure').length
        $('#passed_count').text('Passed: ' + passedCount);
        $('#failed_count').text('Failed: ' + failureCount);
        if (failureCount > 0) {
            $('#executive_summary').addClass('testcase-failure');
            $('#executive_summary').removeClass('testcase-success');
            $('#failed_count').addClass('testcase-failure');
        }
        else {            
            $('#failed_count').removeClass('testcase-failure');
        }
        if (passedCount > 0) {            
            $('#executive_summary').addClass('testcase-success');
            $('#executive_summary').removeClass('testcase-failure');
            $('#passed_count').addClass('testcase-success');
        }

        // Update Run button enablement conditions
        let runEnabled = testCase.state == 'Completed' || (testCase.state == 'Built' && testCase.buildResultCode != 0);
        row.find('.testcase-run-button').prop('disabled', !runEnabled);
        row.find('.testcase-clean-button').prop('disabled', !runEnabled); // Use same condition for clean buttons

        // The Run All and Clean All buttons should only be enabled when no test is running
        $('#run_all_button').add($('#clean_all_button')).prop('disabled', $('#testcase_table').find('.testcase-run-button:disabled').length > 0);

        // The Run All Failed button should only be enabled when no test is running and there is at least one failed test
        $('#run_all_failed_button').prop('disabled', ($('#testcase_table').find('.testcase-run-button:disabled').length > 0) || (failureCount == 0));

        // Make sure the filter is correctly applied
        applyFilter();
    }

    socket.on('testCaseUpdate', function(testCase) {
        updateTestCase(getTestCaseStatusRow(testCase), testCase);
    });

    socket.on('buildLogUpdate', function(testCase) {
        let row = getTestCaseStatusRow(testCase);
        refreshBuildLogLinkIfNeeded(row, testCase);                
    });

    socket.on('testLogUpdate', function(testCase) {
        let row = getTestCaseStatusRow(testCase);
        refreshTestLogLinksIfNeeded(row, testCase);                
    });

    socket.on('testcase_cleaned', function(msg) {                    
        window.alert(msg);            
    });

    $('#terminate_button').click(function() {
        $.get('/terminate', function () {});
    });

    // Show all test cases in the test case table
    function showTestCases (testCases) {
        $('#total_count').text('Total: ' + testCases.length);             

        for (let testCase of testCases) {  
            let testCaseDescHTML = (testCase.description == '<missing description>') ? 
                '<p class="testcase-missing-description">' + escapeHtml(testCase.description) + '</p>' : 
                (testCase.isHTMLDescription ? testCase.description : escapeHtml(testCase.description));
            $('#testcase_table').append('<tr><td class="testcase-name">' + testCase.name + 
                '</td><td class="testcase-description" colspan="5">' + testCaseDescHTML + '</td></tr>' +
                '<tr class="testcase-status"><td class="testcase-state"></td><td class="testcase-buildlog"></td><td class="testcase-testlog-stdout"></td><td class="testcase-testlog-stderr"></td><td class="testcase-elapsedTime"></td><td class="testcase-button-group"><button type="button" class="testcase-run-button">Run</button>&nbsp;<button type="button" class="testcase-clean-button">Clean</button></td></tr>');
            

            updateTestCase(getTestCaseStatusRow(testCase), testCase);            
        }    

        $('.testcase-run-button').click(function() {
            // Get the name of the testcase whose Run button was clicked, and run it
            let testCaseName = $(this).closest('tr').prev().find('.testcase-name').text();
            $.get('/runTest?testCase=' + testCaseName);
        });

        $('.testcase-clean-button').click(function() {
            // Get the name of the testcase whose Clean button was clicked, and clean it
            let testCaseName = $(this).closest('tr').prev().find('.testcase-name').text();
            $.get('/cleanTest?testCase=' + testCaseName);
        });

    }

    $('#run_all_button').click(function() {
        $('#testcase_table').empty();
        $('#executive_summary').removeClass();
        $('#passed_count').removeClass();
        $('#failed_count').removeClass();
        $.get('/runAllTests', function (testCases) {
            showTestCases(testCases);        
        });
    });

    $('#run_all_failed_button').click(function() {
        $('.testcase-status.testcase-failure').each(function(i) {
            let testCaseName = $(this).prev().find('.testcase-name').text();
            $.get('/runTest?testCase=' + testCaseName);
        });            
    });

    $('#clean_all_button').click(function() {        
        $.get('/cleanAllTests', function (msg) {
            window.alert(msg);
        });
    });
    
    // Get data about test cases and populate the web page accordingly
    $.get('/getTestData', function (testData) {   
        $('#testsuite-name').text(testData.testSuite)
        showTestCases(testData.testCases);
    });

    // Get total execution time
    $.get('/getTotalTime', function (elapsed_time) {        
        updateTimer(elapsed_time);
    });

    $("#filter_failed").change(function() {
        applyFilter();
    });
});