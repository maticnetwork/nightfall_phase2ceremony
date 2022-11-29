import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Haikunator from 'haikunator';
import EntropyProgress from './entropyProgress';
import Buttons from './cardButtons';
import SubmissionProgress from './submissionProgress';
import ThankYou from './thankYou';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  display: 'flex',
  flexDirection: 'column',
}));

export function ContributeCard({ setEntropy, entropy, entropyArr, circuits, isMobile }) {
  let [name, setName] = React.useState();
  const [submitted, setSubmitted] = React.useState(false);
  const [circuitsSubmitted, setCircuitsSubmitted] = React.useState([]);
  const [entropyOverride, setEntropyOverride] = React.useState(false);

  const [verifications, setVerifications] = React.useState();

  const haikunator = new Haikunator({
    defaults: {
      delimiter: '',
      tokenLength: 2,
    },
  });

  async function applyContrib() {
    setSubmitted(true);
    console.log('START: ', new Date());

    const vers = {};
    for (const circuit of circuits) {
      if (!name) name = haikunator.haikunate();
      const verification = await window.applyContrib({
        circuit,
        type: 'contribution',
        name,
        contribData: entropy,
        branch: process.env.REACT_APP_BRANCH || 'main',
      });
      vers[circuit] = verification;
      setCircuitsSubmitted(circuitsSubmitted => [...circuitsSubmitted, circuit]);
    }
    setVerifications(vers);
    console.log('END: ', new Date());
  }

  return (
    <StyledCard>
      <CardHeader title="Nightfall Phase2 Ceremony"></CardHeader>
      <CardContent>
        <Typography paragraph align="center" variant="body">
          Zero-knowledge proofs require a trusted setup.
        </Typography>
        <Typography paragraph variant="body">
          Since Nightfall uses the Groth16 proving scheme, a second phase of the MPC is needed, for
          each circuit.
        </Typography>
        <Typography paragraph variant="body">
          We want to invite you to contribute to this Second Phase.
          {isMobile
            ? 'To start, just input some random stuff. '
            : 'To start, just move your mouse around to generate some entropy. '}
          If you want, you can also enter your name for later verification.
        </Typography>
        <Typography paragraph variant="body">
          The process takes 10-20mins. Go grab a coffee!
        </Typography>
      </CardContent>
      <EntropyProgress
        entropy={entropy}
        entropyArr={entropyArr}
        isMobile={isMobile}
        entropyOverride={entropyOverride}
      />
      {!submitted ? (
        <Buttons
          submitted={submitted}
          isMobile={isMobile}
          entropyOverride={entropyOverride}
          setEntropyOverride={setEntropyOverride}
          setEntropy={setEntropy}
          entropy={entropy}
          applyContrib={applyContrib}
          setName={setName}
        />
      ) : (
        <SubmissionProgress circuits={circuits} circuitsSubmitted={circuitsSubmitted} />
      )}
      <ThankYou
        circuits={circuits}
        circuitsSubmitted={circuitsSubmitted}
        verifications={verifications}
      />
    </StyledCard>
  );
}
