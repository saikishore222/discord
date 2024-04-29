import { auth } from '../firebase';
import { listenForComments, addCommentToMessage } from '../firebase';
import { useState,useEffect,useRef } from 'react';
import { FiSend, FiCornerUpLeft, FiThumbsUp } from 'react-icons/fi';
import { useMediaQuery } from '@react-hook/media-query';



const ReplySection = ({ message ,type,setShowReplySection,setSelectedMessage}) => {
    const [comments, setComments] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [likes, setLikes] = useState(message.likes);
    const isMobile = useMediaQuery('(max-width: 767px)'); // Define the mobile breakpoint
    const commentsEndRef = useRef(null); // Ref for scrolling to end of comments


    useEffect(() => {
        const unsubscribeComments = listenForComments(type, message.id, (newComments) => {
            // Append new comments to the existing comments array
            setComments((prevComments) => [...prevComments, ...newComments]);
        });

        return () => unsubscribeComments(); // Clean up the listener
    }, [type, message.id]);

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleLike = async (message) => {
        // Update the like count in Firebase
        await updateLikesInFirebase(message.channelId, message.id, message.likes + 1);
    
        // Update the local state with the new like count
        setMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.id === message.id ? { ...msg, likes: msg.likes + 1 } : msg
            )
        );
    };

    useEffect(() => {
        scrollToBottom();
    }, [comments]);

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const handleAddComment = async (commentText) => {
        if (commentText.trim() !== '') {
            const newComment = {
                text: commentText,
                sender: auth.currentUser.displayName,
                userPhoto: auth.currentUser.photoURL,
                date: Date.now(),
                likes: 0, // Initialize likes for each comment
            };

            // Update local state to add the new comment to the existing comments
            // Add the comment to Firestore
            await addCommentToMessage(type, message.id, newComment);

            // Clear the input value
            setInputValue('');
        }
    };

return (
    <div className={`fixed top-15  h-full w-1/4 bg-white z-10 p-4 shadow-lg overflow-y-auto ${isMobile ? 'left-0 w-full':'right-0'}`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Replying to:</h3>
            <button
                className="text-red-500 hover:text-red-700"
                onClick={() => {
                    setShowReplySection(false);
                    setSelectedMessage(null);
                }}
            >
                Close
            </button>
        </div>
        <div className="bg-gray-200 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-4">
                <img src={message.userPhoto} alt="Profile" className="w-10 h-10 rounded-full" />
                <div className="flex flex-col w-full">
                    <div className="bg-gray-100 rounded-lg p-2 mb-2">
                        <span className="font-semibold text-gray-800">{message.userName}</span>
                        <span className="text-sm text-gray-500 ml-2">{formatTime(new Date(message.timestamp))}</span>
                    </div>
                    <p className="text-gray-800">{message.text}</p>
                    <div className="flex items-center space-x-4 mt-2">
                        <FiThumbsUp
                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                            size={18}
                            onClick={handleLike}
                        />
                        <span className="text-sm text-gray-500">{likes}</span>
                    </div>
                </div>
            </div>
        </div>
        {/* Comments section with scrollbar */}
        <div className="bg-gray-100 rounded-lg p-3 mb-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Comments</h4>
            <div className="space-y-2">
                {comments.map((comment, index) => (
                    <div key={index} className="flex items-start">
                        <img src={comment.userPhoto} alt="Profile" className="w-8 h-8 rounded-full" />
                        <div className="bg-gray-200 rounded-lg p-2 ml-2 w-full">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-800">{comment.sender}</span>
                                <span className="text-sm text-gray-500">{formatTime(new Date(comment.date))}</span>
                            </div>
                            <p className="text-gray-800">{comment.text}</p>
                            <div className="flex items-center space-x-4 mt-2">
                                <FiThumbsUp
                                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                                    size={16}
                                    onClick={() => handleLike(comment)}
                                />
                                <span className="text-sm text-gray-500">{comment.likes}</span>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={commentsEndRef} /> {/* Ref for scrolling to end */}
            </div>
        </div>
        {/* Comment input */}
        <div className="flex items-center mt-4">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add a comment..."
                className="border border-gray-300 rounded-md p-2 w-full resize-none text-black focus:outline-none"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleAddComment(e.target.value);
                    }
                }}
            />
        </div>
    </div>
);
};

export default ReplySection;   