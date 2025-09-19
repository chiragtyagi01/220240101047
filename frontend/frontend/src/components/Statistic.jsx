// // import React from 'react';
// // import StatisticItem from './StatisticItem';

// // function Statistic({ stats }) {
// //     return (
// //         <section className="page stats-page">
// //             <h2>Shortened URL Statistics</h2>
// //             <div id="statsList">
// //                 {stats.length > 0 ? (
// //                     stats.map((stat, index) => <StatisticItem key={index} stat={stat} />)
// //                 ) : (
// //                     <p>No URLs have been shortened yet.</p>
// //                 )}
// //             </div>
// //         </section>
// //     );
// // }

// // export default Statistic;





// import React from 'react';
// import StatisticItem from './StatisticItem';
// // import { useTheme } from '../context/ThemeContext'; // Can import if needed

// function Statistic({ stats }) {
//     // const { theme } = useTheme(); // Example: if you wanted to apply theme class
//     return (
//         <section className="page stats-page">
//             <h2>Shortened URL Statistics</h2>
//             <div id="statsList">
//                 {stats.length > 0 ? (
//                     stats.map((stat, index) => <StatisticItem key={index} stat={stat} />)
//                 ) : (
//                     <p>No URLs have been shortened yet.</p>
//                 )}
//             </div>
//         </section>
//     );
// }

// export default Statistic;




// src/components/Statistic.jsx
import React, { useState, useMemo } from 'react';
import StatisticItem from './StatisticItem';

function EmptyState({ onNavigate }) {
    return (
        <div className="empty-state">
            <h3>No URLs Yet!</h3>
            <p>You haven't shortened any URLs. Get started now.</p>
            <button onClick={onNavigate}>Shorten a URL</button>
        </div>
    );
}

function Statistic({ stats, onNavigateToShortener }) {
    const [sortKey, setSortKey] = useState('createdAt_desc');

    const sortedStats = useMemo(() => {
        const sorted = [...stats];
        const [key, order] = sortKey.split('_');

        sorted.sort((a, b) => {
            let valA, valB;

            if (key === 'createdAt') {
                valA = new Date(a.createdAt);
                valB = new Date(b.createdAt);
            } else if (key === 'clicks') {
                valA = a.clicks || 0;
                valB = b.clicks || 0;
            }

            if (valA < valB) return order === 'asc' ? -1 : 1;
            if (valA > valB) return order === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [stats, sortKey]);

    if (stats.length === 0) {
        return <EmptyState onNavigate={onNavigateToShortener} />;
    }

    return (
        <section className="page stats-page">
            <div className="stats-header">
                <h2>Shortened URL Statistics</h2>
                <div className="sort-controls">
                    <label htmlFor="sort-select">Sort by:</label>
                    <select id="sort-select" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                        <option value="createdAt_desc">Newest First</option>
                        <option value="createdAt_asc">Oldest First</option>
                        <option value="clicks_desc">Most Clicks</option>
                        <option value="clicks_asc">Fewest Clicks</option>
                    </select>
                </div>
            </div>
            <div id="statsList">
                {sortedStats.map((stat, index) => <StatisticItem key={index} stat={stat} />)}
            </div>
        </section>
    );
}

export default Statistic;