import { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext"
import { emailValidator, formatCPF, formatPhone } from "../helpers"
import { Colors, IconTheme, SelectList } from "../organisms"
import { Box, ContentContainer, TextInput, Text, Divider } from "../atoms"
import Button from '@mui/material/Button';
import Head from "next/head"
import { createContract, createUser, getImageByScreen } from "../validators/api-requests"
import { icons } from "../organisms/layout/Colors"
import Link from "next/link"
import { api } from "../api/api"
import { Backdrop } from "@mui/material"
import { useRouter } from "next/router"

export const Register = ({ showRegister, setShowRegister }) => {

    const { login, alert, theme, colorPalette, setLoading, setShowConfirmationDialog } = useAppContext()
    const router = useRouter()
    const [userData, setUserData] = useState({
        name: null,
        gender: '',
        telephone: null,
        email: null,
        birthDate: null,
    })
    const [contract, setContract] = useState({
        funcao: null,
        area: null,
        horario: null,
        admissao: null,
        desligamento: null,
        conta_id: null,
        banco_1: null,
        conta_1: null,
        agencia_1: null,
        tipo_conta_1: null,
        banco_2: null,
        conta_2: null,
        agencia_2: null,
        tipo_conta_2: null
    })
    const [themeName, setThemeName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [windowWidth, setWindowWidth] = useState(0)
    const smallWidthDevice = windowWidth < 1000

    useEffect(() => {
        const themeAltern = theme ? setThemeName('dark') : setThemeName('clear')
        return themeAltern
    }, [theme])


    const checkRequiredFields = () => {
        if (!userData?.name) {
            alert?.error('O campo nome é obrigatório')
            return false
        }
        if (!userData?.email) {
            alert?.error('O campo email é obrigatório')
            return false
        }

        // if (!userData?.telephone) {
        //     alert?.error('O campo Telefone é obrigatório')
        //     return false
        // }

        if (!userData?.birthDate) {
            alert?.error('O campo Nascimento é obrigatório')
            return false
        }

        if (!userData?.gender) {
            alert?.error('O campo Genero é obrigatório')
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
                const response = await api.post('/user/create', { userData })
                console.log(response)
                const { data } = response
                if (response?.status === 201) {
                    alert.success('Parabéns! Seu cadastro foi realizado com sucesso!. Faça Login para começar a ultilizar a plataforma!');
                    // if (data?.userId) router.push(`/`)
                }
            } catch (error) {
                alert.error('Tivemos um problema ao criar seu cadastro.');
                console.log(error)
            } finally {
                setLoading(false)
            }
            return setLoading(false)
        }
    }

    const handleChange = (value) => {

        if (value.target.name == 'cpf') {
            let str = value.target.value;
            value.target.value = formatCPF(str)
        }

        if (value.target.name == 'telephone') {
            let str = value.target.value;
            value.target.value = formatPhone(str)
        }

        setUserData((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }

    const handleChangeContract = (value) => {
        setContract((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }))
    }


    useEffect(() => {
        setWindowWidth(window.innerWidth)
        window.addEventListener('resize', () => setWindowWidth(window.innerWidth))
        document.title = `Admin Meliés`
        return () => window.removeEventListener('resize', () => { });
    }, [])

    const groupGender = [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Feminino', value: 'Feminino' },
        { label: 'Outro', value: 'Outro' },
        { label: 'Prefiro não informar', value: 'Prefiro não informar' },
    ]

    return (
        <>
            <Head>
                <title>Clínica Trindade - Cadastro</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta charset="utf-8" />
                <link rel="icon" href="https://minhaclinicatrindade.s3.amazonaws.com/logo-clinica-light.png" />
            </Head>
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                transition: 'background-color 1s',
                width: '100%', height: '100%'
            }}>
                <Box sx={{
                    display: 'flex', gap: 1, backgroundColor: colorPalette.third,
                    width: '100%',
                    height: '100%', position: 'relative',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px 10px',
                }}>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        borderRadius: 2,
                        width: 500,
                        minHeight: 800,
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        padding: '15px 10px',
                        gap: 3,
                    }}>

                        <form style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', width: '100%', }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', width: '100%' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: .8, alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                                    <Text bold indicator style={{ color: !theme ? '#fff' : Colors.backgroundPrimary, transition: 'background-color 1s', textAlign: 'center' }}>Bem vindo! </Text>
                                    <Text bold indicator style={{ color: colorPalette.buttonColor, transition: 'background-color 1s', textAlign: 'center' }}>Faça Seu Cadastro para começar </Text>
                                </Box>
                                <Box sx={{
                                    display: 'flex', flexDirection: 'column', gap: 2, width: { xs: `80%`, xm: `80%`, md: '62.5%', lg: '80%' }, justifyContent: 'center',
                                }}>
                                    <Box sx={{ ...styles.inputSection, flexDirection: 'column', justifyContent: 'flex-start' }}>
                                        <Box sx={{ ...styles.inputSection }}>
                                            <TextInput placeholder='Nome Completo' name='name' onChange={handleChange} value={userData?.name || ''} label='Nome Completo: *' sx={{ flex: 1, }} />
                                        </Box>
                                        <TextInput placeholder='E-mail' name='email' onChange={handleChange} value={userData?.email || ''} label='E-mail: *' sx={{ flex: 1, }} />
                                        <TextInput placeholder='Telefone' name='telephone' onChange={handleChange} value={userData?.telephone || ''} label='Telefone: *' sx={{ flex: 1, }} />
                                        <Box sx={{ ...styles.inputSection }}>
                                            <TextInput placeholder='Nascimento' name='birthDate' onChange={handleChange} type="date" value={(userData?.birthDate)?.split('T')[0] || ''} label='Nascimento *' sx={{ flex: 1, }} />
                                            <SelectList fullWidth data={groupGender} valueSelection={userData?.gender || ''} onSelect={(value) => setUserData({ ...userData, gender: value })}
                                                title="Gênero *" filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                                                inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                                            />
                                        </Box>

                                        <Text bold>Digite sua senha de acesso:</Text>
                                        <Box sx={{ ...styles.inputSection, flexDirection: 'column', justifyContent: 'flex-start' }}>
                                            <TextInput placeholder='Senha' name='password' onChange={handleChange} value={userData?.password || ''} type="password" label='Senha' sx={{ flex: 1, }} />
                                            <TextInput placeholder='Confirmar senha' name='confirmPassword' onChange={handleChange} value={userData?.confirmPassword || ''} type="password" label='Confirmar senha' sx={{ flex: 1, }} />
                                        </Box>

                                    </Box>

                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', marginTop: 5, alignItems: 'center' }}>
                                <Button
                                    style={{
                                        width: { xs: `80%`, xm: `80%`, md: '60%', lg: '60%' },
                                        padding: '12px 80px',
                                        marginBottom: 5,
                                        borderRadius: '12px',
                                        backgroundColor: colorPalette.buttonColor,
                                        transition: 'background-color 1s',
                                        "&:hover": {
                                            backgroundColor: colorPalette.buttonColor + 'dd',
                                            cursor: 'pointer'
                                        },
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: '#f0f0f0',
                                        // padding: { xs: `6px 10px`, xm: `8px 16px`, md: `8px 16px`, lg: `8px 16px` },
                                        borderRadius: '12px',
                                    }}
                                    text='Entrar'
                                    onClick={() => handleCreateUser()}>
                                    <Text small bold style={{ color: 'inherit' }}>CADASTRAR</Text>
                                </Button>
                                <Text light small style={{ marginTop: 5 }}>Deseja voltar para tela de login?</Text>
                                <Button
                                    style={{
                                        width: '205px',
                                        padding: '10px 30px',
                                        marginBottom: 5,
                                        borderRadius: '100px',
                                        border: `1px solid ${colorPalette.buttonColor}`,
                                        transition: 'background-color 1s',
                                        "&:hover": {
                                            backgroundColor: colorPalette.buttonColor + '22',
                                            cursor: 'pointer'
                                        },
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: '#f0f0f0',
                                        // padding: { xs: `6px 10px`, xm: `8px 16px`, md: `8px 16px`, lg: `8px 16px` },
                                        borderRadius: '12px',
                                    }}
                                    text='Entrar'
                                    onClick={() => {
                                        setShowRegister(false)
                                    }}
                                >
                                    <Text small bold style={{ color: colorPalette.buttonColor }}>FAZER LOGIN</Text>
                                </Button>
                            </Box>

                        </form>
                    </Box>
                </Box >
            </Box >

        </>
    )
}


const styles = {
    favicon: {
        backgroundSize: 'cover',
        display: 'flex',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'contain',
        width: '140px',
        height: '67px',
        marginLeft: 12,
        // backgroundColor: 'pink'
    },
    icon: {
        width: '30px',
        height: '30px'
    },
    menuIcon: {
        backgroundSize: 'cover',
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
}