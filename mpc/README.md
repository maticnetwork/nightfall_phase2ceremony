# NOTES

# Phase1

We need to prepare phase2:
https://github.com/iden3/snarkjs#7-prepare-phase-2

For this we need first to know the number of constraints for our circuits and select the correct ptau file.

Then we get this `pot12_final.ptau` and compute the `.key` file that will be hosted somewhere and downloaded on our react app:
https://github.com/iden3/snarkjs#groth16

Then on the browser we're able to run this:
https://github.com/iden3/snarkjs#16-contribute-to-the-phase-2-ceremony

We should also provide a button to verify the latest .key:
https://github.com/iden3/snarkjs#19-verify-the-latest-zkey
