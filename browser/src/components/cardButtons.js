import CardActions from '@mui/material/CardActions';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { MANUAL_ENTROPY_MIN_LENGTH } from '../constants';

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  flex: '0 0 100%',
  flexWrap: 'wrap',
  width: '60%',
  margin: 'auto',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: '1 0 100%',
  marginLeft: '0px !important',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: '2% auto',
}));

export default function Buttons({
  submitted,
  isMobile,
  entropyOverride,
  setEntropyOverride,
  setEntropy,
  entropy,
  applyContrib,
  setName,
}) {
  return (
    <StyledCardActions>
      {isMobile || entropyOverride ? (
        <StyledTextField
          size="small"
          id="outlined-basic"
          label="Entropy"
          variant="outlined"
          submitted
          onChange={e => {
            e.target.value.length > MANUAL_ENTROPY_MIN_LENGTH
              ? setEntropy(e.target.value)
              : setEntropy(null);
          }}
        />
      ) : (
        <></>
      )}
      <StyledTextField
        size="small"
        id="outlined-basic"
        label="Name (optional)"
        variant="outlined"
        submitted
        disabled={!entropy}
        onChange={e => setName(e.target.value)}
      />

      {!entropy && !isMobile && (
        <StyledButton size="small" onClick={setEntropyOverride}>
          Input my own entropy
        </StyledButton>
      )}
      <StyledButton size="small" disabled={!entropy || submitted} onClick={applyContrib}>
        Contribute
      </StyledButton>
    </StyledCardActions>
  );
}
