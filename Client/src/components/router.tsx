import { createBrowserRouter } from "react-router-dom";
import ListSongs from "../Pages/ListSongs";
import Home from "../Pages/Home";
import Folders from "../Pages/Folders";
import PlayLists from "../Pages/PlayLists";
import AppLayout from "../Pages/AppLayout"; // Verify the file exists at this path or adjust the path accordingly
import AddSong from "./AddSong";

export const myRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout/>, // Corrected typo in `AppLayot`
    errorElement: <>Page not found</>, // Optional error handling for general route errors
    children: [
      {
        path: "home",
        element: <Home />,
        children: [
          {
            path: "songs/:filterType/:filterValue?",
            element: <ListSongs />,
          }
        ]
      },
      {
        path: "songs/:filterType/:filterValue?",
        element: <ListSongs />,
      },
      {
        path: "folders/songs/:filterType/:filterValue?",
        element: <ListSongs />,
      },
      {
        path: "playlists/songs/:filterType/:filterValue?",
        element: <ListSongs />,
      },
      {
        path: "folders",
        element: <Folders />,
        
      },
      {
        path: "playlists",
        element: <PlayLists />,
        
      },
      {
        path:"add-song",
        element:<AddSong/>
      }
    ]
  }
]);
