import TextInput from '@/Components/TextInput';
import { usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversations;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const isUserOnline = (userId) => onlineUsers[userId];

    console.log('conversations', conversations);
    console.log('selectedConversation', selectedConversation);

    const onSearch = (ev) => {
        const search = ev.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return (
                    conversation.name.toLowerCase().includes(search)
                )
            })
        )
    }

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? -1 : 1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                }
                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localCompare(
                        a.last_message_date
                    )
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else {
                    return 0;
                }
            })
        )
    }, [conversations])

    useEffect(() => {
        setLocalConversations(conversations);
    }, [localConversations])

    useEffect(() => {
        Echo.join('online')
            .here((users) => {
                const onlineUsersObject = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );
                setOnlineUsers((previousOnlineUsers) => {
                    return { ...previousOnlineUsers, ...onlineUsersObject };
                });
            })
            .joining((user) => {
                setOnlineUsers((previousOnlineUsers) => {
                    const updatedUsers = { ...previousOnlineUsers };
                    updatedUsers[user.id] = user;
                    return updatedUsers;
                });
            })
            .leaving((user) => {
                setOnlineUsers((previousOnlineUsers) => {
                    const updatedUsers = { ...previousOnlineUsers };
                    delete updatedUsers[user.id];
                    return updatedUsers;
                });
            });

        return () => {
            Echo.leave('online');
        }

    }, []);

    return (
        <>
            <div className="flex flex-1 w-full overflow-hidden">
                <div className={`
                    transition-all w-full sm:w-[220px] md:w-[300px] bg-slate-800
                    flex flex-col overflow-hidden
                    ${selectedConversation ? "-ml-[100%] sm:ml-0" : ""
                    }
                    `}>
                    <div className="flex items-center justify-between py-2 px-3 text-xl font-medium">
                        My conversations
                        <div
                            className="tooltip tooltip-left"
                            data-tip="Create new Group"
                        >
                            <button
                                onClick={(ev)=>setShowGroupModal(true)}
                                className="text-gray-400 hover:text-gray-200">
                                <PencilSquareIcon className="w-4 h-4 inline-block ml-2" />
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder="Filter users and groups"
                            className="w-full"
                        />
                    </div>
                    <div className="flex-1 overflow-auto">
                        {sortedConversations &&
                            sortedConversations.map((conversation) => (
                            <ConversationItem
                                    key={`${
                                        conversation.is_group
                                        ? "group_"
                                        : "user_"
                                        }${conversation.id}`}
                                    conversation={conversation}
                                    online={!!isUserOnline(conversation.id)}
                                    selectedConversation={selectedConversation}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex flex-1 flex-col overflow-hidden">
                    {children}
                </div>
            </div>

        </>
    )
}

export default ChatLayout
