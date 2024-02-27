import { useEffect, useState } from "react";
import { Box, Button, ContentContainer, Divider, Text, TextInput } from "../../atoms";
import { Colors, icons } from "../layout/Colors";
import { Avatar, CircularProgress } from "@mui/material";
import { IconTheme } from "../iconTheme/IconTheme";
import { useAppContext } from "../../context/AppContext";
import { useRouter } from "next/router";
import { formatTimeAgo, formatTimeStamp } from "../../helpers";
import { api } from "../../api/api";
import { useRef } from "react";
import { Notifications } from "../notification/notifications";
import Link from "next/link";
import { keyframes } from '@emotion/react';
import { DialogUserEdit } from "../userEdit/dialogEditUser";

const blinkingText = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const UserHeader = (props) => {
    const {
        title = '',
    } = props;

    const { colorPalette, theme, logout, notificationUser, setNotificationUser, user } = useAppContext()
    let fotoPerfil = user?.getPhoto?.location || '';
    const name = user?.nome?.split(' ');
    const firstName = name[0];
    const lastName = name[name.length - 1];
    const userName = `${firstName} ${lastName}`;
    const router = useRouter()
    const routeParts = router.asPath.split('/');
    const lastPage = routeParts[routeParts.length - 1];
    const [showNotification, setShowNotification] = useState(false)
    const [showUserOptions, setShowUserOptions] = useState(false)
    const [showDialogEditUser, setShowDialogEditUser] = useState(false)
    const [showEditUser, setShowEditUser] = useState(false)
    const containerRef = useRef(null);


    const handleGoBack = () => {
            router.back();

        // if (lastPage > 0) {
        //     routeParts[routeParts.length - 1] = 'list';
        //     const newRoute = routeParts.join('/');
        //     router.push(newRoute);
        // } else {
        //     router.back();
        // }
    };


    useEffect(() => {
        if (!showEditUser) {

            const handleClickOutside = (event) => {
                if (containerRef.current && !containerRef.current.contains(event.target)) {
                    setShowEditUser(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, []);

    return (
        <>
            <Box sx={{ ...styles.header, backgroundColor: colorPalette.secondary, gap: 2 }}>
                <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', marginLeft: 10 }}>
                    <Box sx={{
                        ...styles.menuIcon,
                        backgroundImage: `url(${icons.home})`,
                        width: 17,
                        height: 17,
                        filter: theme ? 'brightness(0) invert(0)' : 'brightness(0) invert(1)',
                        transition: 'background-color 1s',
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }} onClick={() => router.push('/')} />
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }} onClick={() => handleGoBack()}>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.goback})`,
                            filter: theme ? 'brightness(0) invert(0)' : 'brightness(0) invert(1)',
                            transition: '.3s',
                            aspectRatio: '1/1'
                        }} />
                        <Text small sx={{}}>Voltar</Text>
                    </Box>
                    <Box sx={{ width: 400, display: 'flex', marginLeft: 10 }}>
                        <TextInput placeholder="Buscar pelo paciente" type="search" InputProps={{ style: { height: 35, fontSize: '13px', width: 400, borderRadius: 8 } }} />
                    </Box>
                </Box>
                {/* <IconTheme flex /> */}

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end', position: 'relative', }}>
                    <Box sx={{ display: 'flex', height: '30px', width: '1px', backgroundColor: 'lightgray' }} />


                    <Box sx={{
                        position: 'relative', "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }} onClick={() => setShowNotification(true)}>
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', justifyContent: 'space-around', padding: '5px 8px', borderRadius: 2, cursor: 'pointer', "&:hover": { opacity: 0.6 } }}>
                            <Box sx={{
                                ...styles.menuIcon,
                                backgroundImage: `url('/icons/notification_icon-png.png')`,
                                width: 18,
                                height: 18,
                                filter: theme ? 'brightness(0) invert(0)' : 'brightness(0) invert(1)',
                                transition: 'background-color 1s',
                            }} />
                            <Box sx={{
                                ...styles.menuIcon,
                                backgroundImage: `url('${icons.gray_arrow_down}')`,
                                width: 13,
                                height: 13,
                                aspectRatio: '1/1',
                                // filter: theme ? 'brightness(0) invert(0)' : 'brightness(0) invert(1)',
                                transition: 'background-color 1s',
                            }} />
                        </Box>
                        {notificationUser?.filter(item => item.vizualizado === 0)?.length > 0 &&
                            <Box sx={{
                                position: 'absolute',
                                width: 11,
                                height: 11,
                                borderRadius: 5,
                                backgroundColor: 'red',
                                alignItems: 'center',
                                justifyContent: 'center',
                                top: 3,
                                left: 5
                            }}>
                                <Text bold style={{ color: '#fff', fontSize: '8px', textAlign: 'center' }}>{notificationUser?.filter(item => item.vizualizado === 0)?.length}</Text>
                            </Box>
                        }
                    </Box>
                    <Box sx={{ display: 'flex', height: '30px', width: '1px', backgroundColor: 'lightgray' }} />

                    <Notifications showNotification={showNotification} setShowNotification={setShowNotification} />

                    <Box sx={{ ...styles.userBadgeContainer }}>
                        <div ref={containerRef}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                position: 'relative',
                                alignItems: 'center',
                                gap: 1,
                                borderRadius: 1.5,
                                boxSizing: 'border-box',
                                flexDirection: 'row',
                                "&:hover": {
                                    opacity: 0.8,
                                    cursor: 'pointer',
                                    backgroundColor: colorPalette.third + '11'
                                }
                            }} onClick={() => setShowEditUser(!showEditUser)}>
                                <Avatar
                                    sx={{ width: '35px', height: '35px', fontSize: 14, border: `1px solid #fff`, cursor: 'pointer', '&hover': { opacity: 0.5 } }}
                                    src={fotoPerfil || `https://mf-planejados.s3.us-east-1.amazonaws.com/melies/perfil-default.jpg`}
                                    onClick={() => {
                                        // router.push(`/users/${user?.id}`)
                                        setShowUserOptions(!showUserOptions)
                                        setShowDialogEditUser(true)
                                    }} />
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', transition: '1s' }}>
                                    <Text style={{ color: colorPalette.textColor, transition: 'background-color 1s', fontFamily: 'MetropolisSemiBold', }}>{userName}</Text>
                                    <Box sx={{
                                        ...styles.menuIcon,
                                        backgroundImage: `url(${icons.gray_arrow_down})`,
                                        width: 20,
                                        transform: !showEditUser ? 'rotate(360deg)' : 'rotate(180deg)',
                                        height: 17,
                                        transition: '.4s',
                                    }} />
                                </Box>
                            </Box>
                            {showEditUser &&
                                <Box sx={{
                                    border: `1px solid lightgray`,
                                    display: 'flex', gap: 1, alignItems: 'start',
                                    top: 40,
                                    right: 0,
                                    transition: '.5s',
                                    justifyContent: 'center', flexDirection: 'column', backgroundColor: colorPalette.secondary,
                                    padding: '5px 10px', width: `100%`, borderRadius: 2,
                                    position: 'absolute',
                                    boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,

                                }}>
                                    <Box sx={{
                                        display: 'flex', gap: 1, width: '100%', padding: '3px 8px 0px 8px', "&:hover": {
                                            opacity: 0.8,
                                            cursor: 'pointer',
                                            backgroundColor: colorPalette.third + '11'
                                        }
                                    }} onClick={() => {
                                        setShowUserOptions(!showUserOptions)
                                        setShowEditUser(false)
                                        router.push(`/users/${user?.id}`)
                                    }}>
                                        <Box sx={{
                                            ...styles.menuIcon,
                                            backgroundImage: `url('https://mf-planejados.s3.amazonaws.com/Icon_user_edit.png')`,
                                            width: 15,
                                            height: 15,
                                            filter: 'brightness(0) invert(0)',
                                            transition: 'background-color 1s',
                                            "&:hover": {
                                                opacity: 0.8,
                                                cursor: 'pointer',
                                            }
                                        }} onClick={() => {
                                            // router.push(`/users/${user?.id}`)
                                        }} />
                                        <Text bold xsmall style={{ ...styles.text, textAlign: 'center', padding: `2px 0px` }}>Meus dados</Text>

                                    </Box>

                                    <Divider distance={0} />

                                    <Box sx={{
                                        display: 'flex', gap: 1, width: '100%', padding: '3px 8px 0px 8px', "&:hover": {
                                            opacity: 0.8,
                                            cursor: 'pointer',
                                            backgroundColor: colorPalette.third + '11'
                                        }
                                    }} onClick={() => {
                                        setShowUserOptions(!showUserOptions)
                                        setShowDialogEditUser(true)
                                        setShowEditUser(false)
                                    }}>
                                        <Box sx={{
                                            ...styles.menuIcon,
                                            backgroundImage: `url('/icons/padlock_icon.png')`,
                                            width: 15,
                                            height: 15,
                                            transition: 'background-color 1s',
                                            "&:hover": {
                                                opacity: 0.8,
                                                cursor: 'pointer',
                                            }
                                        }} onClick={() => {
                                            // router.push(`/users/${user?.id}`)
                                        }} />
                                        <Text bold xsmall style={{ ...styles.text, textAlign: 'center', padding: `2px 0px` }}>Alterar senha</Text>

                                    </Box>

                                    <Divider distance={0} />

                                    <Box sx={{
                                        display: 'flex', gap: 1, width: '100%', padding: '3px 8px 0px 8px', "&:hover": {
                                            opacity: 0.8,
                                            cursor: 'pointer',
                                            backgroundColor: colorPalette.third + '11'
                                        }
                                    }} onClick={() => {
                                        setShowUserOptions(!showUserOptions)
                                        setShowEditUser(false)
                                        router.push('/suport/tasks/list')
                                    }}>
                                        <Box sx={{
                                            ...styles.menuIcon,
                                            backgroundImage: `url('/icons/support-icon.png')`,
                                            width: 15,
                                            height: 15,
                                            filter: 'brightness(0) invert(0)',
                                            transition: 'background-color 1s',
                                            "&:hover": {
                                                opacity: 0.8,
                                                cursor: 'pointer',
                                            }
                                        }} />
                                        <Text bold xsmall style={{ ...styles.text, textAlign: 'center', padding: `2px 0px` }}>Suporte</Text>

                                    </Box>

                                    <Divider distance={0} />

                                    <Box sx={{
                                        display: 'flex', gap: 1, width: '100%', padding: '0px 8px 3px 8px', "&:hover": {
                                            opacity: 0.8,
                                            cursor: 'pointer',
                                            backgroundColor: colorPalette.third + '11'
                                        }
                                    }} onClick={logout}>
                                        <Box sx={{
                                            ...styles.menuIcon,
                                            backgroundImage: `url(${icons.logout})`,
                                            width: 20,
                                            height: 17,
                                            transition: 'background-color 1s'
                                        }} />
                                        <Text bold xsmall style={{ ...styles.text, textAlign: 'center', padding: `2px 0px` }}>Sair</Text>
                                    </Box>

                                </Box>
                            }
                        </div>
                    </Box>
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
        </>
    )
}

const styles = {
    header: {
        display: { xs: 'none', sm: 'none', md: 'flex', lg: 'flex' },
        width: '100%',
        padding: `8px 32px 8px 32px`,
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        gap: 1,
        position: 'fixed',
        zIndex: 999999,
        borderBottom: `1px solid ${Colors.backgroundPrimary + '11'}`,
    },
    menuIcon: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 20,
        height: 20,

    },
    containerUserOpitions: {
        backgroundColor: '#fff',
        boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
        borderRadius: 2,
        padding: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: 48,
        width: '100%',
        boxSizing: 'border-box',
        zIndex: 9999999

    },
    userBadgeContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // minWidth: 130,
        gap: 1,
        position: 'relative',
        borderRadius: 1.5,
        zIndex: 9999999
    },
    '@keyframes blinkingText': {
        '0%': {
            opacity: 1,
        },
        '50%': {
            opacity: 0,
        },
        '100%': {
            opacity: 1,
        },
    },
}
