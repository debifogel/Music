// import React, { createContext, useContext } from 'react';
// import songService from './SongService';



// const SongServiceContext = createContext<SongServiceContextType | undefined>(undefined);

// export const SongServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  

//   return (
//     <SongServiceContext.Provider value={{ getSongs, getSongById }}>
//       {children}
//     </SongServiceContext.Provider>
//   );
// };

// export const useSongService = () => {
//   const context = useContext(SongServiceContext);
//   if (!context) {
//     throw new Error('useSongService חייב להיות בתוך SongServiceProvider');
//   }
//   return context;
// };