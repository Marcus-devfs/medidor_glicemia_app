import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Box, Button, ContentContainer, Divider, Text, TextInput } from '../atoms'
import { Carousel, RadioItem, SelectList } from '../organisms'
import { useAppContext } from '../context/AppContext'
import { icons } from '../organisms/layout/Colors'
import { useEffect, useState } from 'react'
import { menuItems } from '../permissions'
import { useRouter } from 'next/router'
import { getImageByScreen } from '../validators/api-requests'
import { api } from '../api/api'
import { Avatar, Backdrop } from '@mui/material'
import { formatDate, formatTimeAgo, formatTimeStamp } from '../helpers'
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"; // Estilo para o recurso de arrastar e soltar (se estiver usando)
import "react-big-calendar/lib/addons/dragAndDrop"; // Recurso de arrastar e soltar (se estiver usando)
import Hamburger from 'hamburger-react'

const inter = Inter({ subsets: ['latin'] })

const groupPeriod = [
   { label: 'Jejum', value: 'Jejum' },
   { label: 'Após Café', value: 'Após Café' },
   { label: 'Após Almoço', value: 'Após Almoço' },
   { label: 'Após Jantar', value: 'Após Jantar' },
]

const grouDiet = [
   { label: 'Sim', value: 1 },
   { label: 'Não', value: 0 },
]

