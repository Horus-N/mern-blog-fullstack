import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./index.css";
import {
  Home,
  About,
  SignIn,
  SignUp,
  Dashboard,
  Projects,
  CreatePost,
  UpdatePost,
  PostPage,
  Search,
} from "./pages";
import {
  Header,
  FooterCom,
  OnlyAdminPrivateroute,
  ScrollToTop,
} from "./components";
import Privateroute from "./components/Privateroute";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/search" element={<Search />} />
          <Route element={<Privateroute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<OnlyAdminPrivateroute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>
          <Route path="/projects" element={<Projects />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
        </Route>
      </Routes>
      <FooterCom />
    </BrowserRouter>
  );
}

export default App;
