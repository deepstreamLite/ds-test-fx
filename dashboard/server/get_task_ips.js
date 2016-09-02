const AWS = require('aws-sdk');
const ecs = new AWS.ECS({region: 'eu-west-1'});
const ec2 = new AWS.EC2({region: 'eu-west-1'});
const deepstream = require( 'deepstream.io-client-js' )

const CLUSTER = 'deepstream-perf-cluster';
const SERVICE = 'deepstream-server'

const ds = deepstream('52.210.144.102:6021')
ds.login();

const serverRecord = ds.record.getRecord('servers');

function getIP(containerArns) {
	return ecs.describeContainerInstances({ containerInstances: containerArns, cluster: CLUSTER  }).promise()
		.then(data => {
			var i_ids = data.containerInstances.map(d => { return d.ec2InstanceId })
			//console.log(i_ids);
			return ec2.describeInstances({ InstanceIds: i_ids }).promise()
		})
		.catch( err => {
			serverRecord.set( 'ips', [] );
		} );
}

function listServerIps(){
	var params = {
		cluster: CLUSTER,
		serviceName: SERVICE
	};

	ecs.listTasks(params, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else	 {
			//console.log(data);		   // successful response
			describeTasks(data.taskArns);
		}

	});
}

function describeTasks(taskArns){
	ecs.describeTasks({
		tasks: taskArns,
		cluster: CLUSTER
	}, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else     {
			getIP(data.tasks.map(data => {
				return data.containerInstanceArn;
			})).then(updateServerRecord)
			//console.log(data);           // successful response
		}

	});

}



function updateServerRecord(data) {
	console.log( 'Updating Server Record' );

	//console.log(JSON.stringify(data));
	serverRecord.set(
			'ips',
			data.Reservations.map( res => {
				return res.Instances.map(res => {
					return res.PublicIpAddress;
				})
			}).reduce((prev, curr) =>{
				return prev.concat(curr);
			})
			);
	console.log(serverRecord.get());
}

setInterval(listServerIps, 60000);
listServerIps();
