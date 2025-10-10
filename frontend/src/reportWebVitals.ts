import { CLSMetric, FCPMetric, INPMetric, LCPMetric, TTFBMetric } from 'web-vitals'

const reportWebVitals = (
  onPerfEntry?: (
    metric: CLSMetric | INPMetric | FCPMetric | LCPMetric | TTFBMetric
  ) => void
) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry)
      onINP(onPerfEntry)
      onFCP(onPerfEntry)
      onLCP(onPerfEntry)
      onTTFB(onPerfEntry)
    })
  }
}

export default reportWebVitals
