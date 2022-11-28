import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { ENTROPY_ARRAY_MAX_SIZE } from '../constants';

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  marginBottom: '2%',
}));

export default function EntropyProgress({ entropy, entropyArr, isMobile, entropyOverride }) {
  if (!entropy && !isMobile && !entropyOverride) {
    return (
      <>
        <Typography paragraph variant="body" textAlign={'left'}>
          Collecting Entropy...
        </Typography>
        <StyledLinearProgress
          variant="determinate"
          value={(entropyArr.length * 100) / ENTROPY_ARRAY_MAX_SIZE}
        />
      </>
    );
  }
}
