import { Avatar, Backdrop, useMediaQuery, useTheme } from "@mui/material"
import Hamburger from "hamburger-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, ContentContainer, Divider, Text } from "../../atoms"
import { Colors, icons } from "./Colors"
import { useAppContext } from "../../context/AppContext"
import { IconTheme } from "../iconTheme/IconTheme"
import { getImageByScreen } from "../../validators/api-requests"
import { DialogUserEdit } from "../userEdit/dialogEditUser"
import { api } from "../../api/api"
import { menuItems } from "../../permissions"

export const LeftMenu = ({ }) => {

   const { logout, user, colorPalette, theme, userPermissions, latestVersion, showVersion, setShowVersion } = useAppContext();
   const name = user?.name?.split(' ');
   const firstName = name[0];
   const lastName = name[name.length - 1];
   const userName = `${firstName} ${lastName}`;
   const router = useRouter();
   const pathname = router.pathname === '/' ? null : router.asPath
   const pathnameFirst = router.pathname === '/' ? null : router
   const [showMenuMobile, setShowMenuMobile] = useState(false)
   const [showDialogEditUser, setShowDialogEditUser] = useState(false)
   const [showMenuHelp, setShowMenuHelp] = useState(false)
   const [showEditUser, setShowEditUser] = useState(false)
   const [groupStates, setGroupStates] = useState(menuItems.map(() => false));
   let [photo] = user?.photoPerfil
   let photoUrl = photo?.url;

   const handleGroupMouseEnter = (index) => {
      setGroupStates((prevGroupStates) => {
         if (!prevGroupStates[index]) {
            const newGroupStates = [...prevGroupStates];
            newGroupStates[index] = true;
            return newGroupStates;
         }
         return prevGroupStates;
      });
   };

   const handleGroupMouseLeave = (index) => {
      setGroupStates((prevGroupStates) => {
         if (prevGroupStates[index]) {
            const newGroupStates = [...prevGroupStates];
            newGroupStates[index] = false;
            return newGroupStates;
         }
         return prevGroupStates;
      });
   };

   return (
      <>
         <Box sx={{
            ...styles.leftMenuMainContainer, backgroundColor: colorPalette.third, border: `1px solid rgb(255 255 255 / 0.1)`, transition: 'background-color 1s', ...(showMenuMobile && { display: 'flex' }),
            width: !showMenuHelp ? 70 : { xs: '214px', sm: '214px', md: '180px', lg: '220px', xl: '220px' }, transition: '.3s'
         }}>
            <Box sx={{ position: 'fixed', height: '100%', width: !showMenuHelp ? 70 : { xs: '214px', sm: '214px', md: '180px', lg: '220px', xl: '220px' }, padding: { xs: '10px 15px', sm: '10px 15px', md: '8px 10px', lg: showMenuHelp ? '8px 20px' : '8px 10px', xl: '10px 15px' } }}>
               <Box sx={{ display: 'flex', position: 'absolute', right: 10, top: -35 }}>
                  <Hamburger
                     toggled={showMenuHelp}
                     toggle={() => {
                        setShowEditUser(false)
                        setShowMenuHelp(!showMenuHelp)
                     }}
                     duration={0.5}
                     size={20}
                     color={'#fff'}
                  />
               </Box>
               <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                  <Box sx={{
                     ...styles.icon,
                     backgroundImage: `url('/icons/logo-diabetes-light.png')`,
                     backgroundSize: 'contain',
                     width: !showMenuHelp ? '50px' : '107px',
                     height: !showMenuHelp ? '30px' : '51px',
                     marginTop: !showMenuHelp ? 3 : 0,
                     "&:hover": {
                        cursor: 'pointer', opacity: 0.8
                     }
                  }} onClick={() => router.push('/')} />
                  <Box onClick={() => setShowVersion(true)} sx={{ cursor: 'pointer' }}>
                     <Text style={{ bottom: 45, left: 10, position: 'absolute', color: 'gray' }}> v{latestVersion?.version}</Text>
                  </Box>
               </Box>

               <Divider distance={4} color={'rgb(255 255 255 / 0.1)'} />
               <Box sx={{ ...styles.boxMenu, ...(showMenuMobile && { overflowY: 'auto' }), ...(!showMenuHelp && { width: 40, marginLeft: 1, gap: 2 }) }}>
                  {menuItems.map((group, index) => {
                     const pathRouteName = router?.asPath?.split('/')[1]
                     const toRoute = group?.to?.split('/')[1]
                     const currentPage = pathRouteName === toRoute;
                     const route = group?.queryId ? `${group?.to}/${user?._id}` : group?.to
                     return (
                        <Box key={`${group}-${index}`} sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, color: '#f0f0f0' + '77' }}
                           onMouseEnter={() => (!showMenuMobile && !showMenuHelp) && handleGroupMouseEnter(index)}
                           onMouseLeave={() => (!showMenuMobile && !showMenuHelp) && handleGroupMouseLeave(index)}
                           onClick={() => {
                              router.push(route);
                              setShowMenuHelp(false)

                           }}>
                           {currentPage && <Box sx={{ display: 'flex', height: '30px', width: 4, borderRadius: '0px 5px 5px 0px', backgroundColor: colorPalette?.buttonColor, position: 'absolute', left: 0 }} />}

                           {/* {index !== 0 && <Box sx={{ width: '100%', height: `1px`, backgroundColor: '#e4e4e4', margin: `16px 0px`, }} />} */}
                           <Box sx={{
                              display: showMenuHelp ? 'flex' : 'none',
                              transition: '.7s',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 0.5,
                              padding: `5px 8px`,
                              width: '100%',
                              borderRadius: 2,
                              opacity: 0.8,
                              "&:hover": {
                                 opacity: 0.8,
                                 cursor: 'pointer',
                                 backgroundColor: '#f0f0f0' + '22'
                              }
                           }} >
                              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1.5, position: 'relative', alignItems: 'center', position: 'relative' }}>
                                 <Box sx={{ ...styles.icon, backgroundImage: `url(${group?.icon})`, width: group.text === 'Administrativo' ? 15 : 18, height: group.text === 'Administrativo' ? 24 : 18, filter: 'brightness(0) invert(1)', transition: 'background-color 1s' }} />
                                 {<Text bold style={{ color: currentPage ? colorPalette?.buttonColor : '#fff', transition: 'background-color 1s', }}>
                                    {group?.text}
                                 </Text>}
                              </Box>
                           </Box>

                           <Box sx={{
                              display: showMenuHelp ? 'none' : 'flex',
                              alignItems: 'center',
                              transition: '.7s',
                              justifyContent: 'center',
                              width: 30,
                              height: '100%',
                              padding: '5px 0px',
                              gap: 1.5,
                              borderRadius: 2,
                              opacity: 0.8,
                              "&:hover": {
                                 opacity: 0.8,
                                 cursor: 'pointer',
                                 backgroundColor: '#f0f0f0' + '22'
                              }
                           }} >
                              <Box sx={{ ...styles.icon, backgroundImage: `url(${group?.icon})`, width: group.text === 'Administrativo' ? 15 : 18, height: group.text === 'Administrativo' ? 24 : 18, filter: 'brightness(0) invert(1)', transition: 'background-color 1s' }} />
                           </Box>

                           {!showMenuMobile ?
                              <Box sx={{
                                 display: 'flex', flexDirection: 'column',
                                 padding: '8px', ...(!showMenuHelp && {
                                    position: 'absolute',
                                    marginLeft: 4, padding: '8px',
                                 }
                                 )
                              }}>
                                 <Box sx={{
                                    flex: 1, backgroundColor: showMenuHelp ? colorPalette.third : colorPalette?.secondary, display: 'flex', marginLeft: 2, flexDirection: 'column',
                                 }}>
                                    {groupStates[index] && (
                                       <>
                                          {!showMenuHelp &&
                                             <>
                                                <Box sx={{
                                                   display: 'flex', alignItems: 'start', justifyContent: 'flex-start', padding: '10px 15px',
                                                   flexDirection: 'column'
                                                }}>
                                                   <Text bold>{group.text}</Text>
                                                </Box>
                                             </>
                                          }
                                       </>
                                    )}
                                 </Box>
                              </Box>
                              : <>
                              </>
                           }

                        </Box>
                     )
                  })}
               </Box>

            </Box>
         </Box >

         <Box sx={{ ...styles.menuResponsive, backgroundColor: colorPalette.third, gap: 2, }}>

            <Box sx={{ display: 'flex', gap: 6, height: '100%', }}>
               {menuItems?.map((item, index) => {
                  const pathRouteName = router?.asPath?.split('/')[1]
                  const toRoute = item?.to?.split('/')[1]
                  const currentPage = pathRouteName === toRoute;
                  const route = item?.queryId ? `${item?.to}/${user?._id}` : item?.to
                  return (
                     <Box key={index} sx={{ display: 'flex', flexDirection: 'column', position: 'relative', gap: 2 }}>
                        {currentPage && <Box sx={{
                           height: 3, width: '100%', borderRadius: '0px 0px 4px 4px', backgroundColor: colorPalette?.buttonColor,
                           position: 'absolute', top: 0
                        }} />}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center', marginTop: 2 }}
                           onClick={() => router.push(route)}>
                           <Box sx={{
                              ...styles.icon,
                              backgroundImage: `url(${item?.icon})`,
                              filter: theme ? 'brightness(0) invert(0)' : 'brightness(0) invert(1)',
                              backgroundSize: 'contain',
                              opacity: currentPage ? 1 : .5,
                              width: 22,
                              height: 22,
                              "&:hover": {
                                 cursor: 'pointer', opacity: 0.8
                              }
                           }} />
                           <Text style={{ color: '#fff', opacity: currentPage ? 1 : .5, }} bold={currentPage} xsmall>{item?.text}</Text>
                        </Box>
                     </Box>
                  )
               })}
            </Box>
         </Box>

         {
            showDialogEditUser && (
               <DialogUserEdit
                  onClick={(value) => setShowDialogEditUser(value)}
                  value={showDialogEditUser}
               />
            )
         }

         <Box sx={{
            position: 'absolute',
            top: { xs: 15, xm: 15, md: 15, lg: 15 },
            right: { xs: 15, xm: 15, md: 40, lg: 40 },
            gap: .5,
            flexDirection: 'column',
            display: 'flex', alignItems: 'center',
            "&:hover": {
               cursor: 'pointer', opacity: 0.8
            }
         }} onClick={logout}>
            <Box sx={{
               ...styles.icon,
               backgroundImage: `url('/icons/exit.png')`,
               filter: theme ? 'brightness(0) invert(0)' : 'brightness(0) invert(1)',
               backgroundSize: 'contain',
               width: { xs: 20, xm: 20, md: 25, lg: 28 },
               height: { xs: 20, xm: 20, md: 25, lg: 28 },
            }} />
            <Text small light>Sair</Text>
         </Box >

         <Box sx={{
            position: 'absolute',
            top: { xs: 10, xm: 15, md: 15, lg: 10 },
            right: { lg: 110 },
            display: 'flex', alignItems: 'center',
            display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex', xl: 'flex' },
            flexDirection: 'column',
            "&:hover": {
               cursor: 'pointer', opacity: 0.8
            }
         }} onClick={() => router.push('/')}>
            <Avatar src={photoUrl || `url('/icons/logo-diabetes.png')`} sx={{
               height: 'auto',
               borderRadius: '50%',
               display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex', xl: 'flex' },
               width: { xs: 35, sm: 180, md: 180, lg: 40 },
               aspectRatio: '1/1',
            }} variant="square" />
            <Text bold small>{userName}</Text>
         </Box >

         <Box sx={{
            position: 'absolute',
            top: { xs: 10, xm: 15, md: 15, lg: 15 },
            left: { xs: 15, xm: 15, md: 40, lg: 0 },
            display: 'flex', alignItems: 'center',
            flexDirection: 'column',
            "&:hover": {
               cursor: 'pointer', opacity: 0.8
            }
         }} onClick={() => router.push('/')}>
            <Avatar src={photoUrl || `url('/icons/logo-diabetes.png')`} sx={{
               height: 'auto',
               borderRadius: '50%',
               display: { xs: 'flex', sm: 'none', md: 'none', lg: 'none', xl: 'none' },
               width: { xs: 35, sm: 180, md: 180, lg: 65 },
               aspectRatio: '1/1',
            }} variant="square" />
            <Text bold small>{userName}</Text>
         </Box >
      </>
   )
}


