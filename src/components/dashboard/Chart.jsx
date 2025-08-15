import { useEffect, useRef } from 'react';

const Chart = ({ data = [], type = 'line', title, color = 'blue' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Parse data
    const chartData = data.map(item => ({
      label: item._id || 'Unknown',
      value: item.count || 0
    }));
    
    if (chartData.length === 0) return;
    
    const maxValue = Math.max(...chartData.map(d => d.value));
    const minValue = Math.min(...chartData.map(d => d.value));
    const range = maxValue - minValue || 1;
    
    // Draw chart
    if (type === 'line') {
      drawLineChart(ctx, chartData, width, height, padding, range, maxValue, minValue, color);
    } else if (type === 'bar') {
      drawBarChart(ctx, chartData, width, height, padding, range, maxValue, minValue, color);
    }
    
  }, [data, type, color]);

  const drawLineChart = (ctx, data, width, height, padding, range, maxValue, minValue, color) => {
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i <= data.length; i++) {
      const x = padding + (i / data.length) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }
    
    // Draw line
    ctx.strokeStyle = getColor(color);
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((item, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((item.value - minValue) / range) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = getColor(color);
    data.forEach((item, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((item.value - minValue) / range) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    data.forEach((item, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = height - padding + 20;
      
      ctx.fillText(item.label, x, y);
    });
  };

  const drawBarChart = (ctx, data, width, height, padding, range, maxValue, minValue, color) => {
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // Draw bars
    ctx.fillStyle = getColor(color);
    data.forEach((item, index) => {
      const x = padding + index * (chartWidth / data.length) + barSpacing / 2;
      const barHeight = ((item.value - minValue) / range) * chartHeight;
      const y = padding + chartHeight - barHeight;
      
      ctx.fillRect(x, y, barWidth, barHeight);
    });
    
    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    data.forEach((item, index) => {
      const x = padding + index * (chartWidth / data.length) + chartWidth / data.length / 2;
      const y = height - padding + 20;
      
      ctx.fillText(item.label, x, y);
    });
  };

  const getColor = (colorName) => {
    const colors = {
      blue: '#3b82f6',
      green: '#10b981',
      purple: '#8b5cf6',
      yellow: '#f59e0b',
      red: '#ef4444'
    };
    return colors[colorName] || colors.blue;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full h-48 border border-gray-200 rounded-lg"
      />
    </div>
  );
};

export default Chart;
