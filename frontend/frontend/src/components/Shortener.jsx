// import React, { useState } from 'react';

// const MAX_URLS = 5;

// const isValidUrl = (string) => {
//     try {
//         new URL(string);
//         return true;
//     } catch (_) {
//         return false;
//     }
// };

// function Shortener({ onShorten }) {
//     const [urlFields, setUrlFields] = useState([{ id: 1, longUrl: '', validity: '', shortcode: '', error: null }]);
//     const [results, setResults] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);

//     const handleAddField = () => {
//         if (urlFields.length < MAX_URLS) {
//             setUrlFields([...urlFields, { id: Date.now(), longUrl: '', validity: '', shortcode: '', error: null }]);
//         }
//     };

//     const handleInputChange = (id, event) => {
//         const { name, value } = event.target;
//         const newFields = urlFields.map(field => 
//             field.id === id ? { ...field, [name]: value, error: null } : field
//         );
//         setUrlFields(newFields);
//     };

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         let allValid = true;
//         const validatedFields = urlFields.map(field => {
//             if (!isValidUrl(field.longUrl)) {
//                 allValid = false;
//                 return { ...field, error: 'Please enter a valid URL.' };
//             }
//             return field;
//         });

//         setUrlFields(validatedFields);

//         if (allValid) {
//             setIsLoading(true);
//             setResults([]);
//             setTimeout(() => {
//                 const newResults = validatedFields.map(field => {
//                     const shortCode = field.shortcode || Math.random().toString(36).substr(2, 6);
//                     const expiryDate = field.validity ? new Date(Date.now() + field.validity * 60000) : null;
//                     return {
//                         originalUrl: field.longUrl,
//                         shortUrl: `https://sh.rt/${shortCode}`,
//                         expiresAt: expiryDate ? expiryDate.toISOString() : null,
//                         createdAt: new Date().toISOString()
//                     };
//                 });
//                 setResults(newResults);
//                 onShorten(newResults); // Pass data up to App component
//                 setIsLoading(false);
//             }, 1000);
//         }
//     };

//     return (
//         <section className="page">
//             <h2>Shorten a new URL</h2>
//             <form onSubmit={handleSubmit}>
//                 <div id="urlInputsContainer">
//                     {urlFields.map(field => (
//                         <div key={field.id} className="url-input-group">
//                             <div>
//                                 <input
//                                     type="text"
//                                     name="longUrl"
//                                     value={field.longUrl}
//                                     onChange={(e) => handleInputChange(field.id, e)}
//                                     placeholder="Enter your long URL here..."
//                                     required
//                                 />
//                                 {field.error && <div className="error-message">{field.error}</div>}
//                             </div>
//                             <input
//                                 type="number"
//                                 name="validity"
//                                 value={field.validity}
//                                 onChange={(e) => handleInputChange(field.id, e)}
//                                 placeholder="Validity (mins, optional)"
//                             />
//                             <input
//                                 type="text"
//                                 name="shortcode"
//                                 value={field.shortcode}
//                                 onChange={(e) => handleInputChange(field.id, e)}
//                                 placeholder="Custom shortcode (optional)"
//                             />
//                         </div>
//                     ))}
//                 </div>
//                 <div className="form-actions">
//                     <button type="button" id="addUrlBtn" onClick={handleAddField} disabled={urlFields.length >= MAX_URLS}>
//                         + Add Another URL
//                     </button>
//                     <button type="submit" id="submitBtn" disabled={isLoading}>
//                         {isLoading ? 'Shortening...' : 'Shorten URLs'}
//                     </button>
//                 </div>
//             </form>

//             {(isLoading || results.length > 0) && (
//                 <div className="results-container">
//                     <h3>Results</h3>
//                     {isLoading && <p>Shortening your URLs...</p>}
//                     {results.map((result, index) => (
//                         <div key={index} className="result-item">
//                             <p><b>Original:</b> {result.originalUrl}</p>
//                             <p><b>Shortened:</b> <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className="short-link">{result.shortUrl}</a></p>
//                             <p><b>Expires:</b> {result.expiresAt ? new Date(result.expiresAt).toLocaleString() : 'Never'}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </section>
//     );
// }

