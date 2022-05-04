const log = async (zokrates, resolve, reject) => {
  let output = '';

  zokrates.stdout.on('data', data => {
    output += data.toString('utf8');
  });

  zokrates.stderr.on('data', err => {
    console.log(err);
    reject(new Error(`Setup failed: ${err}`));
  });

  zokrates.on('close', () => {
    console.log(output);
    // ZoKrates sometimes outputs error through stdout instead of stderr,
    // so we need to catch those errors manually.
    if (output.includes('panicked')) {
      reject(new Error(output.slice(output.indexOf('panicked'))));
    }
    resolve(output);
    return output;
  });
};

export default log;
