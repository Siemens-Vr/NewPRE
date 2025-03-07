import React from 'react';
import { TrendingUp } from 'lucide-react';

const CircularProgress = ({ inProgress, completed, yetToStart }) => {
  const sqSize = 80;
  const strokeWidth = 8;
  const radius = (sqSize - strokeWidth) / 2;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  const dashArray = radius * Math.PI * 2;

  const total = inProgress + completed + yetToStart;
  const completedPercentage = (completed / total) * 100;
  const inProgressPercentage = (inProgress / total) * 100;
  const yetToStartPercentage = (yetToStart / total) * 100;

  const completedOffset = dashArray - (dashArray * completedPercentage) / 100;
  const inProgressOffset = dashArray - (dashArray * (completedPercentage + inProgressPercentage)) / 100;
  const yetToStartOffset = 0;

  return (
    <svg width={sqSize} height={sqSize} viewBox={viewBox}>
      <circle
        className="stroke-current text-yellow-500"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        fill="none"
      />
      <circle
        className="stroke-current text-blue-500"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        fill="none"
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: inProgressOffset,
        }}
      />
      <circle
        className="stroke-current text-green-500"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        fill="none"
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: completedOffset,
        }}
      />
    </svg>
  );
};

const StatusDot = ({ status }) => {
  let baseColor, pulseColor;
  
  switch (status) {
    case 'in-progress':
      baseColor = 'bg-blue-500';
      pulseColor = 'bg-blue-400';
      break;
    case 'completed':
      baseColor = 'bg-green-500';
      pulseColor = 'bg-green-400';
      break;
    case 'pending':
      baseColor = 'bg-yellow-500';
      pulseColor = 'bg-yellow-400';
      break;
    case 'error':
      baseColor = 'bg-red-500';
      pulseColor = 'bg-red-400';
      break;
    default:
      baseColor = 'bg-gray-500';
      pulseColor = 'bg-gray-400';
  }

  return (
    <div className="relative">
      <div className={`w-3 h-3 ${baseColor} rounded-full`}></div>
      <div className={`absolute inset-0 ${pulseColor} rounded-full animate-ping opacity-75`}></div>
    </div>
  );
};
const ProjectStatus = ({ totalProjects, newProjects, inProgress, completed, yetToStart }) => {
  return (
    <div className="w-1/2 bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 ">
        <div className='flex flex-row items-center gap-60'>
        <h2 className="text-lg font-semibold mb-3">Project Status</h2>
        <StatusDot status="in-progress" />
        </div>
       
        <div className="flex items-start justify-between mb-4">
        <div className='flex w-1/3'>
          <div className="flex flex-col justify-center items-center text-4xl font-bold h-full">
            {totalProjects}
          </div>
          <div className='flex flex-col m-2'>
            <div className="text-xs text-gray-400 flex items-center">
              Total Deliverables
            </div>
            <div className='flex items-center text-green-500 mt-1'>
              <TrendingUp size={12} className="mr-1" />
              +{newProjects} New
            </div>
          </div>
        </div>
          <div className='flex flex-row items-center gap-12 w-1/3'>
          <div className="w-20 h-20">
            <CircularProgress inProgress={inProgress} completed={completed} yetToStart={yetToStart} />
          </div>
          <div className=" text-xs flex flex-col gap-2">
          <div className='flex flex-row items-center gap-3'>
            <div className="h-1 bg-blue-400 w-4"></div>
            <div className="text-white-400">In Progress</div>
            <div className="font-semibold">{inProgress}</div>
          </div>

          <div className='flex flex-row  items-center gap-3'>
            <div className="h-1 bg-green-400 w-4"></div>
            <div className="text-white-400">Completed</div>
            <div className="font-semibold">{completed}</div>
          </div>
          <div className='flex flex-row items-center gap-3'>
            <div className="h-1 bg-yellow-400 w-4"></div>
            <div className="text-white-400">Yet to start</div>
            <div className="font-semibold">{yetToStart}</div>
          </div>
        </div>
        </div>
        <div className='w-1/3'></div>
        </div>
     
      </div>
    </div>
  );
};

export default ProjectStatus;