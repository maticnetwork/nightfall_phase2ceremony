// Load the AWS SDK for Node.js
import AWS from 'aws-sdk';
// Load credentials and set region from JSON file
AWS.config.update({ region: process.env.AWS_REGION });

// Create EC2 service object
var ec2 = new AWS.EC2();

// AMI is amzn-ami-2011.09.1.x86_64-ebs
var instanceParams = {
  ImageId: process.env.ECS_IMAGE_ID,
  InstanceType: 't2.micro',
  KeyName: process.env.ECS_KEY_PAIR_NAME,
  MinCount: 1,
  MaxCount: 1,
};

// Create a promise on an EC2 service object
var instancePromise = new AWS.EC2().runInstances(instanceParams).promise();

// Handle promise's fulfilled/rejected states
instancePromise
  .then(function (data) {
    console.log(data);
    var instanceId = data.Instances[0].InstanceId;
    console.log('Created instance', instanceId);
    // Add tags to the instance
    tagParams = {
      Resources: [instanceId],
      Tags: [
        {
          Key: 'Name',
          Value: 'Nightfall3 MPC Server',
        },
      ],
    };
    // Create a promise on an EC2 service object
    var tagPromise = new AWS.EC2({ apiVersion: '2016-11-15' }).createTags(tagParams).promise();
    // Handle promise's fulfilled/rejected states
    tagPromise
      .then(function (data) {
        console.log('Instance tagged');
      })
      .catch(function (err) {
        console.error(err, err.stack);
      });
  })
  .catch(function (err) {
    console.error(err, err.stack);
  });
