import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar_collapsed');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar_position');
      return (saved === 'left' || saved === 'right') ? saved : 'left';
    } catch {
      return 'left';
    }
  });

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    localStorage.setItem('sidebar_position', position);
  }, [position]);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const togglePosition = () => setPosition((prev) => (prev === 'left' ? 'right' : 'left'));

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        toggleCollapse,
        position,
        setPosition,
        togglePosition,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
