import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./index.css";
import { Home, About, SignIn, SignUp, Dashboard, Projects, CreatePost, UpdatePost } from "./pages";
import { Header, FooterCom,OnlyAdminPrivateroute } from "./components";
import Privateroute from "./components/Privateroute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route element={<Privateroute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<OnlyAdminPrivateroute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost/>} />
          </Route>
          <Route path="/projects" element={<Projects />} />
        </Route>
      </Routes>
      <FooterCom />
    </BrowserRouter>
  );
}

export default App;
