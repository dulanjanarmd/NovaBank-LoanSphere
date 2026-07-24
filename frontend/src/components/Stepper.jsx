import { Check } from 'lucide-react'
import { applicationStages } from '../data/mockData'

export default function Stepper({ currentStage = 1, stages = applicationStages }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {stages.map((stage, idx) => {
          const isComplete = currentStage > stage.id
          const isCurrent = currentStage === stage.id
          const isLast = idx === stages.length - 1
          return (
            <div key={stage.id} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                    isComplete
                      ? 'border-success-500 bg-success-500 text-white'
                      : isCurrent
                      ? 'border-accent-500 bg-accent-50 text-accent-700 ring-4 ring-accent-100'
                      : 'border-ink-200 bg-white text-ink-400'
                  }`}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : stage.id}
                </div>
                <div className="text-center">
                  <div className={`text-xs font-semibold ${isCurrent || isComplete ? 'text-navy-800' : 'text-ink-400'}`}>
                    {stage.label}
                  </div>
                </div>
              </div>
              {!isLast && (
                <div className="mx-2 h-0.5 flex-1 rounded-full bg-ink-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-success-500' : 'bg-transparent'}`}
                    style={{ width: isComplete ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
