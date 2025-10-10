import { CLSMetric, FCPMetric, INPMetric, LCPMetric, TTFBMetric, onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'

const reportWebVitals = (
  onPerfEntry?: (
    metric: CLSMetric | INPMetric | FCPMetric | LCPMetric | TTFBMetric
  ) => void
) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onCLS(onPerfEntry)
    onINP(onPerfEntry)
    onFCP(onPerfEntry)
    onLCP(onPerfEntry)
    onTTFB(onPerfEntry)
  }
}

export default reportWebVitals
