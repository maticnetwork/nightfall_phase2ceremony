import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';

const StyledList = styled(List)(({ theme }) => ({
  flex: '1 0 100%',
  margin: '2% auto',
}));

export default function SubmissionProgress({ circuits, circuitsSubmitted }) {
  return (
    <StyledList>
      {circuits.map(circuit => {
        return (
          <ListItem disablePadding>
            <ListItemIcon>
              {circuitsSubmitted.includes(circuit) ? <CheckIcon /> : <CircularProgress />}
            </ListItemIcon>
            <ListItemText primary={circuit} />
          </ListItem>
        );
      })}
    </StyledList>
  );
}
