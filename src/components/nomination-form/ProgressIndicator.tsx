'use client';

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => {
          // Determine the status of the step
          const isCompleted = index < currentStep - 1;
          const isCurrent = index === currentStep - 1;
          
          return (
            <div key={index} className="flex items-center relative">
              {/* Connecting line */}
              {index > 0 && (
                <div 
                  className={`absolute h-1 w-full right-1/2 -left-full top-1/2 transform -translate-y-1/2 z-0 
                    ${isCompleted ? 'bg-blue-600' : 'bg-gray-300'}`}
                />
              )}
              
              {/* Step circle */}
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center z-10
                  ${isCompleted 
                    ? 'bg-blue-600 text-white' 
                    : isCurrent 
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              {/* Step label */}
              <div className={`absolute top-12 -left-1/2 -right-1/2 text-center ${isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                <span className="text-sm">{step}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mobile view - simpler display */}
      <div className="sm:hidden">
        <div className="flex justify-between mb-4">
          <span className="text-sm font-medium text-blue-600">Step {currentStep} of {steps.length}</span>
          <span className="text-sm font-medium text-gray-500">{steps[currentStep - 1]}</span>
        </div>
        <div className="overflow-hidden rounded-full bg-gray-200">
          <div 
            className="h-2 bg-blue-600 rounded-full" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
