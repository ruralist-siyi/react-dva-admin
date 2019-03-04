const initMenusData = [
  {
    title: '工作台',
    path: '/workbench',
    icon: 'laptop',
    children: [
      {
        title: '待办任务',
        path: '/workbench/pending',
        icon: '',
      },
      {
        title: '已办任务',
        path: '/workbench/complete',
        icon: '',
      },
    ],
  },
];

class Menus {
  constructor() {
    this.initMenusData = initMenusData;
  }

  getAllMenusDatta() {
    return this.initMenusData;
  }
}

export default Menus;