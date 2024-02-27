import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, Button, ContentContainer, Divider, Text, TextInput } from "../../atoms";
import { SectionHeader, SelectList, Holidays, CheckBoxComponent } from "../../organisms";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"; // Estilo para o recurso de arrastar e soltar (se estiver usando)
import "react-big-calendar/lib/addons/dragAndDrop"; // Recurso de arrastar e soltar (se estiver usando)
import { useAppContext } from "../../context/AppContext";
import { Backdrop, Checkbox, Grid, Input } from "@mui/material";
import { icons } from "../../organisms/layout/Colors";
import { api } from "../../api/api";
import { useRouter } from "next/router";
import { checkUserPermissions } from "../../validators/checkPermissionUser";
import { CheckBox } from "@mui/icons-material";
import { formatDate, formatTimeStamp } from "../../helpers";
import Link from "next/link";


moment.locale("pt-br");
const localizer = momentLocalizer(moment);

const listEvents = [
    {
        id: '01',
        title: "Feriado",
        description: "Escola fechada para todos, não tem aula nem funciona o adm",
        location: "",
        color: "#FF0000",
    },
    {
        id: '02',
        title: "Emenda de feriado",
        description: "Não tem aula, adm funciona normalmente",
        location: "",
        color: "#FF8C00",
    },
    {
        id: '03',
        title: "Férias/recesso de professores e alunos",
        description: "Adm funciona das 9h ás 18h",
        location: "",
        color: "#FFD700",
    },
    {
        id: '04',
        title: "Inicio das aulas do semestre",
        description: "",
        location: "",
        color: "#008000",
    },
    {
        id: '05',
        title: "Evento",
        description: "",
        location: "",
        color: "#FFC0CB",
    },
    {
        id: '06',
        title: "Avaliação",
        description: "",
        location: "",
        color: "#87CEFA",
    },
    {
        id: '07',
        title: "Semana de substitutiva",
        description: "",
        location: "",
        color: "#86b8f5",
    },
    {
        id: '08',
        title: "Semana de exame",
        description: "",
        location: "",
        color: "#5b969b",
    },
    {
        id: '09',
        title: "Divulgação de resultados final",
        description: "",
        location: "",
        color: "#1e5a8c",
    },
]

