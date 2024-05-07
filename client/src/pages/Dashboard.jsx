import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DashProfile, DashSidebar } from "../components";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import { signInSuccess } from "../redux/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import * as request from "../service/axios";

export default function Dashboard() {
  const location = useLocation();

  const [tab, setTab] = useState("");

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const refreshToken =  async()=>{
    await request.createRefresh(currentUser, dispatch, signInSuccess);
  }
  refreshToken();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen ">
      <div className="md:w-56">
        {/* sidebar */}
        <DashSidebar />
      </div>

      {/* profile */}
      {tab === "profile" && <DashProfile />}

      {/* posts */}
      {tab === "posts" && <DashPosts />}

      {/* users */}

      {tab === "users" && <DashUsers />}
    </div>
  );
}
