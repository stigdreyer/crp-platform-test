if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';

var AuthClient = require('crp-auth-client');
var TaskClient = require('crp-task-client');
var TaskProducerClient = require('crp-task-producer-client');

//Authentication using your CrowdProcess login information
AuthClient.login('email', 'password', function(err, credential) {
	
  console.log('Logging onto server:', err ? 'FAILURE' : 'SUCCESS');
  if(err) return;

	//Options for creating task and dataunit stream
  var options = {
	   bid: 1,
	   program: 'function Run(d){return d;}', //Most basic CrowdProcess tasks
	   credential: credential
	};

	createTask(options);
});

function createTask(options) {

	var taskClient = TaskClient({
    	credential: options.credential
    });

	//Create CrowdProcess task
	taskClient.tasks.create({
    	bid: options.bid,
    	program: options.program
    }, afterTaskCreated);

	function afterTaskCreated(err, task) {
    console.log('Creating task:', err ? 'FAILURE' : 'SUCCESS');
    if(err) return;

    //Create dataunit stream to send dataunits directly to CrowdProcess
    var stream = TaskProducerClient({
      credential: options.credential,
      taskId: task._id
    });

    //Counter for the different responses emitted by CrowdProcess
    var sent = 0;
    var received = 0;
    var errors = 0;
    var faults = 0;

    console.log('Sending dataunits...');

    for (var i = 0; i < 5; i++) {
      stream.write(i);
    };

    console.log('Waiting to receive dataunits...');

    var id = setTimeout(function() {

      console.log("Sorry...It took too long to receive the first result!");
      process.exit(1);

    }, 15000);

    //Catch errors emited by CrowdProcess
    stream.on('error', function() {

      errors++;   

    });

    //Catch faults emited by CrowdProcess
    stream.on('fault', function() {

      faults++;   

    });

    //Receive results from CrowdProcess
    stream.on('result', function(data) {

      if(received === 0) clearTimeout(id);

    	received++; 	

    });

    //Result stream from CrowdProcess ended
    stream.once('end', function() {

      console.log('Received all results:', sent - received ? 'FAILURE' : 'SUCCESS');
      console.log('Encountered errors:', errors ? 'YES' : 'NO');
      console.log('Encountered faults:', faults ? 'YES' : 'NO');

      console.log('Done!');

    });

	}

}