export default [
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/login',
        component: './login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        // authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            component: './Welcome',
          },
          {
            path: '/system',
            name: 'system',
            routes: [
              {
                path: '/system/menu',
                name: 'menu',
                component: './system/menu',
              },
              {
                path: '/system/role',
                name: 'role',
                component: './system/role',
              },
              {
                path: '/system/user',
                name: 'user',
                component: './system/user/list',
              },
            ],
          },
          {
            path: '/log',
            name: 'log',
            routes: [
              {
                path: '/log/error',
                name: 'error',
                component: './log/error',
              },
              {
                path: '/log/api',
                name: 'api',
                component: './log/api',
              },
              {
                path: '/log/usual',
                name: 'usual',
                component: './log/usual',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
