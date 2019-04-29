const initMenusData = [
  {
    title: '工作台',
    path: '/workBench',
    icon: 'laptop',
    children: [
      {
        title: '待办任务',
        path: '/workBench/pending',
        icon: '',
      },
      {
        title: '已办任务',
        path: '/workBench/complete',
        icon: '',
      },
    ],
  },
];

class Menus {
  constructor() {
    this.initMenusData = initMenusData;
  }

  getAllMenusData() {
    return this.initMenusData;
  }

  getAuthorizedMenuData(resources) {
    if(!resources || resources.length === 0) {
      return [];
    }else {
      return this.initMenusData.filter((menu) => {
        if (resources.includes(menu.path)) {
          menu.children = menu.children.filter(({path}) => resources.includes(path));
          return true;
        }
        return false;
      })
    }
  }

  getFlatMenusConfig() {
    const menusData = this.getAllMenusData();
    let flatData = {};
    if(menusData && Array.isArray(menusData)) {
      menusData.map((item) => {
        flatData[item.path] = {...item};
        const path = item.path;
        if(item.children && Array.isArray(item.children)) {
          for(let value of item.children) {
            flatData[value.path] = {...value, parentPath : path};
          }
        }
      })
    }
    return flatData;
  }

}

export default Menus;
