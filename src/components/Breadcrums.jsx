// import React from 'react';
// import { Link } from 'react-router-dom';

// const Breadcrumbs = ({ folderPath, navigate }) => {
//     if (!folderPath) return null;

//     const parts = folderPath.split('/');
//     const breadcrumbItems = parts.map((part, index) => {
//         const path = parts.slice(0, index + 1).join('/');
//         return (
//             <span key={index}>
//                 <Link to={`/folder/${path}`}>{part}</Link>
//                 {index < parts.length - 1 && ' / '}
//             </span>
//         );
//     });

//     return (
//         <div className="breadcrumbs">
//             <Link to="/">Home</Link> / {breadcrumbItems}
//         </div>
//     );
// };

// export default Breadcrumbs;
