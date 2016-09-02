const AWS = require('aws-sdk');
const ecs = new AWS.ECS({region: 'eu-west-1'});
const ec2 = new AWS.EC2({region: 'eu-west-1'});
const deepstream = require( 'deepstream.io-client-js' )

const CLUSTER = 'deepstream-perf-cluster';

const ds = deepstream('52.210.144.102:6021')
ds.login();

setInterval(updateServerRecord, 60000);
updateServerRecord();

const serverRecord = ds.record.getRecord('servers');

function getIP() {
	return ecs.listContainerInstances({ cluster: CLUSTER  }).promise()
		.then(data => ecs.describeContainerInstances({ containerInstances: data.containerInstanceArns, cluster: CLUSTER  }).promise())
		.then(data => {
			var i_ids = data.containerInstances.map(d => { return d.ec2InstanceId })
			//console.log(i_ids);
			return ec2.describeInstances({ InstanceIds: i_ids }).promise()
		})
		.catch( err => {
			serverRecord.set( 'ips', [] );
		} );
}

function updateServerRecord() {
	console.log( 'Updating Server Record' );
	getIP().then(data => {
		//console.log(JSON.stringify(data));
		serverRecord.set(
			'ips',
			data.Reservations[0].Instances.map(res => {
				return res.PublicIpAddress;
			})
		);
		console.log(serverRecord.get());
	});
}
