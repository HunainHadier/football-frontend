import React, { useState } from "react";

// Statistical Process Control Chart Component
const SPCControlChart = () => {
  // Sample data based on the image
  const [chartData] = useState({
    dataPoints: [
      { subgroup: 1, average: 3.44 },
      { subgroup: 2, average: 3.40 },
      { subgroup: 3, average: 3.37 },
      { subgroup: 4, average: 3.40 },
      { subgroup: 5, average: 3.46 },
      { subgroup: 6, average: 3.40 },
      { subgroup: 7, average: 3.37 },
      { subgroup: 8, average: 3.42 },
      { subgroup: 9, average: 3.38 },
      { subgroup: 10, average: 3.42 },
      { subgroup: 11, average: 3.51 },
      { subgroup: 12, average: 3.44 },
      { subgroup: 13, average: 3.40 },
      { subgroup: 14, average: 3.44 },
      { subgroup: 15, average: 3.42 },
      { subgroup: 16, average: 3.36 },
      { subgroup: 17, average: 3.42 },
      { subgroup: 18, average: 3.46 },
      { subgroup: 19, average: 3.38 },
      { subgroup: 20, average: 3.38 },
      { subgroup: 21, average: 3.42 },
      { subgroup: 22, average: 3.45 },
      { subgroup: 23, average: 3.42 },
      { subgroup: 24, average: 3.36 },
      { subgroup: 25, average: 3.40 },
    ],
    ucl: 3.5,           // Upper Control Limit
    lcl: 3.35,          // Lower Control Limit
    centerLine: 3.42,   // Center line (Mean/CL)
  });

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 400;
  const padding = { top: 50, right: 120, bottom: 60, left: 70 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Y-axis range
  const yMin = 3.3;
  const yMax = 3.52;
  const yRange = yMax - yMin;

  // Scale functions
  const scaleX = (subgroup) => {
    return padding.left + ((subgroup - 1) / 24) * plotWidth;
  };

  const scaleY = (value) => {
    return padding.top + plotHeight - ((value - yMin) / yRange) * plotHeight;
  };

  // Generate Y-axis ticks (every 0.02)
  const yTicks = [];
  for (let i = 3.3; i <= 3.52; i += 0.02) {
    yTicks.push(parseFloat(i.toFixed(2)));
  }

  // Generate X-axis ticks
  const xTicks = [0, 5, 10, 15, 20, 25];

  // Tooltip state
  const [tooltip, setTooltip] = useState({ 
    visible: false, 
    x: 0, 
    y: 0, 
    data: null 
  });

  const handleMouseEnter = (e, data) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 10,
      data: data
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, data: null });
  };

  // Check if point is out of control
  const isOutOfControl = (value) => {
    return value > chartData.ucl || value < chartData.lcl;
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1 fw-bold">Statistical Process Control (SPC) Chart</h5>
            <p className="mb-0 text-muted fs-13">Quality monitoring with control limits</p>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <span className="badge bg-success-subtle text-success">
              <span className="me-1">━━</span> UCL
            </span>
            <span className="badge bg-primary-subtle text-primary">
              <span className="me-1">━━</span> CL
            </span>
            <span className="badge bg-danger-subtle text-danger">
              <span className="me-1">━━</span> LCL
            </span>
          </div>
        </div>
      </div>
      
      <div className="card-body p-4">
        <div className="position-relative d-flex justify-content-center">
          <svg width={chartWidth} height={chartHeight}>
            {/* Outer border */}
            <rect
              x={padding.left}
              y={padding.top}
              width={plotWidth}
              height={plotHeight}
              fill="none"
              stroke="#2C5F5D"
              strokeWidth="3"
            />

            {/* Y-axis grid lines */}
            {yTicks.map((tick) => (
              <line
                key={`grid-y-${tick}`}
                x1={padding.left}
                y1={scaleY(tick)}
                x2={padding.left + plotWidth}
                y2={scaleY(tick)}
                stroke="#E8E8E8"
                strokeWidth="1"
              />
            ))}

            {/* X-axis grid lines */}
            {xTicks.slice(1).map((tick) => (
              <line
                key={`grid-x-${tick}`}
                x1={scaleX(tick)}
                y1={padding.top}
                x2={scaleX(tick)}
                y2={padding.top + plotHeight}
                stroke="#E8E8E8"
                strokeWidth="1"
              />
            ))}

            {/* Y-axis ticks and labels */}
            {yTicks.map((tick) => (
              <g key={`y-tick-${tick}`}>
                <line
                  x1={padding.left - 5}
                  y1={scaleY(tick)}
                  x2={padding.left}
                  y2={scaleY(tick)}
                  stroke="#333"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={scaleY(tick) + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#333"
                >
                  {tick.toFixed(2)}
                </text>
              </g>
            ))}

            {/* X-axis ticks and labels */}
            {xTicks.map((tick) => (
              <g key={`x-tick-${tick}`}>
                <line
                  x1={scaleX(tick === 0 ? 1 : tick)}
                  y1={padding.top + plotHeight}
                  x2={scaleX(tick === 0 ? 1 : tick)}
                  y2={padding.top + plotHeight + 5}
                  stroke="#333"
                  strokeWidth="1"
                />
                <text
                  x={scaleX(tick === 0 ? 1 : tick)}
                  y={padding.top + plotHeight + 20}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#333"
                >
                  {tick}
                </text>
              </g>
            ))}

            {/* Upper Control Limit (UCL) - Dashed line */}
            <line
              x1={padding.left}
              y1={scaleY(chartData.ucl)}
              x2={padding.left + plotWidth}
              y2={scaleY(chartData.ucl)}
              stroke="#000"
              strokeWidth="1.5"
              strokeDasharray="6,4"
            />

            {/* Lower Control Limit (LCL) - Dashed line */}
            <line
              x1={padding.left}
              y1={scaleY(chartData.lcl)}
              x2={padding.left + plotWidth}
              y2={scaleY(chartData.lcl)}
              stroke="#000"
              strokeWidth="1.5"
              strokeDasharray="6,4"
            />

            {/* Center Line (CL) - Solid line */}
            <line
              x1={padding.left}
              y1={scaleY(chartData.centerLine)}
              x2={padding.left + plotWidth}
              y2={scaleY(chartData.centerLine)}
              stroke="#DC143C"
              strokeWidth="2"
            />

            {/* UCL Label */}
            <text
              x={padding.left + plotWidth + 10}
              y={scaleY(chartData.ucl) - 5}
              fontSize="11"
              fill="#000"
              fontWeight="bold"
            >
              Upper Control Limit
            </text>
            <text
              x={padding.left + plotWidth + 10}
              y={scaleY(chartData.ucl) + 10}
              fontSize="10"
              fill="#666"
            >
              (UCL)
            </text>

            {/* LCL Label */}
            <text
              x={padding.left + plotWidth + 10}
              y={scaleY(chartData.lcl) + 5}
              fontSize="11"
              fill="#000"
              fontWeight="bold"
            >
              Lower Control Limit
            </text>
            <text
              x={padding.left + plotWidth + 10}
              y={scaleY(chartData.lcl) + 20}
              fontSize="10"
              fill="#666"
            >
              (LCL)
            </text>

            {/* Data line connecting points */}
            <polyline
              points={chartData.dataPoints
                .map((d) => `${scaleX(d.subgroup)},${scaleY(d.average)}`)
                .join(" ")}
              fill="none"
              stroke="#000"
              strokeWidth="1.5"
            />

            {/* Data points with diamond shapes */}
            {chartData.dataPoints.map((point, index) => {
              const x = scaleX(point.subgroup);
              const y = scaleY(point.average);
              const size = 6;
              const isOOC = isOutOfControl(point.average);

              return (
                <g key={index}>
                  {/* Diamond shape */}
                  <path
                    d={`
                      M ${x},${y - size}
                      L ${x + size},${y}
                      L ${x},${y + size}
                      L ${x - size},${y}
                      Z
                    `}
                    fill={isOOC ? "#FF4444" : "#8B008B"}
                    stroke="#000"
                    strokeWidth="1"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => handleMouseEnter(e, point)}
                    onMouseLeave={handleMouseLeave}
                  />
                  
                  {/* Warning indicator for out of control points */}
                  {isOOC && (
                    <circle
                      cx={x}
                      cy={y}
                      r="10"
                      fill="none"
                      stroke="#FF4444"
                      strokeWidth="2"
                      opacity="0.5"
                    />
                  )}
                </g>
              );
            })}

            {/* Y-axis label */}
            <text
              x={15}
              y={chartHeight / 2}
              transform={`rotate(-90, 15, ${chartHeight / 2})`}
              textAnchor="middle"
              fontSize="13"
              fill="#333"
              fontWeight="600"
            >
              Subgroup average
            </text>

            {/* X-axis label */}
            <text
              x={chartWidth / 2}
              y={chartHeight - 10}
              textAnchor="middle"
              fontSize="13"
              fill="#333"
              fontWeight="600"
            >
              Subgroup number
            </text>
          </svg>

          {/* Interactive Tooltip */}
          {tooltip.visible && tooltip.data && (
            <div
              style={{
                position: 'fixed',
                left: tooltip.x,
                top: tooltip.y,
                transform: 'translate(-50%, -100%)',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                pointerEvents: 'none',
                zIndex: 1000,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                border: isOutOfControl(tooltip.data.average) 
                  ? '2px solid #FF4444' 
                  : '2px solid #8B008B'
              }}
            >
              <div className="mb-1">
                <strong>Subgroup {tooltip.data.subgroup}</strong>
              </div>
              <div>Average: <strong>{tooltip.data.average.toFixed(3)}</strong></div>
              {isOutOfControl(tooltip.data.average) && (
                <div className="mt-1 text-warning">
                  ⚠️ Out of Control
                </div>
              )}
            </div>
          )}
        </div>

        {/* Statistical Summary */}
        <div className="mt-4">
          <div className="row g-3">
            <div className="col-md-3">
              <div className="p-3 border rounded bg-light">
                <div className="text-muted small mb-1">Upper Control Limit</div>
                <div className="h5 mb-0 text-success fw-bold">{chartData.ucl.toFixed(3)}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 border rounded bg-light">
                <div className="text-muted small mb-1">Center Line (Mean)</div>
                <div className="h5 mb-0 text-primary fw-bold">{chartData.centerLine.toFixed(3)}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 border rounded bg-light">
                <div className="text-muted small mb-1">Lower Control Limit</div>
                <div className="h5 mb-0 text-danger fw-bold">{chartData.lcl.toFixed(3)}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 border rounded bg-light">
                <div className="text-muted small mb-1">Process Status</div>
                <div className="h5 mb-0 text-success fw-bold">
                  {chartData.dataPoints.every(p => !isOutOfControl(p.average)) 
                    ? '✓ In Control' 
                    : '⚠ Out of Control'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Capability Info */}
        <div className="mt-3 p-3 bg-info-subtle rounded">
          <div className="d-flex align-items-start gap-2">
            <div className="text-info">ℹ️</div>
            <div className="small">
              <strong>Control Chart Guide:</strong>
              <ul className="mb-0 mt-1 ps-3">
                <li>Points within UCL and LCL indicate a stable process</li>
                <li>Points outside limits or unusual patterns suggest special causes</li>
                <li>Red center line shows the process mean</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SPCControlChart;
