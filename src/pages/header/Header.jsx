import { Stack, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
 export default function BasicGrid() {
    return (
    <Box sx={{ flexGrow: 1, background:'#f2f9ff'}}>
      <Grid container  display={'flex'} justifyContent={'center'} alignItems={'center'} ml={10} mr={10}>
        <Grid item size={2} display={'flex'} justifyContent={'center'}>
                  <Avatar
                      src='https://saras.cbse.gov.in/SARAS/ui/assets/images/cbse-logo.png'
                      sx={{ width: {xs: 40, sm: 117}, height: {xs: 40, sm: 130}, p:2 }}
                  />
        </Grid>
              <Grid item size={8} display={'flex'} justifyContent={'center'} >
                  <Stack direction={{ xs: 'column' }}
                      spacing={1}>
                     <Typography
                      variant="h4"
                      align="center"
                      sx={{ fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' } }}
                  >
                      Department of Skill Education
                    </Typography>
                         <Typography
                      variant="h6"
                      align="center"
                          sx={{ fontSize: { xs: '.5rem', sm: '0.8rem', md: '1rem' } }}
                          fontWeight={600}
                  >
                      Skill Participant and Certificates
                  </Typography> 
        </Stack>
          
        </Grid>
        <Grid item size={2} display={'flex'} justifyContent={'center'}>
          <Avatar
              src="https://saras.cbse.gov.in/SARAS/ui/assets/images/digitalcbselogo.png"
            sx={{ width: {xs: 40, sm: 80}, height: {xs: 40, sm: 80}, p:2  }}
            />
        </Grid>
          </Grid>
          
            </Box>
  );
}
