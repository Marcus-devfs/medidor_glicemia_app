import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "axios"
import { Avatar, Backdrop, useMediaQuery, useTheme } from "@mui/material"
import { api } from "../../api/api"
import { Box, ContentContainer, TextInput, Text, Button, PhoneInputField, FileInput, Divider } from "../../atoms"
import { CheckBoxComponent, CustomDropzone, RadioItem, SectionHeader, TableOfficeHours, Table_V1 } from "../../organisms"
import { useAppContext } from "../../context/AppContext"
import { icons } from "../../organisms/layout/Colors"
import { createContract, createEnrollment, createUser, deleteFile, deleteUser, editContract, editeEnrollment, editeUser } from "../../validators/api-requests"
import { emailValidator, formatCEP, formatCPF, formatDate, formatRg, formatTimeStamp } from "../../helpers"
import { SelectList } from "../../organisms/select/SelectList"
import Link from "next/link"
import { checkUserPermissions } from "../../validators/checkPermissionUser"

export default function EditUser() {
    const { setLoading, alert, colorPalette, user, logout, setTheme, theme } = useAppContext()
    const userId = user.id;
    const router = useRouter()
    const { id, slug } = router.query;
    const newUser = id === 'new';
    const [fileCallback, setFileCallback] = useState()
    const [bgPhoto, setBgPhoto] = useState({})
    const [showPage, setShowPage] = useState({
        myData: false,
        changePass: false
    })
    const [userData, setUserData] = useState({
        gender: '',
        birthDate: '',
        telephone: null,
        barthDate: null,
        foto_perfil_id: bgPhoto?.location || fileCallback?.filePreview || null,
    })

    const [passwordData, setPasswordData] = useState({
        password: '',
        newPassword: '',
        confirmPassword: ''
    })
    const themeApp = useTheme()
    const mobile = useMediaQuery(themeApp.breakpoints.down('sm'))
    const [showSections, setShowSections] = useState({
        registration: false,
        permissions: false,
        accessData: false,
    })
    const [showEditFile, setShowEditFiles] = useState({
        photoProfile: false,
        cpf: false
    })
    const [photoPerfil, setPhotoPerfil] = useState([])

    const getUserData = async () => {
        try {
            const response = await api.get(`/user/${id}`)
            const { data } = response
            let [photo] = data?.photoPerfil
            setUserData(data)
            setPhotoPerfil(photo)
            console.log(photo)
        } catch (error) {
            console.log(error)
            return error
        }
    }

    useEffect(() => {
        (async () => {
            if (newUser) {
                return
            }
            await handleItems();
        })();
    }, [id])

    const handleItems = async () => {
        setLoading(true)
        try {
            await getUserData()
        } catch (error) {
            alert.error('Ocorreu um arro ao carregar Usuarios')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (value) => {

        if (value.target.name == 'cpf') {
            let str = value.target.value;
            value.target.value = formatCPF(str)
        }

        setUserData((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }


    const handleChangePassword = (value) => {

        setPasswordData((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }

    const checkRequiredFields = () => {

        if (passwordData?.password === '' || passwordData?.password === null) {
            alert?.error('Insira a senha atual por favor.')
            return false
        }

        if (passwordData?.newPassword !== '' && (passwordData?.newPassword !== passwordData?.confirmPassword)) {
            alert?.error('As senhas não correspondem. Por favor, verifique novamente.')
            return false
        }

        return true
    }

    const handleEditUser = async () => {
        setLoading(true)
        try {
            const response = await api.patch(`/user/update/${id}`, { userData })
            if (response?.status === 200) {
                alert.success('Seus Dados foram atualizado com sucesso.');
                handleItems()
                return
            }
            alert.error('Ocorreu um problema ao atualizar os seus dados.');
        } catch (error) {
            console.log(error)
            alert.error('Ocorreu um erro no sistem. Tente novamente daqui alguns minutos ou entre em contato com o suporte.');
            return error;
        } finally {
            setLoading(false)
        }

    }

    const handleChangePass = async () => {
        if (checkRequiredFields()) {
            setLoading(true)
            try {
                const response = await api.patch(`/user/update/password/${id}`, { passwordData })
                if (response?.status === 200) {
                    alert.success('Sua senha foi atualizada com sucesso.');
                    handleItems()
                    setShowPage({
                        myData: false,
                        changePass: false
                    })
                    setPasswordData({
                        password: '',
                        newPassword: '',
                        confirmPassword: '',
                    })
                    return
                }
                alert.error('Tivemos um problema ao atualizar senha.');
            } catch (error) {
                if (error?.response?.status === 422) {
                    console.log(error?.response)
                    alert.error('A senha atual está incorreta.');
                } else {
                    alert.error('Houve um erro no sistema. Tente novamente mais tarde ou entre em contato com o Suporte.');
                }
                return error;
            } finally {
                setLoading(false)
            }
        }
    }

    const groupGender = [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Feminino', value: 'Feminino' },
        { label: 'Outro', value: 'Outro' },
        { label: 'Prefiro não informar', value: 'Prefiro não informar' },
    ]

    return (
        <Box sx={{
            display: 'flex', gap: 1, flexDirection: 'column', alignItems: { md: 'center', lg: 'center' },
            padding: { xs: `30px 0px`, xm: `25px`, md: `120px 65px`, lg: `50px 50px` }
        }}>
            {(!showPage?.myData && !showPage?.changePass) && <Box sx={{
                display: 'flex', flexDirection: 'column',
                width: { xs: '%100', xm: '100%', md: '100%', lg: 600 }
            }}>
                <Box sx={{
                    display: 'flex', height: 300,
                    alignItems: 'center', justifyContent: 'center', width: { xs: '%100', xm: '100%', md: '100%', lg: 600 }
                }}>
                    <Box sx={{
                        justifyContent: 'center', alignItems: 'center',
                        // width: 220,
                        gap: 2
                    }}>
                        <Avatar src={photoPerfil?.url} sx={{
                            height: 'auto',
                            borderRadius: '50%',
                            width: { xs: 180, sm: 180, md: 180, lg: 180 },
                            aspectRatio: '1/1',
                        }} variant="square" />
                        <Box sx={{
                            display: 'flex', gap: 1, justifyContent: 'space-between', alignItems: 'center', backgroundColor: colorPalette.inputColor,
                            borderRadius: '12px',
                            padding: '12px 0px 12px 12px',
                            marginTop: 2, border: '1px solid lightgray',
                            position: 'relative',
                            '&:hover': { opacity: 0.8, cursor: 'pointer' },
                        }} onClick={() => setShowEditFiles({ ...showEditFile, photoProfile: true })}>
                            <Text bold small>Selecionar Foto...</Text>
                            <Box sx={{
                                display: 'flex', padding: '10px', zIndex: 99, backgroundColor: colorPalette.buttonColor, borderRadius: '0px 11px 11px 0px', border: `1px solid ${colorPalette.buttonColor}`,
                                position: 'absolute', right: 0, top: 0, bottom: 0
                            }}>
                                <Box sx={{
                                    ...styles.menuIcon,
                                    backgroundImage: `url(/icons/upload.png)`,
                                    transition: '.3s',
                                }} />
                            </Box>
                        </Box>
                        <EditFile
                            columnId="_id"
                            open={showEditFile.photoProfile}
                            newUser={newUser}
                            onSet={(set) => {
                                setShowEditFiles({ ...showEditFile, photoProfile: set })
                            }}
                            title='Foto de perfil'
                            text='Para alterar sua foto de perfil, clique ou arraste no local desejado.'
                            textDropzone='Arraste ou clique para selecionar a Foto que deseja'
                            fileData={bgPhoto}
                            userId={id}
                            tipo='foto'
                            bgImage={bgPhoto?.location || fileCallback?.filePreview}
                            callback={(file) => {
                                if (file.status === 201 || file.status === 200) {
                                    handleItems()
                                    setShowEditFiles({ ...showEditFile, photoProfile: false })
                                }
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 15px',
                        borderBottom: '1px solid lightgray',
                        borderTop: '1px solid lightgray',
                        width: '100%',
                        transition: '.3s',
                        "&:hover": {
                            opacity: 0.8,
                            cursor: "pointer",
                            transform: { xs: 'scale(1.0, 1.0)', sm: 'scale(1.0, 1.0)', md: 'scale(1.1, 1.1)', lg: 'scale(1.1, 1.1)' }
                        },
                    }} onClick={() => {
                        setShowPage({ ...showPage, myData: true })
                    }}>
                        <Text>Meus Dados</Text>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.gray_arrow_down})`,
                            transform: 'rotate(-90deg)',
                            transition: '.3s',
                            "&:hover": {
                                opacity: 0.8,
                                cursor: "pointer",
                                transform: 'scale(1.1, 1.1)'
                            },
                        }} />
                    </Box>
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 15px',
                        borderBottom: '1px solid lightgray', width: '100%',
                        transition: '.3s',
                        "&:hover": {
                            opacity: 0.8,
                            cursor: "pointer",
                            transform: { xs: 'scale(1.0, 1.0)', sm: 'scale(1.0, 1.0)', md: 'scale(1.1, 1.1)', lg: 'scale(1.1, 1.1)' }

                        },
                    }} onClick={() => {
                        setShowPage({ ...showPage, changePass: true })
                    }}>
                        <Text>Alterar Senha</Text>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.gray_arrow_down})`,
                            transform: 'rotate(-90deg)',
                            transition: '.3s',
                        }} />
                    </Box>
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 15px',
                        borderBottom: '1px solid lightgray', width: '100%',
                        transition: '.3s',
                        "&:hover": {
                            opacity: 0.8,
                            cursor: "pointer",
                            transform: { xs: 'scale(1.0, 1.0)', sm: 'scale(1.0, 1.0)', md: 'scale(1.1, 1.1)', lg: 'scale(1.1, 1.1)' }

                        },
                    }} onClick={() => setTheme(!theme)}>
                        <Text>Tema</Text>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.gray_arrow_down})`,
                            transform: 'rotate(-90deg)',
                            transition: '.3s',
                        }} />
                    </Box>
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 15px',
                        borderBottom: '1px solid lightgray', width: '100%',
                        transition: '.3s',
                        "&:hover": {
                            opacity: 0.8,
                            cursor: "pointer",
                            transform: { xs: 'scale(1.0, 1.0)', sm: 'scale(1.0, 1.0)', md: 'scale(1.1, 1.1)', lg: 'scale(1.1, 1.1)' }

                        },
                    }} onClick={logout}>
                        <Text>Sair</Text>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.gray_arrow_down})`,
                            transform: 'rotate(-90deg)',
                            transition: '.3s',
                        }} />
                    </Box>
                </Box>
            </Box>}



            {showPage?.myData &&
                <Box sx={{
                    display: 'flex', flexDirection: 'column',
                    width: { xs: '%100', xm: '100%', md: '100%', lg: 600 }
                }}>
                    <Box sx={{
                        display: 'flex', justifyContent: 'flex-start', gap: 5, alignItems: 'center',
                        marginBottom: 5,
                        padding: '10px 20px'
                    }}>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.gray_arrow_down})`,
                            transform: 'rotate(90deg)',
                            transition: '.3s',
                            "&:hover": {
                                opacity: 0.8,
                                cursor: "pointer",
                            },
                        }} onClick={() => {
                            setShowPage({ ...showPage, myData: false })
                        }} />
                        <Text title bold style={{}}>Meus Dados</Text>
                    </Box>

                    <ContentContainer style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, padding: 5, }}>
                        <Box sx={{ ...styles.inputSection, flexDirection: 'column', justifyContent: 'flex-start' }}>
                            <Box sx={{ ...styles.inputSection }}>
                                <TextInput fullWidth placeholder='Nome Completo' name='name' onChange={handleChange} value={userData?.name || ''} label='Nome Completo: *' sx={{ flex: 1, }} />
                            </Box>
                            <Box sx={{ ...styles.inputSection }}>
                                <TextInput placeholder='E-mail' name='email' onChange={handleChange} value={userData?.email || ''} label='E-mail: *' sx={{ flex: 1, }} />
                                <TextInput placeholder='Telefone' name='telephone' onChange={handleChange} value={userData?.telephone || ''} label='Telefone: *' sx={{ flex: 1, }} />
                            </Box>
                            <TextInput placeholder='Nascimento' name='birthDate' onChange={handleChange} type="date" value={(userData?.birthDate)?.split('T')[0] || ''} label='Nascimento *' sx={{ flex: 1, }} />
                            <SelectList fullWidth data={groupGender} valueSelection={userData?.gender || ''} onSelect={(value) => setUserData({ ...userData, gender: value })}
                                title="Gênero *" filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                                inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                            />
                        </Box>
                    </ContentContainer>

                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: 5 }}>
                        <Box sx={{
                            display: 'flex', gap: 1, backgroundColor: colorPalette?.buttonColor, padding: '12px 12px', borderRadius: 2,
                            transition: '.3s',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '80%',
                            "&:hover": {
                                opacity: 0.8,
                                cursor: "pointer",
                                transform: 'scale(1.1, 1.1)'
                            },
                        }} onClick={() => handleEditUser()}>
                            <Text bold style={{ color: '#fff' }}>Alterar Dados</Text>
                        </Box>
                    </Box>
                </Box>
            }

            {showPage?.changePass &&
                <Box sx={{
                    display: 'flex', flexDirection: 'column',
                    width: { xs: '%100', xm: '100%', md: '100%', lg: 600 }
                }}>
                    <Box sx={{
                        display: 'flex', justifyContent: 'flex-start', gap: 5, alignItems: 'center',
                        marginBottom: 5,
                        padding: '10px 20px'
                    }}>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.gray_arrow_down})`,
                            transform: 'rotate(90deg)',
                            transition: '.3s',
                            "&:hover": {
                                opacity: 0.8,
                                cursor: "pointer",
                            },
                        }} onClick={() => {
                            setShowPage({ ...showPage, changePass: false })
                        }} />
                        <Text title bold style={{}}>Alterar Senha</Text>
                    </Box>

                    <ContentContainer style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, padding: 5, }}>
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around', gap: 1.8, flexDirection: 'column' }}>
                            <TextInput placeholder='Senha atual' name='password' onChange={handleChangePassword} value={passwordData?.password || ''} type="password" label='Senha atual:' sx={{ flex: 1, }} />

                            <Text bold>Dados da nova senha:</Text>
                            <TextInput placeholder='Nova senha' name='newPassword' onChange={handleChangePassword} value={passwordData?.newPassword || ''} type="password" label='Nova senha:' sx={{ flex: 1, }} />
                            <TextInput placeholder='Confirmar senha' name='confirmPassword' onChange={handleChangePassword} value={passwordData?.confirmPassword || ''} type="password" label='Confirmar senha:' sx={{ flex: 1, }} />
                        </Box>
                    </ContentContainer>

                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: 5 }}>
                        <Box sx={{
                            display: 'flex', gap: 1, backgroundColor: colorPalette?.buttonColor, padding: '12px 12px', borderRadius: 2,
                            transition: '.3s',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '80%',
                            "&:hover": {
                                opacity: 0.8,
                                cursor: "pointer",
                                transform: 'scale(1.1, 1.1)'
                            },
                        }} onClick={() => handleChangePass()}>
                            <Text bold style={{ color: '#fff' }}>Alterar Senha</Text>
                        </Box>
                    </Box>
                </Box>
            }


            {/* <ContentContainer style={{ ...styles.containerRegister, padding: showSections?.accessData ? '40px' : '25px' }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1, padding: showSections?.accessData ? '0px 0px 20px 0px' : '0px', "&:hover": {
                        opacity: 0.8,
                        cursor: 'pointer'
                    },
                    justifyContent: 'space-between'
                }} onClick={() => setShowSections({ ...showSections, accessData: !showSections?.accessData })}>
                    <Text title bold >Dados de acesso</Text>
                    <Box sx={{
                        ...styles.menuIcon,
                        backgroundImage: `url(${icons.gray_arrow_down})`,
                        transform: showSections?.accessData ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: '.3s',
                    }} />
                </Box>
                {showSections?.accessData &&
                    <>
                        {!newUser && <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around', gap: 1.8 }}>
                            <TextInput placeholder='Nova senha' name='password' onChange={handleChange} value={userData?.password || ''} type="password" label='Nova senha' sx={{ flex: 1, }} />
                            <TextInput placeholder='Confirmar senha' name='confirmPassword' onChange={handleChange} value={userData?.confirmPassword || ''} type="password" label='Confirmar senha' sx={{ flex: 1, }} />
                        </Box>}
                    </>}
            </ContentContainer>  */}

        </Box>
    )
}