function Home() {

   const { user, colorPalette, theme, setLoading, alert, notificationUser } = useAppContext()
   const name = user?.name?.split(' ');
   const firstName = name[0];
   const lastName = name[name.length - 1];
   const userName = `${firstName} ${lastName}`;
   const [menu, setMenu] = useState(menuItems)
   const [marking, setMarking] = useState({
      diet: null,
      food: ''
   })
   const [showMarking, setShowMarking] = useState(false)
   const [yearSelected, setYearSelected] = useState('todos')
   const [medias, setMedias] = useState({
      jejum: 0,
      aposLanch: 0
   })
   const router = useRouter();
   moment.locale("pt-br");
   const localizer = momentLocalizer(moment);

   const years = [
      { year: '2022', value: 2022 },
      { year: '2023', value: 2023 },
      { year: '2024', value: 2024 },
      { year: 'Todos', value: `todos` },
   ]


   const handleChange = (value) => {

      setMarking((prevValues) => ({
         ...prevValues,
         [value.target.name]: value.target.value,
      }))
   }

   const checkRequiredFields = () => {
      if (!marking?.date) {
         alert?.error('O campo Data é obrigatório')
         return false
      }
      if (!marking?.period) {
         alert?.error('O campo Periodo é obrigatório')
         return false
      }

      if (!marking?.value) {
         alert?.error('O campo Valor é obrigatório')
         return false
      }

      if (parseInt(marking?.diet) === '' || parseInt(marking?.diet) === null) {
         alert?.error('O campo Dieta é obrigatório')
         return false
      }

      return true
   }



   const getMarkings = async () => {
      setLoading(true)
      try {
         const response = await api.get(`/marking/list/media/${user?._id}?year=${yearSelected}`)
         const { jejum, aposLanch } = response?.data
         const somaJejum = jejum?.map(item => item?.value)?.reduce((acc, curr) => acc + curr, 0);
         const mediaJejum = jejum?.length > 0 ? somaJejum / jejum?.length : 0;
         const somaAposLanch = aposLanch?.map(item => item?.value)?.reduce((acc, curr) => acc + curr, 0);
         const mediaAposLanch = aposLanch?.length > 0 ? somaAposLanch / aposLanch?.length : 0;

         setMedias({
            jejum: mediaJejum.toFixed(0),
            aposLanch: mediaAposLanch.toFixed(0)
         });
      } catch (error) {
         alert.error('Ocorreu um erro ao listar medições.');
         console.log(error)
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      getMarkings()
   }, [yearSelected])

   const handleMarking = async () => {
      if (checkRequiredFields()) {
         setLoading(true)
         try {
            const response = await api.post(`/marking/create/${user?._id}`, { marking })
            if (response?.status === 201) {
               alert.success('Medição lançada com sucesso!');
               setMarking({})
               setShowMarking(false)
               router.push('/historic/list')
            } else {
               alert.error('Ocorreu um erro ao lançar a medição.');
            }
         } catch (error) {
            alert.error('Ocorreu um erro ao lançar a medição.');
            console.log(error)
         } finally {
            setLoading(false)
         }
      }
   }


   return (
      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: { md: 'center', lg: 'center' } }}>

         <Head>
            <title>Saudável Glicose</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <meta charset="utf-8" />
            <link rel="icon" href="https://mf-planejados.s3.amazonaws.com/logo_glicemia.png" />
         </Head>
         <Box sx={{
            display: 'flex', gap: 1, flexDirection: 'column', padding: '10px 0px 80px 0px',
            marginTop: { xs: '10px', xm: '10px', md: '60px', lg: '60px' }
         }}>

            <Box sx={{
               display: 'flex', gap: 1, justifyContent: 'center', flexDirection: 'row', width: { xs: '100%', xm: '100%', md: '100%', lg: '100%' }, transition: '0.5s', marginTop: 1,
               padding: '10px 10px'
            }}>
               <Text
                  bold
                  title
                  style={{ display: 'flex', gap: 2 }}>
                  Bem-vindo,
               </Text>
               <Text bold title style={{ color: colorPalette.buttonColor }}>
                  {userName}!
               </Text>
            </Box>

            <Text light large style={{ textAlign: 'center' }}>Faça sua medição aqui!</Text>

            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
               <Box sx={{
                  display: 'flex', gap: 1, backgroundColor: showMarking ? 'transparent' : colorPalette?.buttonColor, padding: '12px 12px', borderRadius: 2,
                  transition: '.3s',
                  border: showMarking && `1px solid ${colorPalette?.buttonColor}`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80%',
                  "&:hover": {
                     opacity: 0.8,
                     cursor: "pointer",
                     transform: 'scale(1.1, 1.1)'
                  },
               }} onClick={() => setShowMarking(!showMarking)}>
                  <Text large bold style={{ color: showMarking ? colorPalette?.buttonColor : '#fff' }}>{showMarking ? 'Fechar' : 'Fazer Medição'}</Text>
               </Box>
            </Box>

            <Backdrop open={showMarking} sx={{ alignItems: { xs: 'start', xm: 'start', md: 'center', lg: 'center' } }}>
               <Box sx={{
                  display: 'flex', width: '90%', justifyContent: 'center', flexDirection: 'column',
                  padding: { xs: '40px 20px', xm: '40px 20px', md: '40px 40px', lg: '40px 40px' },
                  borderRadius: 2, marginTop: 2, gap: 1.8,
                  backgroundColor: colorPalette?.secondary,
                  maxHeight: { xs: 530, xm: 530, md: 600, lg: 600, xl: 800 },
                  overflowX: 'auto',
                  width: { xs: '90%', xm: '500px', md: '500px', lg: '500px' }
               }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', zIndex: 9999, alignItems: 'center', padding: '0px 0px 8px 0px' }}>
                     <Text title bold>Dados da Medição</Text>
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
                        setShowMarking(false)
                     }} />
                  </Box>
                  <Divider distance={0} />
                  <TextInput placeholder='Data' name='date' onChange={handleChange} type="date" value={(marking?.date)?.split('T')[0] || ''} label='Data:' sx={{ flex: 1, }} />
                  <SelectList fullWidth data={groupPeriod} valueSelection={marking?.period || ''} onSelect={(value) => setMarking({ ...marking, period: value })}
                     title="Periodo:" filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                     inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                  />
                  <TextInput placeholder='Valor da Medição' type="number" name='value' onChange={handleChange} value={marking?.value || ''} label='Valor da Medição:' sx={{ flex: 1, }} />
                  <RadioItem valueRadio={marking?.diet}
                     group={grouDiet}
                     title="Dentro da Dieta?"
                     horizontal={true}
                     onSelect={(value) => setMarking({ ...marking, diet: parseInt(value) })} />
                  <TextInput placeholder='O que comeu?' name='food' onChange={handleChange} value={marking?.food || ''} label='O que comeu?' sx={{ flex: 1, }}
                     multiline
                     rows={3} maxRows={3} />

                  <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
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
                     }} onClick={() => handleMarking()}>
                        <Text large bold style={{ color: '#fff' }}>Lançar Medição</Text>
                     </Box>
                  </Box>
               </Box>
            </Backdrop>

            <Box sx={{ display: 'flex', gap: 2, marginTop: 5, flexDirection: 'column' }}>

               <Text bold title style={{ color: colorPalette?.buttonColor, textAlign: 'center' }}>Médias: </Text>
               <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row', justifyContent: 'center' }}>
                  {years?.map((item, index) => {
                     const selected = yearSelected === item?.value;
                     return (
                        <Box key={index} sx={{
                           display: 'flex', gap: 1, padding: '5px 8px', alignItems: 'center',
                           justifyContent: 'center', border: `1px solid ${colorPalette?.buttonColor}`,
                           backgroundColor: selected ? colorPalette?.buttonColor : 'transparent',
                           transition: '.3s',
                           "&:hover": {
                              opacity: 0.8,
                              cursor: "pointer",
                              transform: 'scale(1.1, 1.1)'
                           },
                        }} onClick={() => {
                           setYearSelected(item?.value)}}>
                           <Text bold style={{ color: selected ? '#fff' : colorPalette?.buttonColor }}>{item?.year}</Text>
                        </Box>
                     )
                  })}
               </Box>
               <Box sx={{ width: '100%', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', display: 'flex', marginTop: 2 }}>
                  <Text bold title> Jejum:</Text>
                  <Text bold indicator style={{ color: colorPalette?.buttonColor }}>{medias?.jejum}</Text>
               </Box>
               <Box sx={{ width: '100%', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', display: 'flex', marginTop: 2 }}>
                  <Text bold title>1 Hora d/Comer:</Text>
                  <Text bold indicator style={{ color: colorPalette?.buttonColor }}>{medias?.aposLanch}</Text>
               </Box>

               <Box sx={{ width: '100%', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', display: 'flex', marginTop: 2, padding: '5px 12px' }}>
                  <Text light small style={{ textAlign: 'center' }}> {'glicemia de jejum < 92 mg/dL, glicemia no tempo de 1 hora < 179 mg/dL e de 2 horas <= 152 mg/dL.'}</Text>
               </Box>
            </Box>
         </Box>
      </Box>
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

const styleCalendar = (colorPalette) => `
        .rbc-btn-group > button {
            color: white; /* Defina a cor do texto dos botões do calendário para pink */
            background-color: ${colorPalette.buttonColor}
          }
          .rbc-btn-group > button:focus {
            background-color: ${colorPalette.buttonColor + '66'}; /* Defina a cor de fundo do botão quando estiver com foco (ativo) */
            outline: none; /* Remova a borda de foco padrão */
          }

         //  .rbc-toolbar {
         //    padding: 10px;
         //    display: flex;
         //    justify-content: space-between;
         //    align-items: center;
         //    color: ${colorPalette.textColor};
         //    background-color: ${colorPalette.primary};
         //    font-size: 18px;
         //    // display: none;

         //  }

          /* Estilos para os dias da semana */
          .rbc-header {
            background-color: ${colorPalette.primary};
            color: ${colorPalette.textColor};
            font-size: 14px;
            padding: 5px;
          }

          .rbc-off-range {
            color: ${colorPalette.textColor}; /* Defina a cor do texto para dias fora do intervalo */
            background-color: ${colorPalette.primary}; /* Defina a cor de fundo para dias fora do intervalo */
          }

          .rbc-off-range-bg {
            background-color: ${colorPalette.primary}; /* Defina a cor de fundo para dias fora do intervalo */
          }

          .rbc-off {
            color: ${colorPalette.textColor}; /* Defina a cor do texto para dias fora do intervalo */
            background-color: ${colorPalette.primary}; /* Defina a cor de fundo para dias fora do intervalo */
          }
        
          /* Adicione estilos para o dia atual */
          .rbc-today {
            color: ${colorPalette.textColor}; /* Defina a cor do texto para o dia atual */
            background-color: ${colorPalette.primary}; /* Defina a cor de fundo para o dia atual */
          }
      `

Home.noPadding = true;

export default Home;