export const menuItems = [
   {
      text: 'Medição',
      icon: '/icons/agenda_icon.png',
      to: '/',
      permissions: ['administrador'],
   },
   {
      text: 'Histórico',
      icon: '/icons/agenda_icon.png',
      to: '/historic/list',
   },
   {
      text: 'Meus Dados',
      icon: '/icons/agenda_icon.png',
      to: '/users',
      queryId: true,
      permissions: ['profissional', 'administrador'],
   },

];