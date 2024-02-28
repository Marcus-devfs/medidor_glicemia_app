import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Box, Button, ContentContainer, Divider, Text, TextInput } from '../../atoms'
import { Carousel, RadioItem, SelectList } from '../../organisms'
import { useAppContext } from '../../context/AppContext'
import { icons } from '../../organisms/layout/Colors'
import { useEffect, useState } from 'react'
import { menuItems } from '../../permissions'
import { useRouter } from 'next/router'
import { getImageByScreen } from '../../validators/api-requests'
import { api } from '../../api/api'
import { Avatar, Backdrop, Tooltip } from '@mui/material'
import { formatDate, formatTimeAgo, formatTimeStamp } from '../../helpers'
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver'

const inter = Inter({ subsets: ['latin'] })

const groupRows = [
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
]

const grouDiet = [
    { label: 'Sim', value: 1 },
    { label: 'Não', value: 0 },
]

export default function HistoricMarkings() {

    const { user, colorPalette, theme, setLoading, alert, notificationUser } = useAppContext()
    const [menu, setMenu] = useState(menuItems)
    const [markings, setMarkings] = useState([])
    const [showMarking, setShowMarking] = useState(false)
    const [showEditMarking, setShowEditMarking] = useState({ active: false, item: {} })
    const router = useRouter();
    moment.locale("pt-br");
    const localizer = momentLocalizer(moment);
    const [filters, setFilters] = useState({
        search: '',
        startDate: '',
        endDate: ''
    })
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const filterFunctions = {
        date: (item) => (filters?.startDate !== '' && filters?.endDate !== '') ? rangeDate(item.date, filters?.startDate, filters?.endDate) : item,
        search: (item) => {
            const normalizedSearchTerm = removeAccents(filters?.search?.toLowerCase());
            const normalizedPeriod = removeAccents(item.period?.toLowerCase()) || '';
            const normalizedFood = removeAccents(item.food?.toLowerCase()) || '';

            return (
                filters?.search === '' ||
                (normalizedSearchTerm &&
                    (normalizedPeriod.includes(normalizedSearchTerm) ||
                        normalizedFood.includes(normalizedSearchTerm)))
            ) ? item : null;
        },
    };

    const removeAccents = (str) => {
        return str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const rangeDate = (dateString, startDate, endDate) => {
        const date = new Date(dateString);
        const start = new Date(startDate);
        const end = new Date(endDate);

        return date >= start && date <= end;
    }

    const filter = (item) => {
        return Object.values(filterFunctions).every(filterFunction => filterFunction(item));
    };;


    const getMarkings = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/marking/list/${user?._id}?page=${page}&limit=${limit}`)
            setMarkings(response?.data)
        } catch (error) {
            alert.error('Ocorreu um erro ao listar medições.');
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        setLoading(true)
        try {
            const response = await api.delete(`/marking/delete/${id}`)
            if (response?.status === 200) {
                alert.success('Marcação excluída com sucesso!');
                getMarkings()
            } else {
                alert.error('Ocorreu um erro ao tentar excluir Marcação.');

            }
        } catch (error) {
            alert.error('Ocorreu um erro ao tentar excluir Marcação.');
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getMarkings()
    }, [page, limit]);


    const sortedHistoric = markings?.sort((a, b) => new Date(b.date) - new Date(a.date));

    const exportToExcel = () => {
        const headers = [
            "Data",
            "Periodo",
            "Valor",
            "Dentro da Dieta?",
            "O que Comeu?"
        ];

        const dataToExport = [
            headers,
            ...sortedHistoric
                ?.filter(filter)
                ?.map((item) => [
                    formatTimeStamp(item?.date),
                    item?.period,
                    item?.value,
                    item?.diet ? 'Sim' : 'Não',
                    item?.food
                ]),
        ];

        const ws = XLSX.utils.aoa_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Marcacoes-Glicemia");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "marcacoes_glicemia.xlsx");
    };


    const handleChange = (value) => {

        setShowEditMarking((prevValues) => ({
            ...prevValues,
            item: {
                ...prevValues.item,
                [value.target.name]: value.target.value,
            }
        }))
    }



    const handleEditMarking = async (id) => {
        setLoading(true)
        try {
            const response = await api.patch(`/marking/update/${id}`, { marking: showEditMarking?.item })
            if (response?.status === 200) {
                alert.success('Medição editada com sucesso!');
                setShowEditMarking({ active: false, item: {} })
                getMarkings()
            } else {
                alert.error('Ocorreu um erro ao editar a medição.');
            }
        } catch (error) {
            alert.error('Ocorreu um erro ao editar a medição.');
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

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

    return (
        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: { md: 'center', lg: 'center' } }}>

            <Head>
                <title>Clínica Trindade</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta charset="utf-8" />
                <link rel="icon" href="https://minhaclinicatrindade.s3.amazonaws.com/logo-clinica-light.png" />
            </Head>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', padding: '10px 0px 80px 0px', width: { xs: '%100', xm: '100%', md: '100%', lg: 600 } }}>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexDirection: 'row', width: { xs: '100%', xm: '100%', md: '100%', lg: '100%' }, transition: '0.5s', }}>
                    <Text
                        bold
                        title
                        style={{ display: 'flex', marginBottom: 6 }}>
                        Sua Lista de medições
                    </Text>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <TextInput placeholder={`Busque pelo "O que comeu ou Periodo.."`} name='filters' type="search" onChange={(event) => setFilters({ ...filters, search: event.target.value })} value={filters?.search} sx={{ flex: 1, }}
                        secondary />

                    <Box sx={{ ...styles.inputSection, gap: 1, flexDirection: 'row' }}>
                        <TextInput secondary label="De:" name='startDate' onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} type="date" value={(filters?.startDate)?.split('T')[0] || ''} sx={{ flex: 1, }} />
                        <TextInput secondary label="Até:" name='endDate' onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} type="date" value={(filters?.endDate)?.split('T')[0] || ''} sx={{ flex: 1, }} />
                    </Box>
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
                        }} onClick={() => setFilters({
                            search: '',
                            startDate: '',
                            endDate: ''
                        })}>
                            <Text large bold style={{ color: '#fff' }}>Limpar Filtros</Text>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 2 }}>
                    <Text bold>Exportar relatório: </Text>
                    <Box
                        sx={{
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            width: 15,
                            height: 15,
                            width: 20,
                            height: 20,
                            backgroundImage: `url('/icons/sheet.png')`,
                            transition: ".3s",
                            "&:hover": {
                                opacity: 0.8,
                                cursor: "pointer",
                            },
                        }}
                        onClick={() => exportToExcel()}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, marginTop: 2, alignItems: 'center', justifyContent: 'center' }}>
                    <SelectList data={groupRows} valueSelection={limit || ''} onSelect={(value) => setLimit(value)}
                        title="Items por pagina:" filterOpition="value" sx={{ color: colorPalette.textColor, width: 100 }}
                        secondary
                        inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                        clean={false}
                    />
                    <Button small secondary onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))} text="Anterior" style={{ height: 30 }} />
                    <Button small secondary onClick={() => setPage(prevPage => prevPage + 1)} text="Próxima" style={{ height: 30 }} />
                </Box>

                <Box sx={{
                    display: 'flex', width: '100%', flexDirection: 'column', padding: '10px 0px', borderRadius: 2, marginTop: 2, gap: 3,
                }}>
                    {markings?.filter(filter)?.length > 0 ?
                        sortedHistoric?.filter(filter)?.map((item, index) => {

                            return (
                                <Box key={index} sx={{
                                    display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '15px',
                                    flexDirection: 'column', position: 'relative', backgroundColor: colorPalette?.secondary, gap: 2,
                                    borderRadius: 2,
                                    boxShadow: theme ? `rgba(149, 157, 165, 0.27) 0px 6px 24px` : `rgba(35, 32, 51, 0.27) 0px 6px 24px`,

                                }}>

                                    <Box sx={{
                                        display: 'flex', width: '100%', justifyContent: 'space-around',
                                        padding: '2px 1px', borderRadius: 2
                                    }}>
                                        <Box sx={{
                                            border: `1px solid ${item?.diet ? 'green' : 'red'}`, display: 'flex', width: '140px', justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: '2px 5px', borderRadius: 2
                                        }}>
                                            <Text xsmall bold style={{
                                                color: item?.diet ? 'green' : 'red', width: '100%',
                                                textAlign: 'center'
                                            }}>{item?.diet ? 'Dentro da dieta' : 'Fora da Dieta'}</Text>
                                        </Box>

                                        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', flexDirection: 'row', gap: 1 }}>
                                            <Text bold>Dia:</Text>
                                            <Text>{formatTimeStamp(item?.date)}</Text>
                                        </Box>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex', width: '100%', justifyContent: 'space-around',
                                        gap: 2,
                                        alignItems: 'center',
                                        padding: '2px 1px', borderRadius: 2
                                    }}>
                                        <Box sx={{ display: 'flex', width: '40%', justifyContent: 'center', flexDirection: 'column', gap: 1.8 }}>
                                            <Text bold title>{item?.period}</Text>
                                        </Box>

                                        <Box sx={{ backgroundColor: 'lightgray', width: 1.5, height: '100%' }} />

                                        <Box sx={{
                                            display: 'flex', width: '50%', justifyContent: 'center', flexDirection: 'row', gap: 1,
                                            alignItems: 'center',
                                        }}>
                                            <Text bold>Valor da medição: </Text>
                                            <Text title>{item?.value}</Text>
                                        </Box>
                                    </Box>
                                    <Divider />

                                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', flexDirection: 'column', gap: .5 }}>
                                        <Text bold>O que comeu:</Text>
                                        <Text>{item?.food}</Text>
                                    </Box>

                                    <Box sx={{ display: 'flex', position: 'absolute', right: 15, bottom: 15, gap: 1, alignItems: 'center' }}>
                                        <Button small secondary onClick={() => setShowEditMarking({ active: true, item: item })} text="Editar" style={{ height: 30 }} />
                                        <Tooltip title="Excluir">
                                            <div>
                                                <Box sx={{
                                                    ...styles.menuIcon,
                                                    width: 35,
                                                    height: 35,
                                                    backgroundImage: `url('/icons/lixeira_icon.png')`,
                                                    transition: '.3s',
                                                    zIndex: 99,
                                                    "&:hover": {
                                                        opacity: 0.8,
                                                        cursor: 'pointer',
                                                        transform: 'scale(1.1, 1.1)'
                                                    }
                                                }} onClick={() => {
                                                    handleDelete(item?._id)
                                                }} />
                                            </div>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            )
                        })
                        :
                        <Text light style={{ textAlign: 'center' }}>Não encontrei marcações</Text>}
                </Box>

            </Box>

            <Backdrop open={showEditMarking?.active} sx={{ alignItems: { xs: 'start', xm: 'start', md: 'center', lg: 'center' }, zIndex: 99 }}>
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
                        <Text title bold>Editar Medição</Text>
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
                            setShowEditMarking({ active: false, item: {} })
                        }} />
                    </Box>
                    <Divider distance={0} />
                    <TextInput placeholder='Data' name='date' onChange={handleChange} type="date" value={(showEditMarking?.item?.date)?.split('T')[0] || ''} label='Data:' sx={{ flex: 1, }} />
                    <SelectList fullWidth data={groupPeriod} valueSelection={showEditMarking?.item?.period || ''} onSelect={(value) => setShowEditMarking({ ...showEditMarking, item: { ...showEditMarking?.item, period: value } })}
                        title="Periodo:" filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                        inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                    />
                    <TextInput placeholder='Valor da Medição' type="number" name='value' onChange={handleChange} value={showEditMarking?.item?.value || ''} label='Valor da Medição:' sx={{ flex: 1, }} />
                    <RadioItem valueRadio={showEditMarking?.item?.diet ? 1 : 0}
                        group={grouDiet}
                        title="Dentro da Dieta?"
                        horizontal={true}
                        onSelect={(value) => setShowEditMarking({ ...showEditMarking, item: { ...showEditMarking?.item, diet: parseInt(value) } })} />
                    <TextInput placeholder='O que comeu?' name='food' onChange={handleChange} value={showEditMarking?.item?.food || ''} label='O que comeu?' sx={{ flex: 1, }}
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
                        }} onClick={() => handleEditMarking(showEditMarking?.item?._id)}>
                            <Text bold style={{ color: '#fff' }}>Editar Medição</Text>
                        </Box>
                    </Box>
                </Box>
            </Backdrop>

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