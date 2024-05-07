import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createComment } from "../service/axios";
import { get } from "../service/axios";
import {Comment} from '../components'

function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }

    const data = {
      content: comment,
      postId,
      userId: currentUser._id,
    };
    const res = await createComment(
      "http://localhost:5000/api/comment/create",
      data,
      currentUser.token
    );

    if (res?.success) {
      setComment("");
      setCommentError(null);
      setComments([...comments,res.newComment]);
    }
    if (res?.data?.success==='false') {
      setCommentError(res.data.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      const res = await get(
        `http://localhost:5000/api/comment/getPostComments/${postId}`
      );
      if (res.success) {
        setComments(res.message);
      }
    };
    getComments();
  }, [postId]);
  return (
    <div className="max-w-2xl mx-auto w-full">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser?.profilePicture}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link to={"/sign-in"} className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength={"200"}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button type="submit" outline gradientDuoTone={"purpleToBlue"}>
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color={"failure"} className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm flex items-center gap-1 my-5">
            <p className="">comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>

          {comments.map(cmt=>(
            <Comment
            key={cmt._id} comment={cmt} 
            />
          ))}
        </>
      )}
    </div>
  );
}

export default CommentSection;
