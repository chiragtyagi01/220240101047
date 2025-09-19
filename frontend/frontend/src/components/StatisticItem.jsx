// import React, { useState } from 'react';

// // Mock click data generation for demonstration
// const generateMockClicks = (stat) => {
//     if (stat.clicks > 0) return stat.clickData;
//     if (Math.random() < 0.4) return []; // 40% chance of 0 clicks

//     const clickCount = Math.floor(Math.random() * 15) + 1;
//     const clicks = [];
//     for (let i = 0; i < clickCount; i++) {
//         clicks.push({
//             timestamp: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
//             source: ['Direct', 'Google', 'Facebook'][Math.floor(Math.random() * 3)],
//             location: ['New York, USA', 'London, UK', 'Tokyo, Japan'][Math.floor(Math.random() * 3)]
//         });
//     }
//     return clicks;
// };


// function StatisticItem({ stat }) {
//     const [isExpanded, setIsExpanded] = useState(false);

//     // Generate clicks on first render and memoize
//     const [clickDetails] = useState(() => generateMockClicks(stat));

//     const createdAt = new Date(stat.createdAt).toLocaleString();
//     const expiresAt = stat.expiresAt ? new Date(stat.expiresAt).toLocaleString() : 'Never';

//     return (
//         <div className="stat-item">
//             <div className="stat-item-header" onClick={() => setIsExpanded(!isExpanded)}>
//                 <div>
//                     <p><a href={stat.shortUrl} target="_blank" rel="noopener noreferrer" className="short-link">{stat.shortUrl}</a></p>
//                     <p><b>Clicks:</b> {clickDetails.length}</p>
//                 </div>
//                 <span>{isExpanded ? '▲' : '▼'}</span>
//             </div>
//             <p><b>Created:</b> {createdAt} | <b>Expires:</b> {expiresAt}</p>
//             {isExpanded && (
//                 <div className="click-details">
//                     <h4>Click Breakdown</h4>
//                     {clickDetails.length > 0 ? (
//                         clickDetails.map((click, index) => (
//                             <p key={index}>
//                                 <b>Time:</b> {click.timestamp} | <b>Source:</b> {click.source} | <b>Location:</b> {click.location}
//                             </p>
//                         ))
//                     ) : (
//                         <p>No click data available.</p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default StatisticItem;





import React, { useState } from 'react';
// import { useTheme } from '../context/ThemeContext'; // Can import if needed for specific theme-based rendering

// Mock click data generation for demonstration
const generateMockClicks = (stat) => {
    // Only generate if clickData is empty, otherwise use existing
    if (stat.clickData && stat.clickData.length > 0) return stat.clickData;
    
    // Simulate some clicks for new entries
    const clickCount = Math.floor(Math.random() * 10); // Up to 9 clicks
    if (clickCount === 0) return [];

    const clicks = [];
    for (let i = 0; i < clickCount; i++) {
        clicks.push({
            timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toLocaleString(), // Up to 7 days old
            source: ['Direct', 'Google', 'Facebook', 'Twitter', 'Email'][Math.floor(Math.random() * 5)],
            location: ['New York, USA', 'London, UK', 'Tokyo, Japan', 'Berlin, DE', 'Sydney, AU'][Math.floor(Math.random() * 5)]
        });
    }
    return clicks;
};


function StatisticItem({ stat }) {
    // const { theme } = useTheme(); // Example: if you wanted to change icon based on theme
    const [isExpanded, setIsExpanded] = useState(false);

    const createdAt = new Date(stat.createdAt).toLocaleString();
    const expiresAt = stat.expiresAt ? new Date(stat.expiresAt).toLocaleString() : 'Never';

    // Ensure clickData is generated and persistent within the stat object
    // For a real app, this would come from the backend. Here, we modify stat object for persistence.
    // This is a simple client-side mock; in a real app, stats object would be immutable.
    if (!stat.generatedClickData) {
        stat.generatedClickData = generateMockClicks(stat);
        stat.clicks = stat.generatedClickData.length; // Update total clicks count
    }

    return (
        <div className="stat-item">
            <div className="stat-item-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div>
                    <p><a href={stat.shortUrl} target="_blank" rel="noopener noreferrer" className="short-link">{stat.shortUrl}</a></p>
                    <p><b>Clicks:</b> {stat.clicks}</p>
                </div>
                <span>{isExpanded ? '▲' : '▼'}</span>
            </div>
            <p><b>Original:</b> {stat.originalUrl}</p>
            <p><b>Created:</b> {createdAt} | <b>Expires:</b> {expiresAt}</p>
            {isExpanded && (
                <div className="click-details">
                    <h4>Click Breakdown</h4>
                    {stat.generatedClickData.length > 0 ? (
                        stat.generatedClickData.map((click, index) => (
                            <p key={index}>
                                <b>Time:</b> {click.timestamp} | <b>Source:</b> {click.source} | <b>Location:</b> {click.location}
                            </p>
                        ))
                    ) : (
                        <p>No click data available.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default StatisticItem;