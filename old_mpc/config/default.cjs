module.exports = {
  urls: {
    MPC_PARAMS_URL:
      'https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/mpc_params',
    RADIX_FILES_URL: 'https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/radix',
    CIRCUIT_FILES_URL:
      'https://nightfallv3-proving-files.s3.eu-west-1.amazonaws.com/phase2/compiled_circuits',
  },
  circuits: ['deposit', 'double_transfer', 'single_transfer', 'withdraw'],
};
