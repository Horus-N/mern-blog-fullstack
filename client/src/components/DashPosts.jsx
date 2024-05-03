import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as request from "../service/axios";
import { Table,Modal,Button} from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore]  = useState(true);
  const [showModal, setShowModal]  = useState(false);
  const [postIdToDelete,setPostIdToDelete] = useState('')

  useEffect(() => {
    const apiPosts = async () => {
      try {
        const res = await request.get(
          `http://localhost:5000/api/post/getposts?userId=${currentUser._id}`
        );
        if (res.success === true) {
          setUserPosts(res.posts);
          if(res.posts.length<9){
            setShowMore(false);

          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      apiPosts();
    }
  }, [currentUser._id]);

  const handleShowMore= async()=>{
    const startIndex = userPosts.length;
    const res = await request.get(
      `http://localhost:5000/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
    );
    if(res.success){
      setUserPosts((prev)=>[...prev,...res.posts]);
      if(res.posts.length<9){
        setShowMore(false);
      }
    }
    try {
      
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeletePost = async ()=>{
    setShowModal(false);
    try {
      const res = await request.deletePost(`http://localhost:5000/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,currentUser.token);
      if(res.success){
        setUserPosts((prev)=>prev.filter((post)=>post._id!==postIdToDelete))
      }else{
        console.log(res);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className="table-auto overflow-x-scroll
     md:mx-auto p-3 scrollbar scrollbar-track-slate-100
     scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700
     dark:scrollbar-thumb-slate-300">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date update</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title </Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>

                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {" "}
                      {post.title}
                    </Link>
                  </Table.Cell>

                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span onClick={()=>{setShowModal(true);
                    setPostIdToDelete(post._id)}} className="font-medium text-red-500 hover:underline hover:cursor-pointer">
                      Delete
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline hover:cursor-pointer"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                Show more
              </button>
            )
          }
        </>
      ) : (
        <p>You have no post yet !</p>
      )}

<Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle
              className="h-14 w-14 text-gray-400
            dark:text-gray-200 mb-4 mx-auto"
            />
            <h3 className="mb-5 text-lg text--gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashPosts;
