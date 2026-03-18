import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import type { StatusType } from '../../types/types';

interface Props {
  navs: {
    option: string;
    func: () => void | Promise<void>;
    status?: StatusType | 'all' | null | 'summary';
  }[];
  currentFilter: StatusType | 'all' | null | 'summary';
}

const DashboardNav: React.FC<Props> = ({ navs, currentFilter }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const styles = {
    container: 'w-full py-1 px-2 sm:px-4 relative',
    navList: 'hidden md:flex flex-nowrap gap-2 sm:gap-4',
    navItem: 'font-semibold hover:font-bold py-2 px-3 sm:px-4 hover:bg-indigo-100 hover:text-indigo-500 hover:rounded-xl cursor-pointer transition-all whitespace-nowrap',
    selected: 'border-b-2 border-indigo-500 text-indigo-500',
    mobileMenuButton: 'md:hidden absolute right-4 top-2 text-2xl text-gray-600 hover:text-indigo-500 transition-colors z-50',
    mobileMenu: 'md:hidden fixed top-12 right-4 bg-white shadow-lg rounded-lg py-1 z-40 min-w-[200px] divide-y divide-gray-100',
    mobileNavItem: 'block w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-500 transition-colors font-semibold',
    mobileSelected: 'bg-indigo-50 text-indigo-500'
  }

  const onClick = (func: () => void | Promise<void>) => {
    if (func) func()
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className={styles.container}>
      <button
        className={styles.mobileMenuButton}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
      </button>

      {/* Desktop Navigation */}
      <div className={styles.navList}>
        {navs.map((nav, i) =>
          <button
            key={i}
            className={styles.navItem + (nav.status === currentFilter ? " " + styles.selected : "")}
            onClick={() => onClick(nav.func)}
          >
            {nav.option}
          </button>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {navs.map((nav, i) =>
            <button
              key={i}
              className={styles.mobileNavItem + (nav.status === currentFilter ? " " + styles.mobileSelected : "")}
              onClick={() => onClick(nav.func)}
            >
              {nav.option}
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default DashboardNav
