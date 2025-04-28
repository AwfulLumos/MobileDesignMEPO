/* eslint-disable prettier/prettier */
import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    // Get the current date and time when the notification is added
    const date = new Date().toLocaleString();
    // Add notification with the message and the timestamp
    setNotifications((prev) => [...prev, { id: Date.now(), message, date }]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
