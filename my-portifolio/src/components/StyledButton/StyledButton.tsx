import styled from "styled-components"
import theme from "../../theme"
import { ReactNode } from "react"

interface StyledButtonProps {
    children: ReactNode
}


const StyledButton: React.FC<StyledButtonProps>= ({children} )=> {
    const StyledButton = styled("button")(() => ({
        backgroundColor:"transparent",
        border:`10px${theme.palette.primary.contrastText}`,
        borderRadius:"3px",
        padding:"5px 15px",
        width: "100%",
        color: theme.palette.primary.contrastText,
        display: 'inline-flex',
        alignItems:'center',
        justifyContent:'center',
        gaps: '10px',
       '&:hover': {
        backgroundColor:`${theme.palette.secondary.light}`,
      }
    }))

  return (
    <>
    <StyledButton>{children}</StyledButton>
    </>
  )
}

export default StyledButton
