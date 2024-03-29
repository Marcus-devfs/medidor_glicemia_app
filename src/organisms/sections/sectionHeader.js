import { useRouter } from "next/router";
import { Box, Button, Text } from "../../atoms";
import { useAppContext } from "../../context/AppContext";
import { Colors } from "../layout/Colors";

export const SectionHeader = (props) => {
   const {
      perfil = '',
      title = '',
      newButton = false,
      newButtonAction = () => { },
      saveButton = false,
      saveButtonAction = () => { },
      deleteButton = false,
      deleteButtonAction = () => { },
      resetButton = false,
      resetButtonAction = () => { },
      customButton = false,
      customButtonText = '',
      customButtonAction = () => { },
      icon = null
   } = props;

   const { colorPalette } = useAppContext()

   return (
      <>
         <Box sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
         }}>
            <Box sx={{ display: 'flex', flex: 1, height: '100%', maxWidth: '100%', gap: 2, overflow: 'hidden', position: 'relative', alignItems: 'center' }}>
            <Box sx={{display: 'flex', height: '45px', width: 5, backgroundColor: colorPalette.buttonColor}}/>
             {icon &&  <Box sx={{
                  ...styles.icon,
                  backgroundImage: `url('${icon}')`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  filter: 'brightness(0) invert(0)',
                  width: 35,
                  height: 35,
                  display: 'flex'
               }} />}
               <Text
                  veryLarge='true'
                  bold='true'
                  style={{
                     whiteSpace: 'nowrap',
                     textAlign: { xs: `center`, sm: 'start', md: 'start', lg: 'start' },
                     color: colorPalette.textColor
                  }}>{title}</Text>
               {perfil &&
                  <Box sx={{ backgroundColor: colorPalette.buttonColor, borderRadius: 2, padding: '5px 12px 2px 12px', transition: 'background-color 1s', }}>
                     <Text xsmall bold style={{ color: "#fff" }}>{perfil}</Text>
                  </Box>
               }
               <Box sx={{ display: { xs: 'none', sm: 'flex', md: 'flex', lg: 'flex' }, position: 'absolute', top: 0, right: 0, height: '100%' }}>
                  <Box sx={{
                     width: { sm: 100, md: 100, lg: 200 }, height: '100%',
                  }} />
               </Box>
            </Box>
            <Box sx={{
               display: 'flex',
               position: 'fixed',
               justifyContent: { xs: 'center', sm: 'end', md: 'end', lg: 'end' },
               bottom: { xs: 0, sm: 20, md: 20, lg: 20, xl: 50 },
               right: { xs: 0, sm: 20, md: 40, lg: 60, xl: 60 },
               maxWidth: '350px',
               // margin: { xs: 'auto' },
               zIndex: 9999,
               padding: { xs: 2, sm: 0, md: 0, lg: 0 },
               // backgroundColor: colorPalette.primary,
               gap: 1,
               transition: 'background-color 1s',
            }}>
               {newButton && <Button text='Novo' style={{ width: 150 }} onClick={newButtonAction} />}
               {saveButton && <Button text='Salvar' style={{ width: 150 }} onClick={saveButtonAction} />}
               {resetButton && <Button secondary text='Resetar senha' style={{ width: 150 }} onClick={resetButtonAction} />}
               {deleteButton && <Button secondary text='Excluir' style={{ width: 150 }} onClick={deleteButtonAction} />}
               {customButton && <Button tertiary text={customButtonText} style={{ width: 150 }} onClick={customButtonAction} />}
            </Box>
         </Box>
      </>
   )
}

const styles = {
   icon: {
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      width: '15px',
      height: '15px',
      marginRight: '0px',
      backgroundImage: `url('/favicon.svg')`,
   },
}
