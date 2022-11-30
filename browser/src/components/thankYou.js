import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

export default function ThankYou({ circuits, circuitsSubmitted, verifications }) {
  if (circuits.every((circuit, i) => circuit === circuitsSubmitted[i])) {
    return (
      <>
        <Typography paragraph align="center" variant="h5" marginTop={'4%'}>
          Thank you for your contribution!
        </Typography>
        {/* <Typography paragraph align="center" variant="body" marginTop={'4%'}>
          More details about your contribution:
        </Typography>
        {circuits.map(circuit => {
          return (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{circuit}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography style={{ whiteSpace: 'pre-line' }}>
                  <Typography variant="h6">Contributions so far:</Typography>
                  {verifications[circuit].split('contribution').map(p => (
                    <p>{p}</p>
                  ))}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })} */}
      </>
    );
  }
}
