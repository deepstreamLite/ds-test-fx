# ds-test-fx

[![Greenkeeper badge](https://badges.greenkeeper.io/deepstreamIO/ds-test-fx.svg)](https://greenkeeper.io/)
A FX Price Update Benchmark for deepstream.io

To run:

- setup a control deepstream instance on ec2 and provision it using
  ./scripts/provision-deepstream.sh

- update the url of the control deepstream in ./shared/options.js (or set
  controlDsUrl option)

- serve the dashboard (eg. python -m SimpleHTTPServer)

- connect to the dashboard

- make sure the docker repo has up-to-date versions of test-harness/client
  using ./scripts/clientDocker.sh

- setup test deepstreams using ec2 or ecs and ./scripts/provision-deepstream.sh

- setup an ecs cluster for the test clients and scale up several clients using
  ./scripts/ecs-scale-clients.sh

- manually give the clients the ips of the test deepstreams(if using ec2) using
  the inspector console on the dashboard

```javascript
let ips = ['TESTDEEPSTREAM1:6020', 'TESTDEEPSTREAM2:6020'];
let servers = ds.record.getRecord('servers');
servers.set('ips', ips);
```

- if the ips need to be distributed evenly, consider then reassigning them
  on a round-robin fashion e.g.

```javascript
window.probes().forEach( (probe, idx) => {
    probe.serverIp(ips[idx % ips.length])
} );
```

