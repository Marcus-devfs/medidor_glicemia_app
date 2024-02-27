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
    const { setLoading, alert, colorPalette, user, matches, theme, setShowConfirmationDialog, menuItemsList, userPermissions } = useAppContext()
    const usuario_id = user.id;
    const router = useRouter()
    const { id, slug } = router.query;
    const newUser = id === 'new';
    const [fileCallback, setFileCallback] = useState()
    const [bgPhoto, setBgPhoto] = useState({})
    const [userData, setUserData] = useState({
        gender: '',
        birthDate: '',
        telephone: null,
        barthDate: null,
        foto_perfil_id: bgPhoto?.location || fileCallback?.filePreview || null,
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
    const [filesUser, setFilesUser] = useState([])

    const getUserData = async () => {
        try {
            const response = await api.get(`/user/${id}`)
            console.log(id)
            console.log(response)
            const { data } = response
            setUserData(data)

        } catch (error) {
            console.log(error)
            return error
        }
    }


    const getPhoto = async () => {
        try {
            const response = await api.get(`/photo/${id}`)
            const { data } = response
            setBgPhoto(data)
        } catch (error) {
            console.log(error)
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

    useEffect(() => {
        if (newUser && fileCallback?.id_foto_perfil) {
            getPhotoNewUser()
        }
    }, [fileCallback])

    const handleItems = async () => {
        setLoading(true)
        try {
            await getUserData()
            getPhoto()
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

    const checkRequiredFields = () => {
        if (!userData?.name) {
            alert?.error('O campo nome é obrigatório')
            return false
        }
        if (!userData?.email) {
            alert?.error('O campo email é obrigatório')
            return false
        }
        if (!emailValidator(userData?.email)) {
            alert?.error('O e-mail inserido parece estar incorreto.')
            return false
        }

        if (userData?.password !== '' && (userData?.password !== userData?.confirmPassword)) {
            alert?.error('As senhas não correspondem. Por favor, verifique novamente.')
            return false
        }

        return true
    }

    const handleCreateUser = async () => {
        if (checkRequiredFields()) {
            setLoading(true)
            try {
                const response = await createUser(userData, usuario_id)
                const { data } = response
                if (newUser && filesUser) {
                    const files = await api.patch(`/file/editFiles/${data?.userId}`, { filesUser });
                }
                if (response?.status === 201) {
                    alert.success('Usuário cadastrado com sucesso.');
                    if (data?.userId) router.push(`/users/list`)
                }
            } catch (error) {
                alert.error('Tivemos um problema ao cadastrar usuário.');
                console.log(error)
            } finally {
                setLoading(false)
            }
            return setLoading(false)
        }
    }

    const handleDeleteUser = async () => {
        setLoading(true)
        try {
            const response = await deleteUser(id)
            if (response?.status == 200) {
                alert.success('Usuário excluído com sucesso.');
                router.push(`/users/list`)
            }
        } catch (error) {
            alert.error('Tivemos um problema ao excluir usuário.');
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleEditUser = async () => {
        if (checkRequiredFields()) {
            setLoading(true)
            try {
                const response = await editeUser({ id, userData })
                if (response.status === 422) return alert.error('CPF já cadastrado.')
                if (response?.status === 201) {
                    alert.success('Usuário atualizado com sucesso.');
                    handleItems()
                    return
                }
                alert.error('Tivemos um problema ao atualizar usuário.');
            } catch (error) {
                console.log(error)
                alert.error('Tivemos um problema ao atualizar usuário.');
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
        <>
            <SectionHeader
                title={userData?.name || `Novo Usuário`}
                saveButton={true}
                saveButtonAction={newUser ? handleCreateUser : handleEditUser}
                deleteButton={!newUser}
                deleteButtonAction={(event) => setShowConfirmationDialog({
                    active: true,
                    event,
                    acceptAction: handleDeleteUser,
                    title: 'Excluir usuário',
                    message: 'Tem certeza que deseja prosseguir com a exclusão do usuário? Todos os dados vinculados a esse usuário serão excluídos, sem opção de recuperação.',
                })}
            />

            <ContentContainer style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1.8, padding: 5, }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center' }}>
                    <Box>
                        <Text title bold style={{}}>Meu Perfil</Text>
                    </Box>

                    <EditFile
                        columnId="id_foto_perfil"
                        open={showEditFile.photoProfile}
                        newUser={newUser}
                        onSet={(set) => {
                            setShowEditFiles({ ...showEditFile, photoProfile: set })
                        }}
                        title='Foto de perfil'
                        text='Para alterar sua foto de perfil, clique ou arraste no local desejado.'
                        textDropzone='Arraste ou clique para selecionar a Foto que deseja'
                        fileData={bgPhoto}
                        usuarioId={id}
                        campo='foto_perfil'
                        tipo='foto'
                        bgImage={bgPhoto?.location || fileCallback?.filePreview}
                        callback={(file) => {
                            if (file.status === 201 || file.status === 200) {
                                setFileCallback({
                                    status: file.status,
                                    id_foto_perfil: file.fileId,
                                    filePreview: file.filePreview
                                })
                                if (!newUser) { handleItems() }
                            }
                        }}
                    />

                </Box>
                <Box sx={{ ...styles.inputSection, whiteSpace: 'nowrap', alignItems: 'start', gap: 4 }}>
                    <Box sx={{
                        justifyContent: 'center', alignItems: 'center',
                        width: 220,
                        gap: 2
                    }}>
                        <Avatar src={bgPhoto?.location || fileCallback?.filePreview} sx={{
                            height: 'auto',
                            borderRadius: '16px',
                            width: { xs: 220, sm: 300, md: 300, lg: 300 },
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
                    </Box>
                    <Box sx={{ ...styles.inputSection, flexDirection: 'column', justifyContent: 'flex-start' }}>
                        <Box sx={{ ...styles.inputSection }}>
                            <TextInput placeholder='Nome Completo' name='name' onChange={handleChange} value={userData?.name || ''} label='Nome Completo: *'sx={{ flex: 1, }} />
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
                </Box>
            </ContentContainer>


            <ContentContainer style={{ ...styles.containerRegister, padding: showSections?.accessData ? '40px' : '25px' }}>
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
            </ContentContainer>

        </>
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
        usuarioId,
        newUser,
        fileData = [],
        columnId = '',
        matriculaId,
        isPermissionEdit
    } = props

    const { alert, setLoading, matches } = useAppContext()

    const handleDeleteFile = async (files) => {
        setLoading(true)
        const response = await deleteFile({ fileId: files?.[columnId], usuario_id: usuarioId, campo: files.campo, key: files?.key_file, matriculaId })
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
                                width: { xs: '100%', sm: 150, md: 150, lg: 150 },
                                borderRadius: campo === 'foto_perfil' ? '50%' : '',
                                aspectRatio: '1/1',
                            }}
                            callback={(file) => {
                                if (file.status === 201) {
                                    callback(file)
                                }
                            }}
                            usuario_id={usuarioId}
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
                                                    width: { xs: '100%', sm: 150, md: 150, lg: 150 },
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