const styles = {
   leftMenuMainContainer: {
      position: 'relative',
      alignItems: 'center',
      display: { xs: 'none', sm: 'none', md: 'flex', lg: 'flex' },
      flexDirection: 'column',
      minHeight: '100vh',
      // backgroundColor: '#f9f9f9',
      borderRight: `1px solid #00000010`,
      padding: `40px 5px 40px 5px`,
      gap: 1,
      zIndex: 999999999,
      position: { xs: 'fixed', sm: 'absolute', md: 'relative', lg: 'relative' },
   },
   boxMenu: {
      display: 'flex',
      flexDirection: 'column',
      // gap: 1,
      marginTop: 5,
      overflowStyle: 'marquee,panner',
      maxHeight: { xs: '480px', sm: '480px', md: '480px', lg: '480px', xl: '850px' },
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: 'gray lightgray',
      '&::-webkit-scrollbar': {
         width: '5px',

      },
      '&::-webkit-scrollbar-thumb': {
         backgroundColor: 'gray',
         borderRadius: '5px'
      },
      '&::-webkit-scrollbar-thumb:hover': {
         backgroundColor: 'gray',

      },
      '&::-webkit-scrollbar-track': {
         backgroundColor: Colors.primary,

      },
   },
   userBox: {
      backgroundColor: '#00000017',
      position: 'fixed',
      bottom: 0,
      padding: `10px 20px`,
      borderRadius: '10px 10px 0px 0px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      gap: 1,
      width: 150
   },
   userButtonContainer: {
      borderRadius: '5px',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: `5px 0px`,
      "&:hover": {
         backgroundColor: '#ddd',
         cursor: 'pointer'
      }
   },
   icon: {
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      width: '15px',
      height: '15px',
      marginRight: '0px',
      backgroundImage: `url('/favicon.svg')`,
   },
   menuResponsive: {
      position: 'fixed',
      bottom: 0,
      height: '80px',
      width: '100%',
      backgroundColor: '#f9f9f9',
      borderBottom: `2px solid #00000010`,
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 99999999,
      display: { xs: 'flex', sm: 'flex', md: 'none', lg: 'none' },
   },
   menuMobileContainer: {
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f9f9f9',
      borderRight: `1px solid #00000010`,
      padding: `40px 20px`,
      gap: 4,
      zIndex: 99999999,
   },
   menuIcon: {
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: 20,
      height: 20,

   },
   containerUserOpitions: {
      backgroundColor: Colors.background,
      boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
      borderRadius: 2,
      padding: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: 135,
      width: '100%',
      boxSizing: 'border-box',
      zIndex: 9999999

   },
   userBadgeContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 130,
      gap: 1,
      position: 'relative',
      borderRadius: 1.5,
      zIndex: 9999999,
   },
   menuIcon: {
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: 20,
      height: 20,

   },
}