// export default Shortener;




import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const MAX_URLS = 5;

// Helper function for validation
const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

function Shortener({ onShorten }) {
    const { theme } = useTheme(); // Use theme context
    const [urlFields, setUrlFields] = useState([{ id: 1, longUrl: '', validity: '', shortcode: '', error: null }]);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddField = () => {
        if (urlFields.length < MAX_URLS) {
            setUrlFields([...urlFields, { id: Date.now(), longUrl: '', validity: '', shortcode: '', error: null }]);
        }
    };

    const handleInputChange = (id, event) => {
        const { name, value } = event.target;
        const newFields = urlFields.map(field => 
            field.id === id ? { ...field, [name]: value, error: null } : field
        );
        setUrlFields(newFields);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let allValid = true;
        const validatedFields = urlFields.map(field => {
            let fieldError = null;
            if (!isValidUrl(field.longUrl)) {
                fieldError = 'Please enter a valid URL.';
            } else if (field.validity && (parseInt(field.validity) <= 0 || !Number.isInteger(Number(field.validity)))) {
                fieldError = 'Validity must be a positive whole number.';
            }

            if (fieldError) allValid = false;
            return { ...field, error: fieldError };
        });

        setUrlFields(validatedFields);

        if (allValid) {
            setIsLoading(true);
            setResults([]);
            // Mock API call
            setTimeout(() => {
                const newResults = validatedFields.map(field => {
                    const shortCode = field.shortcode || Math.random().toString().substring(2, 8); // Shorter random code
                    const expiryDate = field.validity ? new Date(Date.now() + field.validity * 60000) : null;
                    return {
                        originalUrl: field.longUrl,
                        shortUrl: `https://sh.rt/${shortCode}`,
                        expiresAt: expiryDate ? expiryDate.toISOString() : null,
                        createdAt: new Date().toISOString()
                    };
                });
                setResults(newResults);
                onShorten(newResults); // Pass data up to App component
                setIsLoading(false);
            }, 1000);
        }
    };

    return (
        <section className="page">
            <h2>Shorten a new URL</h2>
            <form onSubmit={handleSubmit}>
                <div id="urlInputsContainer">
                    {urlFields.map(field => (
                        <div key={field.id} className="url-input-group">
                            <div>
                                <input
                                    type="text"
                                    name="longUrl"
                                    value={field.longUrl}
                                    onChange={(e) => handleInputChange(field.id, e)}
                                    placeholder="Enter your long URL here..."
                                    required
                                />
                                {field.error && <div className="error-message">{field.error}</div>}
                            </div>
                            <input
                                type="number"
                                name="validity"
                                value={field.validity}
                                onChange={(e) => handleInputChange(field.id, e)}
                                placeholder="Validity (mins, optional)"
                            />
                            <input
                                type="text"
                                name="shortcode"
                                value={field.shortcode}
                                onChange={(e) => handleInputChange(field.id, e)}
                                placeholder="Custom shortcode (optional)"
                            />
                        </div>
                    ))}
                </div>
                <div className="form-actions">
                    <button type="button" id="addUrlBtn" onClick={handleAddField} disabled={urlFields.length >= MAX_URLS}>
                        + Add Another URL
                    </button>
                    <button type="submit" id="submitBtn" disabled={isLoading}>
                        {isLoading ? 'Shortening...' : 'Shorten URLs'}
                    </button>
                </div>
            </form>

            {(isLoading || results.length > 0) && (
                <div className="results-container">
                    <h3>Results</h3>
                    {isLoading && <p>Shortening your URLs...</p>}
                    {results.map((result, index) => (
                        <div key={index} className="result-item">
                            <p><b>Original:</b> {result.originalUrl}</p>
                            <p><b>Shortened:</b> <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className="short-link">{result.shortUrl}</a></p>
                            <p><b>Expires:</b> {result.expiresAt ? new Date(result.expiresAt).toLocaleString() : 'Never'}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default Shortener;