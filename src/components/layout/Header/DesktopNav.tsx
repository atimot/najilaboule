import { NavLink, ReservationButton } from '../../common';
import { NAVIGATION } from '../../../constants/config';
import styles from './DesktopNav.module.css';

export function DesktopNav() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {NAVIGATION.sections.map((section) => (
          <li key={section.id}>
            <NavLink href={`#${section.id}`}>
              {section.label}
            </NavLink>
          </li>
        ))}
        <li>
          <ReservationButton variant="outline" size="sm" />
        </li>
      </ul>
    </nav>
  );
}
