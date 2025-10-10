import React, { createContext, ReactNode, useContext, useReducer } from 'react'
import ReactDOM from 'react-dom'
import Alert from '../components/Alert'
import styles from './AlertContext.module.scss'

interface Alert {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

interface AlertContextType {
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, 'id'>) => void
  removeAlert: (id: string) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

type Action =
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'REMOVE_ALERT'; payload: string }

interface AlertProviderProps {
  children: ReactNode
}

const alertReducer = (state: Alert[], action: Action): Alert[] => {
  switch (action.type) {
    case 'ADD_ALERT':
      return [...state, action.payload]
    case 'REMOVE_ALERT':
      return state.filter(alert => alert.id !== action.payload)
    default:
      return state
  }
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, dispatch] = useReducer(alertReducer, [])

  const addAlert = (alert: Omit<Alert, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    dispatch({ type: 'ADD_ALERT', payload: { ...alert, id } })
  }

  const removeAlert = (id: string) => {
    dispatch({ type: 'REMOVE_ALERT', payload: id })
  }

  // Create portal for alerts to appear at the top of the DOM
  const alertPortal =
    document.getElementById('alert-portal') ||
    (() => {
      const el = document.createElement('div')
      el.id = 'alert-portal'
      el.className = styles.alertPortal
      document.body.appendChild(el)
      return el
    })()

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
      {ReactDOM.createPortal(
        <div className={styles.alertContainer}>
          {alerts.map(alert => (
            <Alert
              key={alert.id}
              id={alert.id}
              type={alert.type}
              title={alert.title}
              message={alert.message}
              duration={alert.duration}
              onClose={removeAlert}
            />
          ))}
        </div>,
        alertPortal
      )}
    </AlertContext.Provider>
  )
}

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}
