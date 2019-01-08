/**
* Teamwork Web Data Connector for Tableau (test)
* Before testing, run 'npm start'
* and http://localhost:8888/Simulator/index.html
*/

(function () {
	// the tableau object is de defined in the WDC library
	// makeConnector is a constructor that predefines some methods for our connector object
    var myConnector = tableau.makeConnector();

	// Init function for connector, called during every phase
	  myConnector.init = function(initCallback) {
	      tableau.authType = tableau.authTypeEnum.basic;
	      initCallback();
	  }

    // get the schema for the data we need
    myConnector.getSchema = function (schemaCallback) {

	    tableau.log(">>teamworkWDC.js: myConnector.getSchema");

    	// cols is an array of JS objects. each obj defines a single column in our table. such as mag, title, loc
    	// for each col you can specify more options like 'alias' for a display name and columnRole to etermine type
    	// id can only contain alpha chars
	    var cols = [{
	        id: "id",
	        dataType: tableau.dataTypeEnum.string
	    }, {
	        id: "name",
	        alias: "projectName",
	        dataType: tableau.dataTypeEnum.string
	    }, {
	        id: "totalHoursEstimated",
	        dataType: tableau.dataTypeEnum.string
	    }, {
	        id: "completedHoursEstimated",
	        dataType: tableau.dataTypeEnum.string
	    }];

	    // tableSchema var defines schema for a single table and contains a JS obj
	    var tableSchema = {
	        id: "id",
	        alias: "Teamwork data is the best data",
	        columns: cols
	    };

		// takes an array of table objs. in this case, only the table obj which is tableSchema
	    schemaCallback([tableSchema]);
	};


	// get the data
	// params: table: is an obj defined by the WDC to which we can append data. doneCallback is triggered when data has arrived.
	myConnector.getData = function(table, doneCallback) {

		// jQuery function to get data from a feed and use a success handler to store the data in the resp var
	    $.getJSON("https://domandtom.teamwork.com/projects/283197/time/total.json", function(resp) {
	        var proj = resp.projects,
	            tableData = [];

	        for (var i = 0, len = proj.length; i < len; i++) {
	            tableData.push({
	                "id": proj[i].id,
	                "name": proj[i].name,
	                "totalHoursEstimated": proj[i].time-estimates.total-hours-estimated,
	                "completedHoursEstimated": proj[i].time-estimates.completed-hours-estimated
	            });
	        }

	        // appends the tableData array to the table obj as JS
	        table.appendRows(tableData);
	        doneCallback();
	    });
	};

    // validate the connector obj before init
    tableau.registerConnector(myConnector);

	// when the page loads, this function runs
    $(document).ready(function () {
    	// define a button click listener for the button on teamworkWDC.html's submitButton
	    $("#submitButton").click(function () {
	        tableau.connectionName = "Teamwork Feed";	// this is what Tableau will display as the data source
	        tableau.submit();	// send to Tableau for validation
	    });
	});

})();