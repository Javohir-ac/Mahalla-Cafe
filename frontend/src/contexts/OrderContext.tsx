import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface OrderContextType {
  isOrderEnabled: boolean
  toggleOrderFunctionality: () => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

interface OrderProviderProps {
  children: ReactNode
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [isOrderEnabled, setIsOrderEnabled] = useState<boolean>(true)

  // Load state from localStorage on initial render
  useEffect(() => {
    const savedState = localStorage.getItem('mahallaOrderEnabled')
    if (savedState !== null) {
      setIsOrderEnabled(JSON.parse(savedState))
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mahallaOrderEnabled', JSON.stringify(isOrderEnabled))
  }, [isOrderEnabled])

  const toggleOrderFunctionality = () => {
    setIsOrderEnabled(prev => !prev)
  }

  return (
    <OrderContext.Provider value={{ isOrderEnabled, toggleOrderFunctionality }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}
