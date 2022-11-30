import AWS from 'aws-sdk';
import branchName from 'current-git-branch';
const s3 = new AWS.S3();

export async function upload({ circuit, name, data, beacon = false }) {
  const uploadParams = {
    Bucket: `mpc-${branchName()}`,
    Key: `${circuit}/${beacon ? 'beacon' : name}.zkey`,
    Body: data,
  };

  await s3.putObject(uploadParams, function (err, data) {
    if (err) {
      console.log('Error', err);
    }
    if (data) {
      console.log('Upload Success', data.Location);
    }
  });
}
