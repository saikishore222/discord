"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiCornerUpLeft, FiThumbsUp } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';
import { auth } from '../firebase';
import { updateLikesInFirebase } from '../firebase';
import ReplySection from '../components/Reply.jsx'; // Update the path as per your file structure
import { listenForMessages } from '../firebase'; // Update the path as per your file structure
import { addMessageToChannel, addCommentToMessage, getAllMessagesFromChannel, getAllCommentsFromMessage ,addMessageToPrivateChannel} from '../firebase';
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Chat = () => {
    const searchParams = useSearchParams();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [user, setUser] = useState('');
    const [type, setType] = useState('');
    const messagesEndRef = useRef(null);
    const [showReplySection, setShowReplySection] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null); // Track which message is being replied to
    const [likedMessages, setLikedMessages] = useState(new Set());
    const [imageLoading, setImageLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false); 
    const [selectedMenuOption, setSelectedMenuOption] = useState('chat'); // Track selected menu option

    const handleImageLoad = () => {
        // Handle image loading completion if needed
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleMenuClick = () => {
        setShowMenu(!showMenu); // Toggle menu visibility on icon click
    };
    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            setUser(user); // Update user state based on authentication status
        });

        return () => unsubscribeAuth(); // Clean up the listener when the component unmounts
    }, []);

    useEffect(() => {
        const search = searchParams.get('type');
        setType(search || '');    
        setUser(auth.currentUser);
        // Load initial messages from Firebase
        const loadMessages = async () => {
            const fetchedMessages = await getAllMessagesFromChannel(search || '');
            setMessages(fetchedMessages);
        };
    
        loadMessages();
        console.log('Messages loaded successfully.');
    
        // Start listening for real-time messages
        const unsubscribeMessages = listenForMessages(search || '', (realtimeMessages) => {
            setMessages(realtimeMessages);
        });
    
        // Clean up the listener when the component unmounts
        return () => unsubscribeMessages();
    }, [searchParams]);
    
      const handleSendMessage = async () => {
        if (inputValue.trim() !== '') {
            if (selectedMessage !== null) {
                await addCommentToMessage(type, selectedMessage.id, { text: inputValue, user: 'user' });
                setShowReplySection(false); // Hide the reply section after sending the message
                setSelectedMessage(null); // Clear the selected message state
            } else if (selectedMenuOption === 'prompt') {
                const userName = auth.currentUser.displayName;
                const userPhoto = auth.currentUser.photoURL;
                const newMessage = {
                    text: inputValue,
                    userName: userName,
                    userPhoto: userPhoto,
                    imageUrl: './load-32_128.gif',
                    replies: 0,
                    likes: 0,
                    timestamp: Date.now(),
                };

                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setInputValue('');
                toast.success("0.001 SOL deduct from wallet", { position: "top-right", autoClose: 8000 });   
                if (type === 'Private') {
                    await addMessageToPrivateChannel({ text: inputValue });
                } else {
                    await addMessageToChannel(type, { text: inputValue },true);
                }
            }
            else
            {
                const userName = auth.currentUser.displayName;
                const userPhoto = auth.currentUser.photoURL;
                const newMessage = {
                    text: inputValue,
                    userName: userName,
                    userPhoto: userPhoto,
                    replies: 0,
                    likes: 0,
                    timestamp: Date.now(),
                };
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setInputValue('');
                if (type === 'Private') {
                    await addMessageToPrivateChannel({ text: inputValue });
                } else {
                    await addMessageToChannel(type, { text: inputValue },false);
                }
            }
        }
    };
    

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleMenuOptionClick = (option) => {
        setSelectedMenuOption(option);
        setShowMenu(false); // Hide the menu after selecting an option
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };


    const handleLike = async (message) => {
        // Check if the message ID is already in the likedMessages set
        const isLiked = likedMessages.has(message.id);
    
        // Update like count locally and in Firebase
        const updatedLikesCount = isLiked ? message.likes - 1 : message.likes + 1;
        await updateLikesInFirebase(message.channelId, message.id, updatedLikesCount);
    
        // Update the message in the messages state array with the new like count
        setMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.id === message.id ? { ...msg, likes: updatedLikesCount } : msg
            )
        );
    
        // Update likedMessages set based on like/unlike action
        setLikedMessages((prevLikedMessages) => {
            const newLikedMessages = new Set(prevLikedMessages);
            if (isLiked) {
                newLikedMessages.delete(message.id); // Remove from likedMessages if unliked
            } else {
                newLikedMessages.add(message.id); // Add to likedMessages if liked
            }
            return newLikedMessages;
        });
    };
    

    const handleReply = (message) => {
        setShowReplySection(true);
        setSelectedMessage(message);
    };

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    

    const formatDate = (date) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className={` flex flex-col fixed border border-slate-300 h-[700px] w-[39rem] ${showReplySection ? '' : ''}  `} >
            {user ? (
                <React.Fragment>
                   <div className="flex space-x-4 p-4 bg-white ml-0 border-b-2 border-slate-300 max-w-[39rem] w-full">
                    <h2 className="text-lg font-semibold text-gray-800"># {type}</h2>
                    <h1 className="items-center mt-1 text-sm text-gray-600">-</h1>
                    <h1 className="items-center mt-1 text-sm text-gray-600">This is a {type} channel, users can generate images</h1>
                   </div>



                    {/* Messages display area */}
                    <div className="flex flex-col overflow-y-auto mt-0 max-w-[39rem] w-full">
                        {messages.map((message, index) => (
                            <div key={message.id} className="flex flex-col border-b-2 border-slate-300 border-x-0 border-b-0">
                                {/* Display date with border */}
                                {/* {index === 0 || formatDate(new Date(message.timestamp)) !== formatDate(new Date(messages[index - 1].timestamp)) ? (
                                    <div className="border-b border-gray-300 pb-2 mb-2">
                                        <div className="text-lg text-gray-500 text-center">{formatDate(new Date(message.timestamp))}</div>
                                    </div>
                                ) : null} */}
                                {/* Individual message with time */}
                                <div className={`flex items-start space-x-4`}>
                                    <div className={'flex bg-white rounded-lg p-6 w-full'}>
                                    <img src={message.userPhoto} alt="Profile" className="w-10 h-10 rounded-full" />
                                    <div className="ml-2 bg-white rounded-lg w-full">
                                        
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold text-gray-800">{message.userName}</span>
                                            <span className="text-sm text-gray-500">{formatTime(new Date(message.timestamp))}</span>
                                        </div>
                                        <p className="text-gray-800">{message.text}</p>
                                        {message.imageUrl && (
                                            <img src={message.imageUrl} className='rounded-lg mt-2' alt="Message Image" width={350} height={350} onLoad={handleImageLoad} />
                                        )}
                                        <div className="flex flex-row mt-2 post__footer">
                                            {/* Reply icon */}
                                            <div>
                                            <ChatBubbleOutlineIcon
                                                className="cursor-pointer text-gray-500 hover:text-gray-700"
                                                size={18}
                                                onClick={() => handleReply(message)}  
                                            />
                                            {/* Display the number of replies */}
                                            <span className="text-sm text-gray-500 ml-0.5">{message.replies}</span>
                                            </div>
                                            {/* Like icon */}
                                            <div>
                                            <FavoriteBorderIcon
                                                className={`cursor-pointer text-gray-500 hover:text-gray-700 ${likedMessages.has(message.id) ? 'text-blue-500' : ''}`}
                                                size={18}
                                                onClick={() => handleLike(message)}
                                            />
                                            {/* Display the number of likes */}
                                            <span className="text-sm text-gray-500 ml-0.5">{message.likes}</span>
                                            </div>
                                        </div>
                                    </div>
                                     </div>   
                                    
                                </div>                
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className='m-4'></div>
                    {/* Footer */}
                    <div className={`flex items-center p-4 bg-white mb-5  space-x-10 `}>
            <div className='mr-2 relative'>
                {showMenu && (
                    <div className="absolute bottom-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                        {/* Menu options */}
                        <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left" onClick={() => handleMenuOptionClick('prompt')}>
                            <AutoFixHighIcon color="primary" />
                        </button>
                        <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left" onClick={() => handleMenuOptionClick('chat')}>
                            <ChatBubbleOutlineIcon color="primary" />
                        </button>
                    </div>
                )}
                <AddCircleOutlineIcon
                    fontSize="large"
                    color="primary"
                    className="cursor-pointer text-gray-500 hover:text-gray-700 fixed bottom-0 mb-6 "
                    size={24}
                    onClick={handleMenuClick}
                />
            </div>
            
            <div className="mr-4 flex-grow relative">
            <div className="flex items-center border border-gray-300 rounded-lg p-2 space-x-2 fixed bottom-5 w-[34rem] ">
            {selectedMenuOption === 'prompt' && (
                <div className="flex items-center space-x-2">
                    <AutoFixHighIcon color="primary" />
                   
                </div>
            )}
            {selectedMenuOption === 'chat' && (
                <div className="flex items-center space-x-2">
                    <ChatBubbleOutlineIcon color="primary" className='items-center mt-1'/>
                   
                </div>
            )}
            <input 
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    {...(selectedMenuOption === 'prompt' && { placeholder: 'Type your prompt...' })}
                    {...(selectedMenuOption === 'chat' && { placeholder: 'Type your message...' })}
                    className="flex-grow bg-transparent outline-none"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage(e.target.value);
                        }
                    }}
                />
        </div>
            </div>
        </div>


                    {/* Render reply section if showReplySection is true */}
                    {showReplySection && <ReplySection message={selectedMessage} type={type} 
                    setShowReplySection={setShowReplySection}
                    setSelectedMessage={setSelectedMessage}
                    />}
                </React.Fragment>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-lg text-gray-600">
                        Please <span className="font-semibold cursor-pointer text-blue-600">log in</span> to access the chat.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Chat;
