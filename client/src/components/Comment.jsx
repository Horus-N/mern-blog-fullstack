import React, { useEffect, useRef, useState } from "react";
import { get } from "../service/axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { FaThumbsUp } from "react-icons/fa";
import { Button, Textarea } from "flowbite-react";
import { put } from "../service/axios";

function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [editContent, setEditContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const refCurrent = useRef(null);
  useEffect(() => {
    const getUser = async () => {
      const res = await get(
        `http://localhost:5000/api/user/getUser/${comment.userId}`
      );
      if (res.success) {
        setUser(res.rest);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = async () => {
    setIsEditing(true);
    if (refCurrent.current !== null) {
      refCurrent.current.focus();
    }
  };

  useEffect(() => {
    if (isEditing && refCurrent.current !== null) {
      handleEdit();
    }
  }, [isEditing]);

  const handleSave = async () => {
    try {
      const res = await put(
        `http://localhost:5000/api/comment/updateComment/${comment._id}`,
        { content: editContent },
        currentUser.token
      );
      if (res.success) {
        setIsEditing(false);
        onEdit(comment._id, editContent);
        setEditContent("");
      }
    } catch (error) {}
  };
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font- bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>

          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              ref={refCurrent}
              className="mb-2"
              placeholder="Edit a comment..."
              onChange={(e) => setEditContent(e.target.value)}
              value={editContent}
            />

            <div className="flex justify-end gap-2 text-xs">
              <Button
                onClick={handleSave}
                type="button"
                size={"sm"}
                gradientDuoTone={"purpleToBlue"}
              >
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                type="button"
                size={"sm"}
                gradientDuoTone={"purpleToBlue"}
                outline
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>

              <p className="text-gray-500">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="text-gray-400 hover:text-blue-500"
                      type="edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(comment._id)}
                      className="text-gray-400 hover:text-blue-500"
                      type="delete"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Comment;
