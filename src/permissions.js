export const menuItems = [
   {
      text: 'Medição',
      icon: '/icons/check.png',
      to: '/',
      permissions: ['administrador'],
   },
   {
      text: 'Histórico',
      icon: '/icons/historical.png',
      to: '/historic/list',
   },
   {
      text: 'Meus Dados',
      icon: '/icons/user-2.png',
      to: '/users',
      queryId: true,
      permissions: ['profissional', 'administrador'],
   },

];