const styles = {
    containerRegister: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 1.5,
        padding: '40px'
    },
    containerContract: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 1.5,
    },
    menuIcon: {
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 20,
        height: 20,
    },
    inputSection: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-around',
        gap: 1.8,
        flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' }
    },
    containerFile: {
        scrollbarWidth: 'thin',
        scrollbarColor: 'gray lightgray',
        '&::-webkit-scrollbar': {
            width: '5px',

        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'darkgray',
            borderRadius: '5px'
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'gray',

        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'gray',

        },
    }
}

export const EditFile = (props) => {
    const {
        open = false,
        onSet = () => { },
        callback = () => { },
        title = '',
        text = '',
        textDropzone = '',
        campo = '',
        tipo = '',
        bgImage = '',
        userId,
        newUser,
        fileData = [],
        columnId = '',
        matriculaId,
        isPermissionEdit
    } = props

    const { alert, setLoading, matches } = useAppContext()

    const handleDeleteFile = async (files) => {
        setLoading(true)
        const response = await deleteFile({ fileId: files?.[columnId], userId: userId, campo: files.campo, key: files?.key_file, matriculaId })
        const { status } = response
        let file = {
            status
        }
        if (status === 200) {
            alert.success('Aqruivo removido.');
            callback(file)
        } else {
            alert.error('Ocorreu um erro ao remover arquivo.');
        }
        setLoading(false)
    }

    return (
        <Backdrop open={open} sx={{ zIndex: 9999, }}>
            <ContentContainer style={{ ...styles.containerFile, maxHeight: { xs: '500px', md: '400px', lg: '1280px' }, marginLeft: { md: '80px', lg: '0px' }, overflowY: matches && 'scroll', }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', zIndex: 9999, alignItems: 'center', padding: '0px 0px 8px 0px' }}>
                    <Text bold>{title}</Text>
                    <Box sx={{
                        ...styles.menuIcon,
                        width: 15,
                        height: 15,
                        backgroundImage: `url(${icons.gray_close})`,
                        transition: '.3s',
                        zIndex: 9999,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }} onClick={() => {
                        onSet(false)
                    }} />
                </Box>
                <Divider />
                <Box sx={{
                    display: 'flex',
                    whiteSpace: 'wrap',
                    maxWidth: 280,
                    justifyContent: 'center'
                }}>
                    <Text>{text}</Text>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <CustomDropzone
                        txt={textDropzone}
                        bgImage={bgImage}
                        bgImageStyle={{
                            backgroundImage: `url(${bgImage})`,
                            backgroundSize: campo === 'foto_perfil' ? 'cover' : 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center center',
                            width: { xs: 150, sm: 150, md: 150, lg: 150 },
                            height: { xs: 200, sm: 150, md: 150, lg: 150 },
                            borderRadius: campo === 'foto_perfil' ? '50%' : '',
                            aspectRatio: '1/1',
                        }}
                        callback={(file) => {
                            if (file.status === 201) {
                                callback(file)
                            }
                        }}
                        userId={userId}
                        campo={campo}
                        tipo={tipo}
                    />

                </Box>

                {bgImage &&
                    <>
                        <Divider padding={0} />
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'start', gap: 1, alignItems: 'center', marginTop: 2 }}>
                                <Button secondary small text='Remover' style={{ padding: '5px 10px 5px 10px', width: 120 }} onClick={() => {
                                    newUser ? callback("") : handleDeleteFile()
                                }} />
                            </Box>
                        </Box>
                    </>
                }

                {campo != 'foto_perfil' && fileData?.length > 0 &&
                    <ContentContainer>
                        <Text bold>Arquivos</Text>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                            {fileData?.map((file, index) => {
                                const typePdf = file?.name_file
                                    ?.includes('pdf') || null;
                                return (
                                    <Box key={`${file}-${index}`} sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: '160px' }}>

                                        <Link style={{ display: 'flex', position: 'relative', border: `1px solid gray`, borderRadius: '8px' }} href={file.location} target="_blank">
                                            <Box
                                                sx={{
                                                    backgroundImage: `url('${typePdf ? '/icons/pdf_icon.png' : file?.location}')`,
                                                    backgroundSize: 'contain',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center center',
                                                    width: { xs: 150, sm: 150, md: 150, lg: 150 },
                                                    aspectRatio: '1/1',
                                                }}>
                                            </Box>
                                            {isPermissionEdit && <Box sx={{
                                                backgroundSize: "cover",
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "center",
                                                width: 22,
                                                height: 22,
                                                backgroundImage: `url(/icons/remove_icon.png)`,
                                                position: 'absolute',
                                                top: -5,
                                                right: -5,
                                                transition: ".3s",
                                                "&:hover": {
                                                    opacity: 0.8,
                                                    cursor: "pointer",
                                                },
                                                zIndex: 9999,
                                            }} onClick={(event) => {
                                                event.preventDefault()
                                                handleDeleteFile(file)
                                            }} />}
                                        </Link>
                                        <Text sx={{ fontWeight: 'bold', fontSize: 'small', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {decodeURIComponent(file?.name_file)}
                                        </Text>
                                    </Box>
                                )
                            })}
                        </Box>
                    </ContentContainer>
                }
            </ContentContainer>
        </Backdrop>
    )
}