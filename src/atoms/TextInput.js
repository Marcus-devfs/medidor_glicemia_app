import { TextField } from "@mui/material";
import { Colors } from "../organisms";
import { useAppContext } from "../context/AppContext";
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { Box } from "./Box";
import { Text } from "./Text";
import { useState } from "react";


export const TextInput = (props) => {
   const { InputProps = {}, label = '', bold = false, InputLabelProps = {}, small = false, secondary = false } = props;
   const { colorPalette } = useAppContext();
   const [showPassword, setShowPassword] = useState(false);

   const handleClickShowPassword = () => {
      setShowPassword((show) => {
         return !show;
      });
   };

   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };

   return (
      <TextField
         {...props}
         autoComplete='off'
         id="fieldssss"
         label={label}
         type={props.type === 'password' ? (showPassword ? 'text' : 'password') : props.type}
         InputProps={{
            ...InputProps,
            autocomplete: 'no',
            autoComplete: 'off',
            form: {
               autocomplete: 'off',
            },
            sx: {
               transition: 'background-color 1s',
               disableUnderline: true,
               fontSize: small ? '12px' : { xs: '13px', xm: '13px', md: '13px', lg: '14px', xl: '15px' },
               fontFamily: bold ? 'MetropolisBold' : 'MetropolisRegular',
               backgroundColor: secondary ? colorPalette.secondary : colorPalette.inputColor,
               ...InputProps?.style,
               color: colorPalette.textColor,
               maxHeight: props.multiline ? 'none' : '45px',
            },

            endAdornment: props.type === 'password' ? (
               <InputAdornment position="end">
                  <IconButton
                     aria-label="toggle password visibility"
                     onClick={handleClickShowPassword}
                     onMouseDown={handleMouseDownPassword}
                     edge="end"
                  >
                     {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
               </InputAdornment>
            ) : null,

            startAdornment: props.type === "coin"
               ? (
                  <InputAdornment position="start">
                     <Text>R$ </Text>
                  </InputAdornment>
               )
               : props.type === "search"
                  ? (
                     <InputAdornment position="start">
                        <Box sx={{
                           ...styles.menuIcon,
                           filter: 'brightness(0) invert(.7)',
                           backgroundImage: `url('/icons/search_input_icon.png')`,
                           transition: '.3s',
                           "&:hover": {
                              opacity: 0.8,
                              cursor: 'pointer'
                           }
                        }} />
                     </InputAdornment>
                  )
                  : null,
         }}
         InputLabelProps={
            props.type === "date" || props.type === "datetime-local"
               ? {
                  shrink: true,
                  style: {
                     color: colorPalette.textColor,
                     fontSize: { xs: '13px', xm: '13px', md: '13px', lg: '13px', xl: '14px' },
                     fontFamily: 'MetropolisBold',
                     zIndex: 9
                  },
                  sx: {
                     zIndex: 9
                  }
               }
               : {
                  sx: {
                     color: colorPalette.textColor,
                     fontSize: {
                        xs: '13px',
                        xm: '13px',
                        md: '13px',
                        lg: '13px',
                        xl: '14px'
                     },
                     fontFamily: 'MetropolisBold',
                     zIndex: 99,
                     ...InputLabelProps?.style
                  }
               }
         }
      />
   );
};

const styles = {
   date: {
      // display: 'none',
      display: 'block',
      fontSize: { xs: '13px', xm: '13px', md: '13px', lg: '14px', xl: '15px' },
      fontFamily: 'MetropolisBold',
   },
   menuIcon: {
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: 20,
      height: 20,
   },
}