import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";

export default function HomePageContainer() {
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container display={'flex'} justifyContent={'center'} alignItems={'center'} mt={12} spacing={4}>
      <Grid item size={2} display={'flex'} justifyContent={'center'} onClick={()=> navigate(`/certificate/templates`)}>
          <Card sx={{ width:"100%", padding:2 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="100"
                image="/assets/images/certificate-gradient.png"
                alt="green iguana"
                sx={{objectFit : "contain"}}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" display={'flex'} justifyContent={'center'}>
                  Certificate Template
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item size={2} display={'flex'} justifyContent={'center'} onClick={()=> navigate(`/certificate/participants`)}>
          <Card sx={{ width:"100%", padding:2 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="100"
                image="/assets/images/participant.png"
                alt="green iguana"
                sx={{objectFit : "contain"}}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" display={'flex'} justifyContent={'center'}>
                  Participant List
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

    </Box>
  );
}