export default function CalendarComponent(props) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventForm, setShowEventForm] = useState(false);
    const [showAppointment, setShowAppointment] = useState(false);
    const [showReservas, setShowReservas] = useState(false);
    const [semester, setSemester] = useState()
    const [semesterSelect, setSemesterSelect] = useState()
    const [year, setYear] = useState(2024)
    const [yearSelect, setYearSelect] = useState(2024)
    const [reservasAgenda, setReservasAgenda] = useState([])
    const [defaultEvents, setDefaultEvents] = useState([])
    const [filterData, setFilterData] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [availability, setAvailability] = useState({});
    const [eventData, setEventData] = useState({
        title: "",
        description: "",
        location: "",
        color: "#007BFF",
        start: '',
        end: '',
        title: '',
        description: '',
        location: '',
        usuario_agendado: '',
        nome_usuario_agendado: '',
        email_agendado: '',
        nome_agendado: '',
        disponivel: 0,
        usuario_id: '',
        allDay: false
    });
    const router = useRouter()
    const { setLoading, alert, colorPalette, matches, user, userPermissions, menuItemsList } = useAppContext()
    const [isPermissionEdit, setIsPermissionEdit] = useState(false)
    const [isAvailability, setIsAvailability] = useState(false);
    const [duration, setDuration] = useState(60);

    const fetchPermissions = async () => {
        try {
            const actions = await checkUserPermissions(router, userPermissions, menuItemsList)
            setIsPermissionEdit(actions)
        } catch (error) {
            console.log(error)
            return error
        }
    }
    let date = new Date(year, 6, 1);
    const filter = (item) => {
        return semester === '1º Semestre' ? (item && item.start < date) : (item && item.start >= date);
    };

    useEffect(() => {
        handleItems()
        fetchPermissions()
    }, [])

    const handleItems = async () => {
        setLoading(true);
        const dataAtual = new Date();
        const anoAtual = dataAtual.getFullYear();
        const mesAtual = dataAtual.getMonth();
        setYear(anoAtual)
        setYearSelect(anoAtual)
        if (mesAtual > 5) {
            setSemester('2º Semestre')
            setSemesterSelect('2º Semestre')
        } else {
            setSemester('1º Semestre')
            setSemesterSelect('1º Semestre')
        }

        await handleEvents()
        setLoading(false);
    }

    const defaultYear = [
        {
            start: new Date(year, 0, 1), // January 2023
            end: new Date(year, 0, 31),
        },
        {
            start: new Date(year, 1, 1), // February 2023
            end: new Date(year, 1, 31),
        },
        {
            start: new Date(year, 2, 1), // March 2023
            end: new Date(year, 2, 30),
        },
        {
            start: new Date(year, 3, 1), // April 2023
            end: new Date(year, 3, 31),
        },
        {
            start: new Date(year, 4, 1), // Main 2023
            end: new Date(year, 4, 30),
        },
        {
            start: new Date(year, 5, 1), // Jun 2023
            end: new Date(year, 5, 31),
        },
        {
            start: new Date(year, 6, 1), // July 2023
            end: new Date(year, 6, 31),
        },
        {
            start: new Date(year, 7, 1), // August 2023
            end: new Date(year, 7, 31),
        },
        {
            start: new Date(year, 8, 1), // September 2023
            end: new Date(year, 8, 30),
        },
        {
            start: new Date(year, 9, 1), // October 2023
            end: new Date(year, 9, 31),
        },
        {
            start: new Date(year, 10, 1), // November 2023
            end: new Date(year, 10, 30),
        },
        {
            start: new Date(year, 11, 1), // December 2023
            end: new Date(year, 11, 31),
        },
    ];

    const handleEvents = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/event/profissional/agenda/${user?.id}`)
            const { data } = response
            if (data) {
                const eventsMap = data?.map((event) => ({
                    id_evento_calendario: event.id_evento_calendario,
                    start: new Date(event.inicio), // Adicione o início e o fim do evento como propriedades start e end
                    end: new Date(event.fim),
                    title: event.titulo,
                    description: event.descricao,
                    location: event.local,
                    color: event.color,
                    usuario_agendado: event?.usuario_agendado,
                    email_agendado: event?.email_agendado,
                    nome_agendado: event?.nome_agendado,
                    nome_usuario_agendado: event?.nome_usuario_agendado,
                    usuario_agendado: event?.usuario_agendado,
                    disponivel: event?.disponivel,
                    usuario_id: event?.usuario_id,
                    allDay: false, // Ajuste isso com base no seu caso de uso
                    consulta_id: event?.id_consulta
                }));
                setEvents([...eventsMap, ...Holidays]);
                return
            }
        } catch (error) {
            console.log(error)
            return error
        } finally {
            setLoading(false)
        }
    }

    // function handleFilter() {
    //     setLoading(true);
    //     setYear(yearSelect);
    //     setSemester(semesterSelect);
    //     setLoading(false);
    // }

    // useEffect(() => {
    //     setDefaultRangeDate(defaultYear);
    //     const filtered = defaultYear.filter(filter)
    //     setFilteredEvents(filtered);
    //     listEventsDefault();
    // }, [semester, year]);

    // const messages = {
    //     today: "Hoje",
    //     previous: "Anterior",
    //     next: "Próximo",
    //     month: "Mês",
    //     week: "Semana",
    //     day: "Dia",
    //     agenda: "Agenda",
    //     date: "Data",
    //     time: "Hora",
    //     event: "Evento",
    // };

    const handleCreateEvent = async (event) => {
        setLoading(true)
        try {
            const response = await api.post(`/event/create/${user?.id}`, { events: event })
            if (response.status === 201) {
                alert.success('Evento criado!')
                handleItems()
            }
        } catch (error) {
            return error
        } finally {
            setLoading(false)
        }
    };


    const handleCreateReservas = async () => {
        setLoading(true)
        try {
            const response = await api.post(`/event/reservas/create/${user?.id}`, { reservasAgenda })
            const { data } = response
            if (data?.status === 201) {
                alert.success('Rerervas criadas!')
                handleItems()
            }
        } catch (error) {
            return error
        } finally {
            setLoading(false)
        }
    };

    async function listEventsDefault() {
        try {
            const groupEvents = listEvents.map(event => ({
                label: event.title,
                value: event?.id
            }));

            setDefaultEvents(groupEvents);
        } catch (error) {
        }
    }

    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: event.color,
            borderRadius: "5px",
            display: "block",
            padding: "10px",
            opacity: !isSelected && 0.6,
            fontSize: '12px'
        };
        return {
            style,
            start, end
        };
    };


    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setShowEventForm(true);
        setEventData(event);
    };

    const handleDeleteEvent = async () => {
        try {
            setLoading(true)
            const response = await api.delete(`/event/delete/${eventData.id_evento_calendario}`)
            const { status } = response
            if (status === 200) {
                alert.success('Evento deletado.')
                handleItems()
                return
            }
            alert.error('Ocorreu um erro ao deletar o evento')
        } catch (error) {
            return error
        } finally {
            setLoading(false)
            setSelectedEvent(null);
            setShowEventForm(false);
        }
    }

    const handleEditEvent = async (event) => {

        try {
            setLoading(true)
            const response = await api.patch(`/event/update`, { events: event })
            const { status } = response
            if (status === 201) {
                alert.success('Evento atualizado.')
                handleItems()
                return
            }
            alert.error('Ocorreu um erro ao atualizar o evento')
        } catch (error) {
            return error
        } finally {
            setLoading(false)
            setSelectedEvent(null);
            setShowEventForm(false);
        }
    };

    const handleEventFormChange = (event) => {
        const { name, value } = event.target;
        setEventData((prevData) => ({
            ...prevData,
            [name]: name === "color" ? value : value,
        }));
    };


    const handleEventToSelect = (value) => {

        const data = listEvents.find((item) => item.title === value)
        setEventData((prevData) => ({
            ...prevData,
            title: data?.title,
            description: data?.description,
            location: data?.location,
            color: data?.color,
        }));
    }

    const handleEventFormSubmit = (event) => {
        event.preventDefault();

        if (selectedEvent) {
            handleEditEvent(eventData);
        } else {
            handleCreateEvent(eventData);
        }

        // Limpar o formulário após adicionar ou editar o evento
        setEventData({
            title: "",
            description: "",
            location: "",
            color: "#007BFF",
            start: '',
            end: '',
            title: '',
            description: '',
            location: '',
            usuario_agendado: '',
            email_agendado: '',
            nome_agendado: '',
            nome_usuario_agendado: '',
            disponivel: 0,
            usuario_id: '',
            allDay: false
        });

        // Fechar o formulário
        setShowEventForm(false);
    };

    const handleDayToggle = (day) => {
        day.toLowerCase()
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== day));
            setAvailability((prevAvailability) => {
                const updatedAvailability = { ...prevAvailability };
                delete updatedAvailability[day];
                return updatedAvailability;
            });
        } else {
            setSelectedDays([...selectedDays, day]);
            setAvailability((prevAvailability) => ({
                ...prevAvailability,
                [day]: { startTime: "09:00", endTime: "17:00" }, // Define um horário padrão
            }));
        }
    };

    const handleAvailabilityChange = (day, field, value) => {
        day.toLowerCase()
        setAvailability((prevAvailability) => ({
            ...prevAvailability,
            [day]: {
                ...prevAvailability[day],
                [field]: value,
            },
        }));
    };
    // const handleAvailabilitySubmit = () => {
    //     const availabilityData = {
    //         days: selectedDays.map((day) => {
    //             // Calcular a diferença de minutos entre o início e o término do dia
    //             const startOfDay = moment(availability[day]?.startTime || "09:00", "HH:mm");
    //             const endOfDay = moment(availability[day]?.endTime || "17:00", "HH:mm");
    //             const diffMinutes = endOfDay.diff(startOfDay, "minutes");

    //             // Calcular o número de slots disponíveis com base na duração
    //             const numSlots = diffMinutes / duration;

    //             // Criar os slots com base na duração
    //             const slots = Array.from({ length: numSlots }, (_, index) => ({
    //                 start: startOfDay.clone().add(index * duration, "minutes").format("HH:mm"),
    //                 end: startOfDay.clone().add((index + 1) * duration, "minutes").format("HH:mm"),
    //             }));

    //             return {
    //                 day,
    //                 slots,
    //             };
    //         }),
    //     };

    //     // Chame a função de callback para enviar os dados ao seu backend ou realizar a lógica necessária
    //     console.log(availabilityData);
    // };

    const handleAvailabilitySubmit = () => {
        const events = [];
        const currentDayOfMonth = moment().date();
        const lastDayOfMonth = moment().endOf("month").date();

        for (let dayOfMonth = currentDayOfMonth; dayOfMonth <= lastDayOfMonth; dayOfMonth++) {
            let dayOfWeek = moment(`${moment().format("YYYY-MM")}-${dayOfMonth}`, "YYYY-MM-DD").format("ddd", { locale: "pt" });
            dayOfWeek = dayOfWeek.toLowerCase();

            if (selectedDays.map(day => day.toLowerCase()).includes(dayOfWeek)) {
                const startOfDay = moment(availability[dayOfWeek]?.startTime || "09:00", "HH:mm");
                const endOfDay = moment(availability[dayOfWeek.toLowerCase()]?.endTime || "17:00", "HH:mm");
                const diffMinutes = endOfDay.diff(startOfDay, "minutes");

                const numSlots = diffMinutes / duration;

                const slots = Array.from({ length: numSlots }, (_, index) => {
                    const slotStart = startOfDay.clone().add(index * duration, "minutes");
                    const slotEnd = slotStart.clone().add(duration, "minutes");

                    // Verifica se o horário final é maior que o fim do dia; se for, ajusta para o fim do dia
                    if (slotEnd.isAfter(endOfDay)) {
                        return {
                            start: slotStart.format("HH:mm"),
                            end: endOfDay.format("HH:mm"),
                        };
                    } else {
                        return {
                            start: slotStart.format("HH:mm"),
                            end: slotEnd.format("HH:mm"),
                        };
                    }
                });

                slots.forEach((slot) => {
                    const event = {
                        titulo: "Reserva de consulta",
                        descricao: "Horário disponível para reserva.",
                        local: "",
                        color: "#808080",
                        inicio: moment(`${moment().format("YYYY-MM")}-${dayOfMonth} ${slot.start}`, "YYYY-MM-DD HH:mm").toISOString(),
                        fim: moment(`${moment().format("YYYY-MM")}-${dayOfMonth} ${slot.end}`, "YYYY-MM-DD HH:mm").toISOString(),
                        usuario_agendado: '',
                        email_agendado: '',
                        nome_agendado: '',
                        disponivel: 0,
                        usuario_id: user?.id,
                        nome_usuario_agendado: ''
                    };

                    events.push(event);
                });
            } else {
                console.log(`Day ${dayOfWeek} is not selected`);
            }
        }
        setReservasAgenda(events);

        if (events.length > 0) {
            alert.success('Lista de reservas criada.')
            setShowAppointment(false)
            setShowReservas(true)
            setAvailability([])
            setSelectedDays([])
        } else {
            alert.error('Houve um erro ao tentar criar a lista de reservas')
        }
    };





    const handleDurationChange = (value) => {
        setDuration(parseInt(value, 10));
    };

    const groupMonths = [
        { label: '1º Semestre', value: '1º Semestre' },
        { label: '2º Semestre', value: '2º Semestre' },
    ]

    const groupPerfil = [
        { label: 'Profissional', value: 'Profissional' },
        { label: 'Paciente', value: 'Paciente' }
    ]

    const groupHour = [
        { label: '1,5 hora', value: 90 },
        { label: 'Uma hora', value: 60 },
        { label: '45 Minutos', value: 45 },
        { label: 'Meia hora', value: 30 },
    ]

    const horarios = (obj) => {
        const horaMoment = moment(obj);
        const horaFormatada = horaMoment.format("HH:mm");
        return horaFormatada
    }


    return (
        <>
            <SectionHeader
                icon={'/icons/agenda_icon.png'}
                title={`${user?.nome}` || `Calendário de Agendas`} />

            <Box sx={{ display: 'flex', gap: 3 }}>
                <TextInput placeholder="Buscar pelo paciente" name='filterData' type="search" onChange={(event) => setFilterData(event.target.value)} value={filterData} sx={{ flex: 1 }}
                    InputProps={{
                        style: {
                            backgroundColor: colorPalette.secondary
                        }
                    }} />

                <Box sx={{ display: 'flex', gap: 2, }}>

                    <Box sx={{
                        display: 'flex', backgroundColor: colorPalette.secondary, padding: '10px 20px',
                        borderRadius: 2,
                        alignItems: 'center', gap: 2,
                        boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }}>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url('/icons/include_icon.png')`,
                            transition: '.3s',
                            width: 20, height: 20,
                            "&:hover": {
                                opacity: 0.8,
                                cursor: 'pointer'
                            }
                        }} />
                        <Text bold>Novo agendamento</Text>
                    </Box>


                    <Box sx={{
                        display: 'flex', backgroundColor: colorPalette.secondary, padding: '10px 20px',
                        borderRadius: 2,
                        alignItems: 'center', gap: 2,
                        boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }} onClick={() => setShowAppointment(true)}>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url('/icons/agenda_icon.png')`,
                            transition: '.3s',
                            width: 20, height: 20,
                            "&:hover": {
                                opacity: 0.8,
                                cursor: 'pointer'
                            }
                        }} />
                        <Text bold>Disponibilidade de Reservas</Text>
                    </Box>

                    <Box sx={{
                        display: 'flex', backgroundColor: colorPalette.secondary, padding: '10px 20px',
                        borderRadius: 2,
                        alignItems: 'center', gap: 2,
                        boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }} onClick={() => setShowReservas(true)}>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url('/icons/agenda_icon.png')`,
                            transition: '.3s',
                            width: 20, height: 20,
                            "&:hover": {
                                opacity: 0.8,
                                cursor: 'pointer'
                            }
                        }} />
                        <Text bold>Lista de Reservas</Text>
                    </Box>

                    <Box sx={{
                        display: 'flex', backgroundColor: colorPalette.secondary, padding: '10px 20px',
                        borderRadius: 2,
                        alignItems: 'center', gap: 2,
                        boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                        "&:hover": {
                            opacity: 0.8,
                            cursor: 'pointer'
                        }
                    }}>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url('/icons/agenda_espera_icon.png')`,
                            transition: '.3s',
                            width: 20, height: 20,
                            "&:hover": {
                                opacity: 0.8,
                                cursor: 'pointer'
                            }
                        }} />
                        <Text bold>Lista de Espera</Text>
                    </Box>
                </Box>
            </Box>

            <Calendar
                localizer={localizer}
                // defaultDate={month?.start}
                culture="pt-br"
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                onSelectSlot={(slotInfo) => {
                    setEventData({
                        ...eventData,
                        start: slotInfo.start,
                        end: slotInfo.end,
                    });
                    setSelectedEvent(null);
                    setShowEventForm(true);
                }}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                // messages={messages}
                style={{
                    fontFamily: 'MetropolisBold',
                    color: colorPalette.textColor,
                    backgroundColor: colorPalette.secondary,
                    borderRadius: '12px',
                    boxShadow: `rgba(149, 157, 165, 0.17) 0px 6px 24px`,
                    border: `.5px solid lightgray`,
                    padding: 10,
                    height: 800
                }}
            />
            {
                showEventForm && (
                    <Backdrop open={showEventForm} sx={{ zIndex: 999 }}>
                        <ContentContainer style={{ maxWidth: { md: '1200px', lg: 900, xl: 1500 }, maxHeight: { md: '180px', lg: '600px', xl: '1200px' }, overflowY: 'auto', width: 400 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text bold large>{selectedEvent ? eventData?.title : "Adicionar evento"}</Text>
                                <Box sx={{
                                    ...styles.menuIcon,
                                    backgroundImage: `url(${icons.gray_close})`,
                                    transition: '.3s',
                                    zIndex: 999999999,
                                    "&:hover": {
                                        opacity: 0.8,
                                        cursor: 'pointer'
                                    }
                                }} onClick={() => {
                                    setShowEventForm(false)
                                    setEventData({
                                        title: "",
                                        description: "",
                                        location: "",
                                        color: "#007BFF",
                                        start: '',
                                        end: '',
                                        title: '',
                                        description: '',
                                        location: '',
                                        usuario_agendado: '',
                                        email_agendado: '',
                                        nome_agendado: '',
                                        nome_usuario_agendado: '',
                                        disponivel: 0,
                                        usuario_id: '',
                                        allDay: false
                                    });
                                }} />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Box sx={{ display: "flex", flexDirection: "row", gap: .5 }}>
                                    <Text bold>Inicio:</Text>
                                    <Text>{horarios(eventData?.start)}</Text>
                                </Box>
                                <Box sx={{ display: "flex", flexDirection: "row", gap: .5 }}>
                                    <Text bold>Fim:</Text>
                                    <Text>{horarios(eventData?.end)}</Text>
                                </Box>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', maxHeight: 600, paddingTop: 3 }}>
                                <TextInput disabled={!isPermissionEdit && true}
                                    name="title"
                                    value={eventData?.title || ''}
                                    label='Título'
                                    onChange={handleEventFormChange}
                                    sx={{ flex: 1 }}
                                />
                                <TextInput
                                    disabled={!isPermissionEdit && true}
                                    name="description"
                                    value={eventData.description || ''}
                                    label='Descrição do evento'
                                    onChange={handleEventFormChange}
                                    sx={{ flex: 1 }}
                                    multiline
                                    maxRows={8}
                                    rows={4}
                                />
                                <TextInput disabled={!isPermissionEdit && true}
                                    name="location"
                                    value={eventData.location || ''}
                                    label='Localização do evento'
                                    onChange={handleEventFormChange}
                                    sx={{ flex: 1 }}
                                />
                                <TextInput disabled={!isPermissionEdit && true}
                                    type="color"
                                    name="color"
                                    value={eventData.color}
                                    onChange={handleEventFormChange}
                                />
                                <TextInput disabled={!isPermissionEdit && true}
                                    name="email_agendado"
                                    value={eventData?.email_agendado || ''}
                                    label='E-mail agendado:'
                                    onChange={handleEventFormChange}
                                    sx={{ flex: 1 }}
                                />
                                <TextInput disabled={!isPermissionEdit && true}
                                    name="nome_agendado"
                                    value={eventData?.nome_agendado || ''}
                                    label='Nome agendado:'
                                    onChange={handleEventFormChange}
                                    sx={{ flex: 1 }}
                                />
                                <TextInput disabled={!isPermissionEdit && true}
                                    name="nome_usuario_agendado"
                                    value={eventData?.nome_usuario_agendado || ''}
                                    label='Paciente:'
                                    onChange={handleEventFormChange}
                                    sx={{ flex: 1 }}
                                />
                                <Divider />

                                {eventData?.consulta_id &&
                                    <Link href={`/consultation/${eventData?.consulta_id}`} target="_blank">
                                        <Button
                                            secondary
                                            disabled={!isPermissionEdit && true}
                                            small
                                            text="Prontuário"
                                            style={{ height: 30, width: 120 }}
                                        />
                                    </Link>
                                }

                                <Box sx={{ display: 'flex', justifyContent: 'start', gap: 1, alignItems: 'center', marginTop: 2 }}>
                                    <Button
                                        disabled={!isPermissionEdit && true}
                                        small
                                        type="submit"
                                        text={selectedEvent ? "Atualizar" : "Adicionar"}
                                        style={{ padding: '5px 6px 5px 6px', width: 100 }}
                                        onClick={(event) => handleEventFormSubmit(event)}
                                    />
                                    {selectedEvent &&
                                        <Button
                                            disabled={!isPermissionEdit && true}
                                            secondary
                                            small
                                            text='Deletar'
                                            style={{ padding: '5px 6px 5px 6px', width: 100 }}
                                            onClick={(event) => {
                                                handleDeleteEvent(event)
                                                setShowEventForm(false)
                                                setEventData({
                                                    title: "",
                                                    description: "",
                                                    location: "",
                                                    color: "#007BFF",
                                                });
                                            }}
                                        />}
                                </Box>
                            </Box>
                        </ContentContainer>
                    </Backdrop>
                )
            }

            <Backdrop open={showAppointment} sx={{ zIndex: 999 }}>
                <ContentContainer style={{ maxWidth: { md: '800px', lg: '1980px' }, maxHeight: { md: '800px', lg: '1280px' }, overflowY: matches && 'auto', width: 400 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text bold large>Dísponibilidade de reserva</Text>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.gray_close})`,
                            transition: '.3s',
                            zIndex: 999999999,
                            "&:hover": {
                                opacity: 0.8,
                                cursor: 'pointer'
                            }
                        }} onClick={() => {
                            setShowAppointment(false)
                        }} />
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                        <Text bold>Duração da Reserva (minutos):</Text>
                        {/* <Input
                            type="number"
                            value={duration}
                            onChange={handleDurationChange}
                            sx={{ width: "80px" }}
                        /> */}
                        <SelectList fullWidth data={groupHour} valueSelection={duration || ''} onSelect={(value) => handleDurationChange(value)}
                            filterOpition="value" sx={{ color: colorPalette.textColor, flex: 1 }}
                            inputStyle={{ color: colorPalette.textColor, fontSize: '15px', fontFamily: 'MetropolisBold' }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                        <Text bold>Dias disponíveis:</Text>
                        <Grid container spacing={1} sx={{ flexDirection: 'column' }}>
                            {["dom", "seg", "ter", "qua", "qui", "sex", "sáb"].map((day) => (
                                <Grid item key={day} sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                    <Checkbox
                                        checked={selectedDays.includes(day)}
                                        onChange={() => handleDayToggle(day)}
                                    />
                                    <Text>{day}</Text>
                                    {selectedDays.includes(day) && (
                                        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                                            <Input
                                                type="time"
                                                label="Hora de início"
                                                value={availability[day]?.startTime || "09:00"}
                                                onChange={(e) => handleAvailabilityChange(day, "startTime", e.target.value)}
                                            />
                                            <Input
                                                type="time"
                                                label="Hora de término"
                                                value={availability[day]?.endTime || "17:00"}
                                                onChange={(e) => handleAvailabilityChange(day, "endTime", e.target.value)}
                                            />
                                        </Box>
                                    )}
                                </Grid>
                            ))}
                        </Grid>

                        <Button onClick={handleAvailabilitySubmit} text="Salvar Disponibilidade" />
                    </Box>
                </ContentContainer>
            </Backdrop>

            <Backdrop open={showReservas} sx={{ zIndex: 999 }}>
                <ContentContainer style={{ maxWidth: { md: '800px', lg: '1980px' }, maxHeight: { md: '580px', lg: '600px', xl: '960px' }, overflowY: matches && 'auto', width: 400 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text bold large>Lista de reserva</Text>
                        <Box sx={{
                            ...styles.menuIcon,
                            backgroundImage: `url(${icons.gray_close})`,
                            transition: '.3s',
                            zIndex: 999999999,
                            "&:hover": {
                                opacity: 0.8,
                                cursor: 'pointer'
                            }
                        }} onClick={() => {
                            setShowReservas(false)
                        }} />
                    </Box>
                    <Divider />
                    {reservasAgenda?.length > 0 ?
                        <>
                            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', maxHeight: 600, overflowY: 'auto', }}>
                                {reservasAgenda?.map((item, index) => {
                                    // const date = formatTimeStamp(item?.start, false)
                                    const date = formatDate(item?.inicio)
                                    const horarios = (obj) => {
                                        const horaMoment = moment(obj);
                                        const horaFormatada = horaMoment.format("HH:mm");
                                        return horaFormatada
                                    }
                                    const disponivel = item?.disponivel === 0
                                    return (
                                        <Box key={index} sx={{
                                            position: 'relative',
                                            display: 'flex', gap: 2, borderRadius: 2, backgroundColor: colorPalette.primary,
                                            padding: '10px 12px',
                                        }}>
                                            <Box>
                                                <Text small bold>{date}</Text>
                                                <Text bold>{item?.titulo}</Text>
                                                <Text>{item?.descricao}</Text>
                                                <Box sx={{ display: 'flex', gap: .5, alignItems: 'center' }}>
                                                    <Text small light>{horarios(item?.inicio)}</Text>
                                                    <Text small light>-</Text>
                                                    <Text small light>{horarios(item?.fim)}</Text>
                                                </Box>
                                                <Box sx={{
                                                    display: 'flex', padding: '5px 12px', borderRadius: 2, position: 'absolute', bottom: 5, right: 5, backgroundColor: disponivel ? 'green' : 'red', alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Text style={{ color: '#fff' }}>
                                                        {disponivel ? 'disponível' : 'reservado'}
                                                    </Text>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )
                                })}
                                <Divider />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, flex: 1, justifyContent: 'center' }}>
                                <Button text="Cancelar reservas" secondary small onClick={() => {
                                    setReservasAgenda([])
                                }} />
                                <Button text="Salvar reservas" small onClick={() => handleCreateReservas()} />
                            </Box>
                        </>
                        :
                        <Text>Não possui reservas cadastradas</Text>

                    }
                </ContentContainer>
            </Backdrop>

        </ >
    );
}

const styles = {
    menuIcon: {
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 20,
        height: 20,
    },
}
