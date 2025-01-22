import { AppBar, MenuItem, Toolbar,styled } from "@mui/material"


const Navbar= () => {
   
    const StyledToobar = styled(Toolbar)(({theme}) => ({
      display:'flex',
      justifyContent:'space-evenly'
    }))
    

  return (
    <>
<AppBar position="absolute">
    <StyledToobar>
    <MenuItem>Sobre</MenuItem>
   <MenuItem>Campo De Atuação</MenuItem>
   <MenuItem>Contato</MenuItem>
   </StyledToobar>

</AppBar>
  

    </>
  )
}

export default Navbar
