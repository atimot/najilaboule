export interface ExperienceItem {
  id: string;
  label: string;
  titleKey: 'soupe_title' | 'mariage_title';
  descKey: 'soupe_desc' | 'mariage_desc';
  image: string;
  imageAlt: string;
  reverse: boolean;
}

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'soupe',
    label: 'SOUPE',
    titleKey: 'soupe_title',
    descKey: 'soupe_desc',
    image: 'menu_01.JPG',
    imageAlt: 'Soup',
    reverse: true,
  },
  {
    id: 'mariage',
    label: 'MARIAGE',
    titleKey: 'mariage_title',
    descKey: 'mariage_desc',
    image: 'sake_01.JPG',
    imageAlt: 'Sake',
    reverse: false,
  },
];
