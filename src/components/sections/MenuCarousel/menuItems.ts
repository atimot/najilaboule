import { IMAGES } from '../../../constants/images';

export interface MenuItem {
  id: number;
  image: string;
  nameKey: 'menu_1_name' | 'menu_2_name' | 'menu_3_name';
  descKey: 'menu_1_desc' | 'menu_2_desc' | 'menu_3_desc';
  dotColor: 'white' | 'orange' | 'red';
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    image: IMAGES.menu.items[0],
    nameKey: 'menu_1_name',
    descKey: 'menu_1_desc',
    dotColor: 'white',
  },
  {
    id: 2,
    image: IMAGES.menu.items[1],
    nameKey: 'menu_2_name',
    descKey: 'menu_2_desc',
    dotColor: 'orange',
  },
  {
    id: 3,
    image: IMAGES.menu.items[2],
    nameKey: 'menu_3_name',
    descKey: 'menu_3_desc',
    dotColor: 'red',
  },
];
